'use client';

import React from 'react';
import SectionHead from './SectionHead';
import AuthBadge from './AuthBadge';
import { JLABEL, type Card } from '../lib/journey';
import { tr, type Lang, type L10 } from '../lib/i18n';

/** "막히면 이렇게" 회색 박스 — 미성년·무인증자가 실제로 막히는 지점의 대안 1줄 */
export function BypassNote({ lines, lang }: { lines: L10[]; lang: Lang }) {
  if (!lines.length) return null;
  return (
    <div className="mt-2 bg-neutral-50 border-l-[3px] border-[#dc2626] rounded-lg px-3 py-2.5 text-left">
      <p className="t-tag text-[#dc2626] mb-1">{tr(JLABEL.bypassTitle, lang)}</p>
      <ul className="space-y-1">
        {lines.map((l, i) => (
          <li key={i} className="flex gap-1.5">
            <span className="shrink-0 t-tag text-[#dc2626]">·</span>
            <span className="t-body text-neutral-600">{tr(l, lang)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 여정 섹션 공통 — 머리글 + 카드(뱃지) + 우회 노트 */
export default function JourneySection({
  id,
  no,
  title,
  desc,
  cards,
  lang,
  bypass,
}: {
  id: string;
  no: string;
  title: L10;
  desc: L10;
  cards: Card[];
  lang: Lang;
  bypass?: L10[];
}) {
  return (
    <section id={id} className="scroll-mt-3">
      <SectionHead no={no} title={tr(title, lang)} desc={tr(desc, lang)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {cards.map(c => (
          <article
            key={c.id}
            className="bg-white border border-neutral-200 rounded-xl p-3 text-left flex flex-col hover:border-neutral-400 transition-colors"
          >
            <div className="flex items-start gap-1.5">
              <span aria-hidden translate="no" className="notranslate shrink-0 text-[length:calc(15px*var(--pi-scale))] leading-none mt-[1px]">
                {c.icon}
              </span>
              <h3 className="t-card text-black min-w-0 flex-1">{tr(c.title, lang)}</h3>
            </div>

            <div className="mt-1.5">
              <AuthBadge kind={c.badge} lang={lang} />
            </div>

            <p className="t-body text-neutral-600 mt-1.5 flex-1">{tr(c.body, lang)}</p>

            <div className="mt-2 flex items-end justify-between gap-2">
              <span className="t-tag text-gray-400">
                {c.verified ? `✓ ${tr(JLABEL.verified, lang)}` : ''}
              </span>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 t-tag text-[#dc2626] hover:underline"
                >
                  <span translate="no" className="notranslate">{c.urlName ?? tr(JLABEL.openLink, lang)}</span> ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {bypass && <BypassNote lines={bypass} lang={lang} />}
    </section>
  );
}
