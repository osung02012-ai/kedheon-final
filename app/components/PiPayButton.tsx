'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePi } from './PiProvider';

/**
 * PiPayButton — 케드헌 표준 Pi 결제 버튼 (Civil · FactFilter · Hangang 공용)
 *  - Pi Browser: Pi 결제창 → 서버 승인(/api/pi/approve) → 서버 완료(/api/pi/complete)
 *  - 일반 웹: 결제를 만들지 않고 "Pi Browser에서만 결제" 안내만 인라인으로 보여 준다.
 *  - 기존 화면 흐름을 건드리지 않도록 작은 보조 버튼으로 쓰고, 실패해도 페이지 동작은 유지된다.
 */

export interface PiPayButtonProps {
  /** 결제 금액(Pi). 0.01 단위까지 반올림된다. */
  amount: number;
  /** 결제 메모 (Pi 결제창에 표시) */
  memo: string;
  /** 기본 라벨 */
  label: string;
  /** 결제 완료 후 라벨 */
  doneLabel?: string;
  /** 일반 브라우저(웹 체험)에서 눌렀을 때 안내 */
  webHint?: string;
  /** 사용자가 결제를 취소했을 때 안내 */
  cancelHint?: string;
  /** 결제 실패 시 안내 */
  failHint?: string;
  metadata?: Record<string, unknown>;
  className?: string;
  onPaid?: (paymentId?: string) => void;
}

export default function PiPayButton({
  amount,
  memo,
  label,
  doneLabel,
  webHint,
  cancelHint,
  failHint,
  metadata,
  className = '',
  onPaid
}: PiPayButtonProps) {
  const { pay, paying } = usePi();
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const flash = (text: string) => {
    setMsg(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 6000);
  };

  const handleClick = async () => {
    if (paying || done) return;
    const result = await pay(amount, memo, metadata);

    if (result.ok) {
      setDone(true);
      onPaid?.(result.paymentId);
      return;
    }
    if (result.status === 'unavailable' && result.mode === 'web') {
      flash(webHint || result.message);
      return;
    }
    if (result.status === 'cancelled') {
      flash(cancelHint || result.message);
      return;
    }
    flash(failHint || result.message);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={paying || done}
        className={`w-full flex items-center justify-center gap-1.5 border-2 rounded-xl py-2.5 text-[11px] md:text-xs font-black transition-all active:scale-95 ${
          done
            ? 'bg-white text-black border-black'
            : 'bg-white text-black border-black hover:bg-black hover:text-white'
        } ${paying ? 'opacity-60' : ''}`}
      >
        <span translate="no" className="notranslate text-[#7d4698] leading-none">π</span>
        <span translate="no" className="notranslate leading-none">
          {done ? (doneLabel || label) : paying ? '…' : label}
        </span>
      </button>
      {msg && (
        <p className="text-[10px] md:text-[11px] text-gray-400 font-bold leading-snug text-center">{msg}</p>
      )}
    </div>
  );
}
