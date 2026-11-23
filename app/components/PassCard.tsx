'use client';

import React, { useEffect, useState } from 'react';
import PassSheet from './PassSheet';
import { passT, type PassLang } from './pass-i18n';
import { formatPassDate, PASS_PRICE_PI } from '../lib/passPlan';
import { getPassSnapshot, loadPass, usePass } from './passStore';
import { usePi } from './PiProvider';

/**
 * PassCard — Kedheon PIONEER 탭 '보유 자산' 카드 바로 아래의 통합 패스 카드
 *
 *  - 만료일·D-day·배지·3앱 사용 현황을 한 카드에 모으고, 갱신은 시트에서 한다.
 *  - 패스가 없거나 서버가 꺼 놓았으면 아무것도 그리지 않는다(기존 화면 그대로).
 */

const APPS: Array<{ key: 'kedheon' | 'factfilter' | 'hangang'; label: string }> = [
  { key: 'kedheon', label: 'Kedheon' },
  { key: 'factfilter', label: 'FactFilter' },
  { key: 'hangang', label: 'Hangang' }
];

export default function PassCard({ lang }: { lang: PassLang }) {
  const { accessToken } = usePi();
  const snap = usePass();
  const [open, setOpen] = useState(false);
  const t = (key: Parameters<typeof passT>[1], vars?: Record<string, string | number>) => passT(lang, key, vars);

  useEffect(() => {
    if (!accessToken) return;
    if (getPassSnapshot().phase === 'idle') void loadPass();
  }, [accessToken]);

  if (snap.phase === 'hidden' || !snap.available || !snap.pass) return null;

  const pass = snap.pass;
  const active = pass.active;
  const price = pass.tier === 'genesis' ? PASS_PRICE_PI.genesis : pass.priceNextPi;

  return (
    <>
      <div className="w-full bg-white p-3.5 md:p-5 rounded-2xl border border-[#E5E7EB] shadow-[var(--card-shadow)] text-left">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span translate="no" className="notranslate text-[#7d4698] t-card leading-none">π</span>
            <span translate="no" className="notranslate t-card text-black truncate">Kedheon.pi Pass</span>
            <span
              translate="no"
              className={`notranslate t-tag rounded px-1.5 py-0.5 font-mono whitespace-nowrap ${
                active ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {pass.badge || '—'}
            </span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 t-tag bg-neutral-100 text-neutral-800 rounded-lg px-2 py-1 hover:bg-neutral-200 transition-colors"
          >
            {active ? t('ctaBuy', { p: price }) : t('badgeStart')} →
          </button>
        </div>

        <p className="t-body text-black mt-1.5">
          {active
            ? t('statusActive', { date: formatPassDate(pass.passExpiresAt), d: pass.daysLeft })
            : pass.passExpiresAt
              ? t('statusExpired', { date: formatPassDate(pass.passExpiresAt) })
              : t('loginHint')}
        </p>

        <div className="flex flex-wrap items-center gap-1 mt-2">
          {APPS.map(a => (
            <span
              key={a.key}
              translate="no"
              className={`notranslate t-tag rounded-full px-2 py-0.5 border ${
                active ? 'border-[#dc2626] text-[#dc2626]' : 'border-neutral-200 text-gray-400'
              }`}
            >
              {a.label} {active ? '✓' : '·'}
            </span>
          ))}
          <span className="t-tag text-gray-400 ml-0.5">{t('humanVerified')}</span>
        </div>

        <p translate="no" className="notranslate t-tag text-gray-400 mt-2">×1.5 BEOM · KYC</p>
      </div>

      <PassSheet open={open} onClose={() => setOpen(false)} lang={lang} app="kedheon" showExport />
    </>
  );
}
