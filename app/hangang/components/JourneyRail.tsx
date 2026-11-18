'use client';

import React from 'react';
import AuthBadge from './AuthBadge';
import { STEP_RAIL, JLABEL } from '../lib/journey';
import { BADGE_ORDER, BADGE_DESC } from '../lib/badges';
import { tr, type Lang } from '../lib/i18n';

/** 6단계 여정 레일 — 칸을 누르면 해당 섹션으로 이동(앵커 스크롤) */
export default function JourneyRail({ lang }: { lang: Lang }) {
  const jump = (id: string) => {
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="mt-2.5">
      <p className="t-tag text-gray-400 text-left mb-1">{tr(JLABEL.railHint, lang)}</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {STEP_RAIL.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => jump(s.id)}
            className="shrink-0 bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 rounded-xl px-3 py-2 text-left transition-colors active:scale-95"
          >
            <span className="block t-tag text-[#dc2626]">{s.no}</span>
            <span className="block t-tag mt-0.5 whitespace-nowrap">
              <span className="mr-1">{s.icon}</span>
              {tr(s.label, lang)}
            </span>
          </button>
        ))}
      </div>

      {/* 인증 뱃지 범례 — 미성년·무인증 방문자가 실행 전에 판단하도록 */}
      <div className="mt-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-[var(--card-shadow)] px-3 py-2.5 text-left">
        <p className="t-tag uppercase text-gray-400 mb-1.5">{tr(JLABEL.badgeLegend, lang)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
          {BADGE_ORDER.map(k => (
            <div key={k} className="flex items-start gap-1.5">
              <AuthBadge kind={k} lang={lang} className="mt-[1px]" />
              <p className="t-tag text-neutral-500 leading-relaxed min-w-0">{tr(BADGE_DESC[k], lang)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
