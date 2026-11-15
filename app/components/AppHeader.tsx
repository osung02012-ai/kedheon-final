'use client';

import React from 'react';

/**
 * 4대 앱 공통 상단 네비 — 케데헌 규격(흰 바탕·검정 테두리 하단선·sticky).
 *
 * Pi Browser 처럼 텍스트 배율이 커지는 WebView에서 로고·π KYC 배지·언어 선택·액션 버튼이
 * 한 줄에 몰려 오른쪽이 잘리던 문제를 없애기 위해
 *   - 좁은 화면에서는 브랜드 줄 / 컨트롤 줄 2단으로 내리고(`flex-col sm:flex-row`)
 *   - 컨트롤 줄은 넘치면 스스로 다음 줄로 접히게(`flex-wrap`) 한다.
 * 브랜드는 `min-w-0` 이라 아주 좁아지면 말줄임(truncate)으로 버틴다.
 */
export default function AppHeader({
  brand,
  children,
}: {
  brand: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <nav className="w-full max-w-5xl sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-neutral-200">
      <div className="flex flex-col gap-1.5 px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-4 sm:py-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">{brand}</div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 min-w-0">{children}</div>
      </div>
    </nav>
  );
}
