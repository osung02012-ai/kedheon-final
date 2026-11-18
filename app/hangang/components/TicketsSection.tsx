'use client';

import React from 'react';
import SectionHead from './SectionHead';
import AccRow, { Requirement, useAccordion } from './Accordion';
import { BypassNote } from './JourneySection';
import { CHANNELS, BOOK_STEPS, TICKET_NOTES, TICKET_LABEL } from '../lib/culture';
import { SEC, BYPASS, JLABEL } from '../lib/journey';
import { ACL } from '../lib/accordion';
import { tr, type Lang } from '../lib/i18n';

/** 04 콘서트·공연 예매 — 1줄 클릭형: 창구 5곳 · 10단계·규정 · 막히면 이렇게 */
export default function TicketsSection({ lang }: { lang: Lang }) {
  const { open, toggle } = useAccordion();

  return (
    <section id="journey-tickets" className="scroll-mt-3">
      <SectionHead no="04" title={tr(SEC.tickets.title, lang)} desc={tr(SEC.tickets.desc, lang)} />

      <div className="space-y-1">
        {CHANNELS.map(c => (
          <AccRow
            key={c.id}
            id={`ticket-${c.id}`}
            open={open === `ticket-${c.id}`}
            onToggle={() => toggle(`ticket-${c.id}`)}
            icon="🎟️"
            title={c.name}
            titleNoTranslate
            meta={<span translate="no" className="notranslate">{c.langs}</span>}
          >
            <Requirement kind={c.badge} lang={lang} />
            <p className="t-body text-neutral-600">{tr(c.desc, lang)}</p>
            <p className="t-tag text-neutral-500 border-t border-neutral-100 pt-1.5">{tr(c.pay, lang)}</p>
            <div className="flex justify-end">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="t-tag text-[#dc2626] hover:underline break-all"
              >
                {c.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
              </a>
            </div>
          </AccRow>
        ))}

        {/* 예매 10단계 + 예매 전 확인 규정 — 한 버튼 뒤로 접는다 */}
        <AccRow
          id="ticket-rules"
          open={open === 'ticket-rules'}
          onToggle={() => toggle('ticket-rules')}
          icon="📋"
          title={tr(ACL.rulesRow, lang)}
        >
          <p className="t-tag uppercase text-gray-400">{tr(TICKET_LABEL.steps, lang)}</p>
          <ol className="grid grid-cols-1 gap-1">
            {BOOK_STEPS.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-left"
              >
                <span translate="no" className="notranslate shrink-0 t-tag text-[#dc2626]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="t-body text-neutral-700">{tr(s, lang)}</span>
              </li>
            ))}
          </ol>

          <p className="t-tag uppercase text-gray-400 pt-1">{tr(TICKET_LABEL.notes, lang)}</p>
          <div className="space-y-1">
            {TICKET_NOTES.map(c => (
              <div key={c.id} className="bg-white border border-neutral-200 rounded-lg px-2.5 py-2">
                <div className="flex items-start gap-1.5">
                  <span
                    aria-hidden
                    translate="no"
                    className="notranslate shrink-0 text-[length:calc(14px*var(--pi-scale))] leading-none mt-[1px]"
                  >
                    {c.icon}
                  </span>
                  <h3 className="t-card text-black min-w-0 flex-1">{tr(c.title, lang)}</h3>
                </div>
                <div className="mt-1.5">
                  <Requirement kind={c.badge} lang={lang} />
                </div>
                <p className="t-body text-neutral-600 mt-1.5">{tr(c.body, lang)}</p>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block t-tag text-[#dc2626] hover:underline"
                  >
                    <span translate="no" className="notranslate">{c.urlName}</span> ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </AccRow>

        <AccRow
          id="ticket-bypass"
          open={open === 'ticket-bypass'}
          onToggle={() => toggle('ticket-bypass')}
          icon="🧷"
          title={tr(JLABEL.bypassTitle, lang)}
          accent="red"
        >
          <BypassNote lines={[BYPASS[0], BYPASS[4]]} lang={lang} />
          <p className="t-tag text-gray-400">{tr(ACL.bypassHint, lang)}</p>
        </AccRow>
      </div>
    </section>
  );
}
