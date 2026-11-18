'use client';

import React from 'react';
import AccRow, { Requirement, useAccordion } from './Accordion';
import SectionHead from './SectionHead';
import { JLABEL, type Card } from '../lib/journey';
import { ACL } from '../lib/accordion';
import { tr, type Lang, type L10 } from '../lib/i18n';

/** "막히면 이렇게" 1줄 — 안쪽에서만 열리는 우회 안내 */
export function BypassNote({ lines, lang }: { lines: L10[]; lang: Lang }) {
  if (!lines.length) return null;
  return (
    <ul className="space-y-1">
      {lines.map((l, i) => (
        <li key={i} className="flex gap-1.5">
          <span className="shrink-0 t-tag text-[#dc2626]">·</span>
          <span className="t-body text-neutral-600">{tr(l, lang)}</span>
        </li>
      ))}
    </ul>
  );
}

/** 여정 섹션 공통 — 머리글 + 1줄 클릭형 아코디언(제목+▾) + 우회 안내(같은 아코디언) */
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
  const { open, toggle } = useAccordion();

  return (
    <section id={id} className="scroll-mt-3">
      <SectionHead no={no} title={tr(title, lang)} desc={tr(desc, lang)} />

      <div className="space-y-1">
        {cards.map(c => (
          <AccRow
            key={c.id}
            id={c.id}
            open={open === c.id}
            onToggle={() => toggle(c.id)}
            icon={c.icon}
            title={tr(c.title, lang)}
          >
            <Requirement kind={c.badge} lang={lang} />
            <p className="t-body text-neutral-600">{tr(c.body, lang)}</p>
            {(c.url || c.verified) && (
              <div className="flex items-end justify-between gap-2 pt-0.5">
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
                    <span translate="no" className="notranslate">
                      {c.urlName ?? tr(JLABEL.openLink, lang)}
                    </span>{' '}
                    ↗
                  </a>
                )}
              </div>
            )}
          </AccRow>
        ))}

        {bypass && bypass.length > 0 && (
          <AccRow
            id={`${id}-bypass`}
            open={open === `${id}-bypass`}
            onToggle={() => toggle(`${id}-bypass`)}
            icon="🧷"
            title={tr(JLABEL.bypassTitle, lang)}
            accent="red"
          >
            <BypassNote lines={bypass} lang={lang} />
            <p className="t-tag text-gray-400">{tr(ACL.bypassHint, lang)}</p>
          </AccRow>
        )}
      </div>
    </section>
  );
}
