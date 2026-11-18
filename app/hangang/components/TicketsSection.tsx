'use client';

import React from 'react';
import SectionHead from './SectionHead';
import AuthBadge from './AuthBadge';
import { BypassNote } from './JourneySection';
import { CHANNELS, BOOK_STEPS, TICKET_NOTES, TICKET_LABEL } from '../lib/culture';
import { SEC, BYPASS } from '../lib/journey';
import { tr, type Lang } from '../lib/i18n';

/** 04 콘서트·공연 예매 — 글로벌 창구 5곳 + 10단계 가이드 + 연령·수령 규정 */
export default function TicketsSection({ lang }: { lang: Lang }) {
  return (
    <section id="journey-tickets" className="scroll-mt-3">
      <SectionHead no="04" title={tr(SEC.tickets.title, lang)} desc={tr(SEC.tickets.desc, lang)} />

      {/* 창구 5곳 */}
      <p className="t-tag uppercase text-gray-400 text-left mb-1">{tr(TICKET_LABEL.windows, lang)}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {CHANNELS.map(c => (
          <article
            key={c.id}
            className="bg-white border border-neutral-200 rounded-xl p-3 text-left flex flex-col hover:border-neutral-400 transition-colors"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 translate="no" className="notranslate t-card text-black min-w-0">{c.name}</h3>
              <p translate="no" className="notranslate t-tag text-gray-400 shrink-0">{c.langs}</p>
            </div>
            <div className="mt-1.5">
              <AuthBadge kind={c.badge} lang={lang} />
            </div>

            <p className="t-body text-neutral-600 mt-1.5">{tr(c.desc, lang)}</p>
            <p className="t-tag text-neutral-500 mt-1.5 border-t border-neutral-100 pt-1.5">{tr(c.pay, lang)}</p>

            <div className="mt-2 text-right">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="t-tag text-[#dc2626] hover:underline break-all"
              >
                {c.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* 예매 10단계 */}
      <p className="t-tag uppercase text-gray-400 text-left mt-3 mb-1">{tr(TICKET_LABEL.steps, lang)}</p>
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {BOOK_STEPS.map((s, i) => (
          <li key={i} className="flex gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 text-left">
            <span translate="no" className="notranslate shrink-0 t-tag text-[#dc2626]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="t-body text-neutral-700">{tr(s, lang)}</span>
          </li>
        ))}
      </ol>

      {/* 예매 전 확인 */}
      <p className="t-tag uppercase text-gray-400 text-left mt-3 mb-1">{tr(TICKET_LABEL.notes, lang)}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {TICKET_NOTES.map(c => (
          <article key={c.id} className="bg-white border border-neutral-200 rounded-xl p-3 text-left">
            <div className="flex items-start gap-1.5">
              <span aria-hidden translate="no" className="notranslate shrink-0 text-[length:calc(15px*var(--pi-scale))] leading-none mt-[1px]">
                {c.icon}
              </span>
              <h3 className="t-card text-black min-w-0 flex-1">{tr(c.title, lang)}</h3>
            </div>
            <div className="mt-1.5">
              <AuthBadge kind={c.badge} lang={lang} />
            </div>
            <p className="t-body text-neutral-600 mt-1.5">{tr(c.body, lang)}</p>
            {c.url && (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block t-tag text-[#dc2626] hover:underline"
              >
                <span translate="no" className="notranslate">{c.urlName}</span> ↗
              </a>
            )}
          </article>
        ))}
      </div>

      <BypassNote lines={[BYPASS[0], BYPASS[4]]} lang={lang} />
    </section>
  );
}
