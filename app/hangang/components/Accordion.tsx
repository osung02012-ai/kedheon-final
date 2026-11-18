'use client';

import React from 'react';
import AuthBadge from './AuthBadge';
import { BADGE_DESC, type BadgeKind } from '../lib/badges';
import { tr, type Lang } from '../lib/i18n';

/* ------------------------------------------------------------------
 * 1줄 클릭형 아코디언 — 기본은 "제목 1줄 + ▾", 누른 항목만 안쪽이 열린다.
 * 인증·미성년 조건은 바깥 표면에 붙이지 않고, 열린 안쪽에서만 보여 준다.
 * ------------------------------------------------------------------ */

/** 한 묶음 안에서 한 번에 하나만 열리는 상태(누른 항목만 펼침). */
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
  meta,
  accent = 'plain',
  children,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  icon?: string;
  title: string;
  titleNoTranslate?: boolean;
  meta?: React.ReactNode;
  /** red = "막히면 이렇게" 같은 주의 항목 */
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
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left active:bg-neutral-50"
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
          className={`min-w-0 flex-1 t-card truncate ${accent === 'red' ? 'text-[#dc2626]' : 'text-black'} ${
            titleNoTranslate ? 'notranslate' : ''
          }`}
          title={title}
        >
          {title}
        </span>
        {meta && <span className="shrink-0 t-tag text-gray-400 whitespace-nowrap">{meta}</span>}
        <span
          aria-hidden
          className={`shrink-0 text-gray-400 t-tag transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div id={panelId} className="px-3 pb-3 pt-2 border-t border-neutral-100 space-y-1.5 text-left">
          {children}
        </div>
      )}
    </div>
  );
}

/** 열린 안쪽에만 붙는 인증·연령 조건 1줄(미성년 안내 포함) */
export function Requirement({ kind, lang }: { kind: BadgeKind; lang: Lang }) {
  return (
    <div className="flex items-start gap-1.5">
      <AuthBadge kind={kind} lang={lang} className="mt-[1px]" />
      <p className="t-tag text-neutral-500 leading-relaxed min-w-0">{tr(BADGE_DESC[kind], lang)}</p>
    </div>
  );
}

/** 안쪽 상세의 공식 링크 한 줄 */
export function RowLink({ url, name }: { url: string; name: string }) {
  return (
    <div className="flex justify-end">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="t-tag text-[#dc2626] hover:underline break-all"
      >
        <span translate="no" className="notranslate">{name}</span> ↗
      </a>
    </div>
  );
}
