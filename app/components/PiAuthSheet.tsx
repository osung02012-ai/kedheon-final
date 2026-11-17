'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GATE, gate, gateActionLine, type GateLang } from './pi-gate-i18n';

/**
 * PiAuthSheet — 실행 권한(Pi 지갑 인증) 안내 패널
 *
 * 일반 웹(크롬·사파리)이나 미인증 상태에서 투표·제안·청원·제보·결제 같은 실행을 누르면
 * 어느 앱에서든 이 하나의 패널이 뜬다. (PiProvider가 전역으로 한 번만 렌더)
 *  - 읽기 전용 안내 + Pi Browser에서 열기 안내 + 케데헌 루키 가이드(kedheon.com) 링크
 *  - Pi Browser 안에서는 곧바로 KYC 인증 버튼을 준다.
 *  - 문구는 10개국어(pi-gate-i18n.ts) 고정.
 */
export interface PiAuthSheetProps {
  open: boolean;
  lang: GateLang;
  /** 눌렀던 액션 이름 (예: '찬성 투표') */
  action?: string | null;
  inPiBrowser: boolean;
  connecting: boolean;
  onConnect: () => void;
  onClose: () => void;
}

export default function PiAuthSheet({
  open,
  lang,
  action,
  inPiBrowser,
  connecting,
  onConnect,
  onClose
}: PiAuthSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [address, setAddress] = useState('kedheon.com');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const origin = window.location.origin.replace(/^https?:\/\//, '');
    const path = window.location.pathname || '/';
    setAddress(`${origin}${path === '/' ? '' : path}`);
    setCopied(false);
  }, [open]);

  if (!mounted || !open) return null;

  const copyLink = async () => {
    try {
      const path = window.location.pathname || '/';
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const actionLine = gateActionLine(lang, action);

  const sheet = (
    <div
      className="fixed inset-0 z-[3500] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl border border-neutral-200 p-4 md:p-5 space-y-3 text-left shadow-2xl font-black"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-block bg-black text-white text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] font-black px-2 py-0.5 rounded">
                🔒 {gate(GATE.readOnly, lang)}
              </span>
              <span translate="no" className="notranslate text-[#7d4698] text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] font-black">
                π Pi KYC
              </span>
            </div>
            <h3 className="text-black text-[length:calc(13px*var(--pi-scale))] md:text-[length:calc(16px*var(--pi-scale))] font-black mt-1.5">
              {gate(GATE.title, lang)}
            </h3>
            {actionLine && (
              <p className="text-[#dc2626] text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] font-black mt-1 leading-snug break-words">
                {actionLine}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label={gate(GATE.close, lang)}
            className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 text-[length:calc(13px*var(--pi-scale))] font-black hover:bg-neutral-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-500 text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] font-bold leading-relaxed">
          {gate(GATE.body, lang)}
        </p>

        {inPiBrowser ? (
          <>
            <p className="text-gray-400 text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] font-bold leading-snug">
              {gate(GATE.piBrowserHint, lang)}
            </p>
            <button
              onClick={onConnect}
              disabled={connecting}
              className="w-full bg-[#dc2626] hover:bg-black disabled:opacity-60 text-white font-black py-3 rounded-xl text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(13px*var(--pi-scale))] transition-all active:scale-95 cursor-pointer"
            >
              {connecting ? gate(GATE.connecting, lang) : gate(GATE.authBtn, lang)}
            </button>
          </>
        ) : (
          <>
            <ol className="text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] text-gray-600 font-bold space-y-1 list-decimal list-inside">
              <li>{gate(GATE.step1, lang)}</li>
              <li>{gate(GATE.step2, lang)}</li>
              <li>{gate(GATE.step3, lang)}</li>
            </ol>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <code translate="no" className="notranslate text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] font-mono text-black break-all">
                {address}
              </code>
              <button
                onClick={copyLink}
                className="shrink-0 px-2 py-1 rounded-lg text-[length:calc(11px*var(--pi-scale))] font-black bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-all"
              >
                {copied ? gate(GATE.copied, lang) : gate(GATE.copy, lang)}
              </button>
            </div>
            <a
              href="https://kedheon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 bg-black text-white rounded-xl px-3 py-2.5 text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] font-black hover:bg-[#dc2626] transition-all"
            >
              <span className="min-w-0 truncate">📘 {gate(GATE.guide, lang)}</span>
              <span className="shrink-0 text-gray-400">↗</span>
            </a>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full bg-neutral-100 text-neutral-800 font-black py-2 rounded-lg text-[length:calc(11px*var(--pi-scale))] md:text-[length:calc(11px*var(--pi-scale))] hover:bg-neutral-200 transition-all"
        >
          {gate(GATE.close, lang)}
        </button>
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}
