'use client';

import React from 'react';
import { STEP_RAIL, JLABEL } from '../lib/journey';
import { tr, type Lang } from '../lib/i18n';

/** 6단계 여정 레일 — 칸을 누르면 해당 섹션으로 이동(앵커 스크롤).
 *  인증 뱃지 범례는 바깥에 두지 않는다(각 항목을 열었을 때 안쪽에서만 보인다). */
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
    </div>
  );
}
