'use client';

import React from 'react';
import { usePi } from './PiProvider';
import { GATE, gate } from './pi-gate-i18n';

/**
 * PiReadOnlyBanner — 미인증 상태에서 페이지 상단에 붙는 읽기 전용 띠
 *  - 열람/탐색은 그대로 두고, 실행(투표·제안·청원·제보·결제)만 잠긴다는 사실을 먼저 알린다.
 *  - '인증 방법'을 누르면 PiAuthSheet(전역)가 뜬다.
 *  - Pi KYC 인증이 끝나면 스스로 사라진다.
 */
export default function PiReadOnlyBanner({ className = '' }: { className?: string }) {
  const { authenticated, gateLang, openAuthSheet } = usePi();
  if (authenticated) return null;

  return (
    <div
      className={`w-full flex items-center justify-between gap-2 bg-white border border-[#dc2626] rounded-xl px-3 py-2 shadow-sm ${className}`}
    >
      <p className="text-[10px] md:text-[11px] font-black text-[#dc2626] leading-snug min-w-0">
        🔒 {gate(GATE.banner, gateLang)}
      </p>
      <button
        type="button"
        onClick={openAuthSheet}
        className="shrink-0 whitespace-nowrap bg-black hover:bg-[#dc2626] text-white text-[10px] md:text-[11px] font-black px-2 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
      >
        {gate(GATE.bannerBtn, gateLang)}
      </button>
    </div>
  );
}
