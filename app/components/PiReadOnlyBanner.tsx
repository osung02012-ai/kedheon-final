'use client';

import React from 'react';
import { usePi } from './PiProvider';
import { GATE, gate } from './pi-gate-i18n';

/**
 * PiReadOnlyBanner — 미인증 상태에서 페이지 상단에 붙는 읽기 전용 띠
 *  - 열람/탐색은 그대로 두고, 실행(투표·제안·청원·제보·결제)만 잠긴다는 사실을 먼저 알린다.
 *  - '인증 방법'을 누르면 PiAuthSheet(전역)가 뜬다.
 *  - Pi KYC 인증이 끝나면 스스로 사라진다.
 *
 * Pi Browser(Android WebView)의 글꼴 배율(실측 약 1.5배)·좁은 화면에서도 배너가 좌우로
 * 잘리지 않도록: 배너는 `w-full max-w-full`, 문구는 `flex-1 min-w-0 break-keep`,
 * 버튼은 `shrink-0 ml-auto` 로 두고 좁아지면 버튼이 다음 줄로 접히게(flex-wrap) 한다.
 */
export default function PiReadOnlyBanner({ className = '' }: { className?: string }) {
  const { authenticated, gateLang, openAuthSheet } = usePi();
  if (authenticated) return null;

  return (
    <div
      className={`w-full max-w-full flex flex-wrap items-center gap-x-2 gap-y-1.5 bg-red-50 border border-[#dc2626]/30 rounded-xl px-3 py-2 ${className}`}
    >
      <p className="min-w-0 flex-1 t-sub-snug text-[#dc2626] break-keep">
        🔒 {gate(GATE.banner, gateLang)}
      </p>
      <button
        type="button"
        onClick={openAuthSheet}
        className="shrink-0 ml-auto whitespace-nowrap bg-black hover:bg-[#dc2626] text-white t-tag px-2 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
      >
        {gate(GATE.bannerBtn, gateLang)}
      </button>
    </div>
  );
}
