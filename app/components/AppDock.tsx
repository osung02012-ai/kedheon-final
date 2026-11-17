'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 앱 공통 하단 고정 독 — KEDHEON · CIVIL · FACTFILTER · HANGANG · XAEA12 · NEXUS · VENDOR
 *
 * Pi Browser(Android WebView)는 시스템 글꼴 배율을 텍스트에 그대로 곱한다(실측 약 1.5배).
 * 예전 구현은 `flex-1 min-w-0` 로 6개를 한 줄에 밀어 넣어, 글자가 커지면 라벨끼리
 * 겹쳐 뭉개졌다(`FACTFILTEHANGANGNEXUS`, 활성 알약 안 `KEDHEO`). 이제는
 *   - 각 항목 `shrink-0 whitespace-nowrap` (절대 찌그러지지 않음)
 *   - 412px 폰 기준 7개가 한 줄에 들어가고, 글자가 커지면 독 안에서 좌우 스와이프
 *   - 넘칠 때만 좌우 가장자리에 페이드를 띄워 '더 있다'를 알린다
 *   - 활성 항목이 화면 밖에 있으면 마운트 시 가운데로 스크롤한다
 * 규격(테두리 2px 검정·rounded-2xl·흰 바탕)은 종전과 동일하다.
 */
const DOCK_ITEMS: { name: string; path: string }[] = [
  { name: 'KEDHEON', path: '/' },
  { name: 'CIVIL', path: '/civil' },
  { name: 'FACTFILTER', path: '/factfilter' },
  { name: 'HANGANG', path: '/hangang' },
  { name: 'XAEA12', path: '/xaea12' },
  { name: 'NEXUS', path: '#' },
  { name: 'VENDOR', path: '#' },
];

export default function AppDock({
  active,
  soonMessage = ' 서비스 준비 중입니다.',
}: {
  active: string;
  soonMessage?: string;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [edge, setEdge] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setEdge({
      left: el.scrollLeft > 2,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
    });
  }, []);

  // 활성 앱이 화면 밖이면(예: HANGANG) 가운데로 당겨 온다. 스크롤 중에는 건드리지 않는다.
  const revealActive = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const activeEl = el.querySelector<HTMLElement>('[data-active="true"]');
    if (!activeEl) return;
    const start = activeEl.offsetLeft;
    const end = start + activeEl.offsetWidth;
    const visibleStart = el.scrollLeft;
    const visibleEnd = visibleStart + el.clientWidth;
    if (start < visibleStart + 4 || end > visibleEnd - 4) {
      const target = start - (el.clientWidth - activeEl.offsetWidth) / 2;
      el.scrollLeft = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
    }
    measure();
  }, [measure]);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    revealActive();
    // 웹폰트·텍스트 배율 적용 뒤 레이아웃이 한 번 더 바뀌므로 다시 맞춘다.
    const timers = [60, 250, 800].map(ms => window.setTimeout(revealActive, ms));
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', revealActive);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(revealActive) : null;
    ro?.observe(el);
    const activeEl = el.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) ro?.observe(activeEl);
    return () => {
      timers.forEach(t => window.clearTimeout(t));
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', revealActive);
      ro?.disconnect();
    };
  }, [measure, revealActive]);

  return (
    <footer className="fixed bottom-3 sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 max-w-5xl mx-auto bg-white border border-neutral-200 px-1.5 py-1.5 rounded-2xl z-[1000] shadow-lg font-black">
      <div className="relative">
        <div ref={rowRef} className="no-scrollbar flex items-center gap-0.5 md:gap-1.5 overflow-x-auto">
          {DOCK_ITEMS.map(app => {
            const isActive = app.name === active;
            return (
              <button
                key={app.name}
                type="button"
                translate="no"
                data-active={isActive ? 'true' : undefined}
                style={{ fontSize: 'clamp(9px, 2.4vw, 11.5px)' }}
                onClick={() => {
                  if (app.path === '#') {
                    alert(app.name + soonMessage);
                  } else if (!isActive) {
                    window.location.href = app.path;
                  }
                }}
                className={`notranslate shrink-0 whitespace-nowrap leading-none px-1 py-3 md:flex-1 md:px-2.5 md:py-3.5 rounded-xl text-center tracking-tight transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isActive ? 'bg-black text-white shadow-sm' : 'text-neutral-500 hover:text-black'
                }`}
              >
                {app.name}
              </button>
            );
          })}
        </div>
        {/* 스와이프 안내 페이드 — 넘칠 때만 보인다 */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white to-transparent transition-opacity ${edge.left ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white to-transparent transition-opacity ${edge.right ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </footer>
  );
}
