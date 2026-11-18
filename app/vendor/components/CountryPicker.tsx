'use client';

import React, { useEffect, useState } from 'react';
import { COUNTRIES, type Country } from '../countries';

/* ------------------------------------------------------------------
 * 검색 가능한 전 세계 국가 선택 패널 — Civil·FactFilter와 같은 규격.
 * 238개국(ISO 3166-1) 전체에서 고르고, 맨 위에서 '글로벌(전체)'로 돌아간다.
 * ------------------------------------------------------------------ */
export default function CountryPicker({
  open,
  title,
  desc,
  searchPlaceholder,
  globalLabel,
  emptyLabel,
  countLabel,
  current,
  onClose,
  onSelect,
}: {
  open: boolean;
  title: string;
  desc: string;
  searchPlaceholder: string;
  globalLabel: string;
  emptyLabel: string;
  countLabel: string;
  current: string;
  onClose: () => void;
  onSelect: (code: string) => void;
}) {
  const [q, setQ] = useState('');
  useEffect(() => { if (open) setQ(''); }, [open]);
  if (!open) return null;

  const raw = q.trim();
  const keyword = raw.toLowerCase();
  const list: Country[] = COUNTRIES.filter(
    c =>
      c.ko.includes(raw) ||
      c.en.toLowerCase().includes(keyword) ||
      c.code.toLowerCase().includes(keyword)
  );

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-3xl md:rounded-2xl border border-neutral-200 flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 pt-3 pb-2 border-b border-neutral-200 text-left">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-black t-card truncate">{title}</h3>
              <p className="text-neutral-500 t-sub mt-0.5">{desc}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="close"
              className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 t-btn hover:bg-neutral-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="mt-2 w-full bg-neutral-50 border border-neutral-300 rounded-lg t-body text-black placeholder-neutral-400 outline-none transition-colors focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 px-3 py-2.5"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <button
            onClick={() => { onSelect('GLOBAL'); onClose(); }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left t-btn mb-1 border ${
              current === 'GLOBAL' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
            }`}
          >
            <span translate="no" className="notranslate text-[length:calc(16px*var(--pi-scale))]">🌍</span>
            <span className="truncate">{globalLabel}</span>
          </button>

          {list.length === 0 && (
            <p className="text-neutral-500 t-sub text-center py-6">{emptyLabel}</p>
          )}

          {list.map(c => (
            <button
              key={c.code}
              onClick={() => { onSelect(c.code); onClose(); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left t-btn mb-1 ${
                current === c.code ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              <span translate="no" className="notranslate text-[length:calc(16px*var(--pi-scale))]">{c.flag}</span>
              <span className="truncate flex-1">{c.ko} · {c.en}</span>
              <span translate="no" className={`notranslate t-tag font-mono ${current === c.code ? 'text-white/60' : 'text-gray-400'}`}>{c.code}</span>
              {current === c.code && <span className="t-body">✓</span>}
            </button>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-neutral-200 text-neutral-500 t-sub text-center">
          {countLabel}
        </div>
      </div>
    </div>
  );
}
