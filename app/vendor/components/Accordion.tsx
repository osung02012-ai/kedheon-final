'use client';

import React from 'react';

/* ------------------------------------------------------------------
 * Vendor — 1줄 클릭형 아코디언
 * 기본은 "제목 · 지역 · 조건/▾" 한 줄이고, 누른 항목만 안쪽 상세가 열린다.
 * (바깥 도배 금지 — 모든 거래 정보는 이 안쪽에만 둔다.)
 * ------------------------------------------------------------------ */

/** 한 묶음에서 한 번에 하나만 열리는 상태 */
export function useAccordion(initial: string | null = null) {
  const [open, setOpen] = React.useState<string | null>(initial);
  const toggle = React.useCallback((id: string) => {
    setOpen(cur => (cur === id ? null : id));
  }, []);
  return { open, toggle, isOpen: (id: string) => open === id };
}

export default function AccRow({
  id,
  open,
  onToggle,
  icon,
  title,
  titleNoTranslate = false,
  badge,
  region,
  price,
  accent = 'plain',
  children,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  icon?: string;
  title: string;
  titleNoTranslate?: boolean;
  /** 상태 칩 — 제목 옆. 글자로 뜻을 전한다(색만 의존 금지) */
  badge?: React.ReactNode;
  /** 지역(도시·국기) — 접힌 줄에 그대로 보인다 */
  region?: React.ReactNode;
  /** 조건(Pi) — 접힌 줄 오른쪽 */
  price?: React.ReactNode;
  accent?: 'plain' | 'red';
  children: React.ReactNode;
}) {
  const panelId = `acc-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden transition-colors ${
        accent === 'red'
          ? open
            ? 'border-[#dc2626]'
            : 'border-[#dc2626]/40'
          : open
            ? 'border-neutral-400'
            : 'border-neutral-200'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center gap-1.5 px-2.5 py-2.5 text-left active:bg-neutral-50"
      >
        {icon && (
          <span
            aria-hidden
            translate="no"
            className="notranslate shrink-0 text-[length:calc(14px*var(--pi-scale))] leading-none"
          >
            {icon}
          </span>
        )}
        <span
          translate={titleNoTranslate ? 'no' : undefined}
          className={`min-w-0 flex-1 truncate t-card ${
            accent === 'red' ? 'text-[#dc2626]' : 'text-black'
          } ${titleNoTranslate ? 'notranslate' : ''}`}
          title={title}
        >
          {title}
        </span>
        {badge}
        {region && <span className="shrink-0 max-w-[86px] truncate t-tag text-gray-400">{region}</span>}
        {price && <span className="shrink-0 t-tag text-[#dc2626] whitespace-nowrap">{price}</span>}
        <span
          aria-hidden
          className={`shrink-0 text-gray-400 t-tag transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div id={panelId} className="px-2.5 pb-2.5 pt-2 border-t border-neutral-100 space-y-1.5 text-left">
          {children}
        </div>
      )}
    </div>
  );
}
