'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePi } from './PiProvider';
import { PASS_TEXT, passT, type PassLang } from './pass-i18n';
import { formatPassDate, PASS_PRODUCT } from '../lib/passPlan';
import { loadPass, refreshCounter, usePass } from './passStore';

/**
 * PassSheet — Kedheon.pi Pass 바텀시트 (3앱 공통)
 *
 *  - 위→아래: 제목 / 범위 / 내 상태 / 배지 / 혜택 3줄 / 가격+창립 잔여 카운터 /
 *    CTA / 각주. PiBadge 패널과 같은 규격(rounded-t-3xl · max-w-md · t-*).
 *  - 카운터는 시트가 열려 있을 때만 20초 간격으로 폴링하고, 탭 복귀 시 1회 갱신한다.
 *  - 결제: POST /api/pass/quote로 서버가 금액을 확정 → usePi().pay(금액, 메모, metadata{product,quoteId})
 *    → 서버 approve/complete가 검증·부여. 완료 후 loadPass로 상태를 다시 읽는다.
 *  - 앱 서버 키가 없으면(paymentsReady=false) 결제 버튼을 열지 않고 그 사실을 그대로 알린다.
 */

export default function PassSheet({
  open,
  onClose,
  lang,
  app,
  showExport = false
}: {
  open: boolean;
  onClose: () => void;
  lang: PassLang;
  app: 'kedheon' | 'factfilter' | 'hangang';
  showExport?: boolean;
}) {
  const snap = usePass();
  const { pay, paying, accessToken, inPiBrowser, openAuthSheet } = usePi();
  const [mounted, setMounted] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = (key: keyof typeof PASS_TEXT, vars?: Record<string, string | number>) => passT(lang, key, vars);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    void loadPass({ force: true });
    void refreshCounter();
    timer.current = setInterval(() => void refreshCounter(), 20_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refreshCounter();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      if (timer.current) clearInterval(timer.current);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const pass = snap.pass;
  const counter = snap.counter;
  const active = Boolean(pass?.active);
  const tier = pass?.tier ?? 'pending';
  const price = pass?.priceNextPi ?? 1;
  const takenPct = counter.limit > 0 ? Math.min(100, Math.round((counter.taken / counter.limit) * 100)) : 0;

  const buy = useCallback(async () => {
    setMsg(null);
    if (!accessToken) {
      openAuthSheet();
      return;
    }
    try {
      const quoteRes = await fetch('/api/pass/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: '{}',
        cache: 'no-store'
      });
      const quote = (await quoteRes.json().catch(() => null)) as
        | { ok?: boolean; quoteId?: string; amountPi?: number; error?: string; paymentsReady?: boolean }
        | null;
      if (!quoteRes.ok || !quote?.ok || !quote.quoteId || typeof quote.amountPi !== 'number') {
        setMsg(quote?.paymentsReady === false ? t('ctaWait') : quote?.error || t('buyFail'));
        return;
      }
      const result = await pay(quote.amountPi, `${PASS_PRODUCT.name}`, {
        product: PASS_PRODUCT.id,
        quoteId: quote.quoteId,
        app
      });
      if (!result.ok) {
        setMsg(result.message || t('buyFail'));
        return;
      }
      await loadPass({ force: true });
      setMsg(t('buyOk'));
    } catch {
      setMsg(t('buyFail'));
    }
  }, [accessToken, app, openAuthSheet, pay, t]);

  const exportCsv = useCallback(async () => {
    if (!accessToken) {
      openAuthSheet();
      return;
    }
    if (!active) {
      setMsg(t('exportDenied'));
      return;
    }
    setExporting(true);
    try {
      const res = await fetch('/api/pass/export', { headers: { Authorization: `Bearer ${accessToken}` }, cache: 'no-store' });
      if (!res.ok) {
        setMsg(t('exportDenied'));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kedheon-pass-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } finally {
      setExporting(false);
    }
  }, [accessToken, active, openAuthSheet, t]);

  if (!mounted || !open) return null;

  const statusLine = pass
    ? active
      ? t('statusActive', { date: formatPassDate(pass.passExpiresAt), d: pass.daysLeft })
      : pass.passExpiresAt
        ? t('statusExpired', { date: formatPassDate(pass.passExpiresAt) })
        : t('statusPending')
    : t('statusNone');

  const sheet = (
    <div
      className="fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl border border-neutral-200 p-4 md:p-5 space-y-3 text-left shadow-2xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-black t-card flex items-center gap-1.5">
              <span translate="no" className="notranslate text-[#7d4698] leading-none">π</span>
              <span translate="no" className="notranslate">{t('title')}</span>
            </h3>
            <p className="text-gray-400 t-tag mt-0.5">{t('subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 t-tag font-black hover:bg-neutral-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 내 상태 */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-1.5">
          <p className="t-body text-black font-bold">{statusLine}</p>
          <div className="flex flex-wrap items-center gap-1">
            {pass?.badge ? (
              <span translate="no" className="notranslate t-tag bg-black text-white rounded px-2 py-0.5 font-mono">
                {pass.badge}
              </span>
            ) : null}
            <span className="t-tag bg-white border border-neutral-200 text-neutral-600 rounded px-2 py-0.5">
              {t('humanVerified')}
            </span>
          </div>
        </div>

        {/* 혜택 3줄 */}
        <ul className="space-y-1">
          {[t('benefitKedheon'), t('benefitFact'), t('benefitHangang')].map((line, i) => (
            <li key={i} className="t-sub text-neutral-600 flex gap-1.5">
              <span className="text-[#dc2626] font-black">·</span>
              <span className="min-w-0">{line}</span>
            </li>
          ))}
        </ul>

        {/* 가격 + 창립 잔여 카운터 */}
        <div className="border border-neutral-200 rounded-xl p-3 space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <p translate="no" className="notranslate t-card text-black">
              {tier === 'genesis' ? t('priceFree') : t('price', { p: price })}
            </p>
            <span className="t-tag text-gray-400">{PASS_PRODUCT.days} days</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full bg-[#DC2626]" style={{ width: `${takenPct}%` }} />
          </div>
          <p className="t-tag text-neutral-500">
            {counter.remaining > 0
              ? t('counter', { r: counter.remaining.toLocaleString(), l: counter.limit.toLocaleString() })
              : t('counterClosed', { e: counter.earlyRemaining.toLocaleString() })}
          </p>
          <div className="space-y-0.5 pt-0.5">
            <p className="t-tag text-neutral-500">{t('tierGenesis')}</p>
            <p className="t-tag text-neutral-500">{t('tierEarly')}</p>
            <p className="t-tag text-neutral-500">{t('tierMember')}</p>
          </div>
        </div>

        {/* CTA */}
        {!accessToken ? (
          <div className="space-y-1.5">
            <p className="t-sub text-neutral-600">{t('loginHint')}</p>
            <button
              onClick={openAuthSheet}
              className="w-full bg-black text-white rounded-lg py-2.5 t-btn font-black hover:bg-[#dc2626] transition-colors active:scale-95"
            >
              {t('ctaStart')}
            </button>
          </div>
        ) : !snap.paymentsReady ? (
          <div className="space-y-1.5">
            <button
              disabled
              className="w-full bg-neutral-100 text-neutral-500 rounded-lg py-2.5 t-btn font-black cursor-not-allowed"
            >
              {t('ctaWait')}
            </button>
            <p className="t-tag text-gray-400 leading-relaxed">{t('notReady')}</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <button
              onClick={buy}
              disabled={paying}
              className={`w-full rounded-lg py-2.5 t-btn font-black transition-colors active:scale-95 ${
                paying ? 'bg-neutral-200 text-neutral-500' : 'bg-[#dc2626] text-white hover:bg-black'
              }`}
            >
              <span translate="no" className="notranslate mr-1">π</span>
              {t('ctaBuy', { p: price })}
            </button>
            {!inPiBrowser && <p className="t-tag text-gray-400">{t('note')}</p>}
          </div>
        )}

        {showExport && (
          <button
            onClick={exportCsv}
            disabled={exporting}
            className="w-full border border-neutral-200 rounded-lg py-2 t-tag text-neutral-600 hover:border-neutral-400 transition-colors disabled:opacity-50"
          >
            ⬇ {t('exportBtn')}
          </button>
        )}

        {msg && <p className="t-tag text-[#dc2626] leading-relaxed">{msg}</p>}

        <p className="t-tag text-gray-400 leading-relaxed border-t border-neutral-100 pt-2">{t('note')}</p>
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}
