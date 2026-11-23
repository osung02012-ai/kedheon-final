'use client';

import React, { useState } from 'react';
import PassSheet from './PassSheet';
import { passT, type PassLang } from './pass-i18n';
import { usePass } from './passStore';

/**
 * PassStrip — FactFilter · Hangang 본문 상단의 패스 안내 1줄
 *  (AppDock 7칸은 건드리지 않고, 본문에만 한 줄로 붙인다.)
 *  패스가 없으면 "무엇이 열리는지"만 알리고, 사용 중이면 남은 일수를 보여 준다.
 */

export default function PassStrip({
  app,
  lang,
  className = ''
}: {
  app: 'factfilter' | 'hangang';
  lang: PassLang;
  className?: string;
}) {
  const snap = usePass();
  const [open, setOpen] = useState(false);
  if (snap.phase === 'hidden' || !snap.available) return null;

  const t = (key: Parameters<typeof passT>[1], vars?: Record<string, string | number>) => passT(lang, key, vars);
  const pass = snap.pass;
  const active = Boolean(pass?.active);
  const text = app === 'factfilter' ? t('stripFact') : t('stripHangang');

  return (
    <>
      <div
        className={`flex items-center justify-between gap-2 border border-neutral-200 rounded-xl px-2.5 py-1.5 bg-neutral-50 ${className}`}
      >
        <p className="t-tag text-neutral-600 min-w-0 truncate">
          {active && pass ? (
            <>
              <span translate="no" className="notranslate bg-black text-white rounded px-1.5 py-0.5 mr-1 font-mono">
                {pass.badge}
              </span>
              <span className="text-[#dc2626]">D-{pass.daysLeft}</span>
              <span className="text-neutral-400"> · </span>
            </>
          ) : (
            <span translate="no" className="notranslate text-[#7d4698] mr-1">π</span>
          )}
          {text}
        </p>
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 t-tag text-[#dc2626] hover:text-black transition-colors whitespace-nowrap"
        >
          {t('more')} →
        </button>
      </div>

      <PassSheet open={open} onClose={() => setOpen(false)} lang={lang} app={app} />
    </>
  );
}
