'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SectionHead from './SectionHead';
import { BypassNote } from './JourneySection';
import AuthBadge from './AuthBadge';
import { SEC, JLABEL } from '../lib/journey';
import { EXPERIENCE } from '../lib/culture';
import {
  FOOD_AREAS, FOOD_TAGS, DISH, RESTAURANTS, FOOD_LABEL, mapLinks,
  type FoodTag,
} from '../lib/foodmap';
import { tr, type Lang, type L10 } from '../lib/i18n';

const STORE_KEY = 'hangang.foodmap.v1';

type VisitorEntry = {
  id: string;
  area: string;
  name: string;
  where: string;
  menu: string;
  rating: number;
  note: string;
  at: number;
};

function readEntries(): VisitorEntry[] {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is VisitorEntry => {
        if (!e || typeof e !== 'object') return false;
        const o = e as Partial<VisitorEntry>;
        return (
          typeof o.id === 'string' &&
          typeof o.area === 'string' &&
          typeof o.name === 'string' &&
          typeof o.rating === 'number'
        );
      })
      .slice(0, 200);
  } catch {
    return [];
  }
}

function Stars({ value, size = 't-tag' }: { value: number; size?: string }) {
  const filled = Math.max(0, Math.min(5, Math.floor(value)));
  return (
    <span translate="no" className={`notranslate ${size} leading-none tracking-[0.06em]`}>
      <span className="text-[#dc2626]">{'★'.repeat(filled)}</span>
      <span className="text-gray-300">{'★'.repeat(5 - filled)}</span>
    </span>
  );
}

const areaOf = (key: string) => FOOD_AREAS.find(a => a.key === key) ?? FOOD_AREAS[0];

/** 05 순수 관광객 맛집 지도 — No Ads · No Influencer + 관광객 직접 등록 */
export default function FoodMapSection({ lang, bypass }: { lang: Lang; bypass?: L10[] }) {
  const [area, setArea] = useState<string>('ALL');
  const [entries, setEntries] = useState<VisitorEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  const [fName, setFName] = useState('');
  const [fArea, setFArea] = useState(FOOD_AREAS[0].key);
  const [fWhere, setFWhere] = useState('');
  const [fMenu, setFMenu] = useState('');
  const [fRating, setFRating] = useState(5);
  const [fNote, setFNote] = useState('');
  const [hint, setHint] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  // 첫 페인트는 서버 HTML과 같게 두고, 마운트 뒤에 저장값을 읽는다(hydration 불일치 방지)
  useEffect(() => {
    setEntries(readEntries());
    setMounted(true);
  }, []);

  const persist = (next: VisitorEntry[]) => {
    setEntries(next);
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* 저장이 막힌 브라우저 — 화면 상태만 유지 */
    }
  };

  const submit = () => {
    const name = fName.trim();
    const note = fNote.trim();
    if (!name || !note) {
      setHint(tr(FOOD_LABEL.needed, lang));
      return;
    }
    const entry: VisitorEntry = {
      id: `${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 5)}`,
      area: fArea,
      name: name.slice(0, 40),
      where: fWhere.trim().slice(0, 40),
      menu: fMenu.trim().slice(0, 40),
      rating: fRating,
      note: note.slice(0, 100),
      at: Date.now(),
    };
    persist([entry, ...entries]);
    setFName('');
    setFWhere('');
    setFMenu('');
    setFNote('');
    setFRating(5);
    setHint('');
    setSavedMsg(true);
  };

  const remove = (id: string) => persist(entries.filter(e => e.id !== id));

  const visitors = useMemo(
    () => (area === 'ALL' ? entries : entries.filter(e => e.area === area)),
    [entries, area]
  );
  const dishes = useMemo(
    () => (area === 'ALL' ? RESTAURANTS : RESTAURANTS.filter(r => r.area === area)),
    [area]
  );
  const totalCount = dishes.length + visitors.length;

  return (
    <section id="journey-eat" className="scroll-mt-3">
      <SectionHead no="05" title={tr(SEC.food.title, lang)} desc={tr(SEC.food.desc, lang)} />

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span translate="no" className="notranslate t-tag bg-black text-white rounded-md px-2 py-1">
          {tr(FOOD_LABEL.noAds, lang)}
        </span>
        <span className="t-tag text-gray-400">
          {tr(FOOD_LABEL.curation, lang)} · <span translate="no" className="notranslate">{totalCount}</span>{lang === 'KR' ? '' : ' '}{tr(FOOD_LABEL.count, lang)}
        </span>
      </div>

      {/* 지역 필터 */}
      <p className="t-tag uppercase text-gray-400 text-left mb-1">{tr(FOOD_LABEL.sortByArea, lang)}</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setArea('ALL')}
          className={`shrink-0 t-tag rounded-lg px-2.5 py-1.5 transition-colors ${area === 'ALL' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'}`}
        >
          {tr(FOOD_LABEL.all, lang)}
        </button>
        {FOOD_AREAS.map(a => (
          <button
            key={a.key}
            type="button"
            onClick={() => setArea(a.key)}
            className={`shrink-0 t-tag rounded-lg px-2.5 py-1.5 whitespace-nowrap transition-colors ${area === a.key ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'}`}
          >
            {tr(a.label, lang)}
          </button>
        ))}
      </div>

      {/* 맛집 카드 — 관광객 등록이 먼저 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {mounted && visitors.map(v => {
          const links = mapLinks(v.name, v.where || areaOf(v.area).ko);
          return (
            <article key={v.id} className="bg-white border border-[#dc2626]/40 rounded-xl p-3 text-left">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 translate="no" className="notranslate t-card text-black break-words">{v.name}</h3>
                  <p className="t-tag text-gray-400 mt-0.5">
                    {tr(areaOf(v.area).label, lang)}
                    {v.where && <span translate="no" className="notranslate"> · {v.where}</span>}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Stars value={v.rating} />
                  <p translate="no" className="notranslate t-tag text-gray-400 mt-0.5">{v.rating.toFixed(1)}</p>
                </div>
              </div>

              {v.menu && <p translate="no" className="notranslate t-body text-neutral-700 mt-1.5">{v.menu}</p>}
              <p className="t-body text-neutral-600 mt-1">{v.note}</p>

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="t-tag bg-neutral-100 text-neutral-600 rounded-full px-1.5 py-0.5">{tr(FOOD_LABEL.visitor, lang)}</span>
                <div className="flex items-center gap-2">
                  <a href={links.naver} target="_blank" rel="noopener noreferrer" className="t-tag text-[#dc2626] hover:underline">
                    {tr(FOOD_LABEL.mapLink, lang)} ↗
                  </a>
                  <a href={links.google} target="_blank" rel="noopener noreferrer" className="t-tag text-gray-400 hover:underline">
                    Google ↗
                  </a>
                  <button type="button" onClick={() => remove(v.id)} className="t-tag text-gray-400 hover:text-[#dc2626]">
                    {tr(FOOD_LABEL.delete, lang)}
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {dishes.map(r => {
          const links = mapLinks(r.name, r.where);
          return (
            <article key={r.id} className="bg-white border border-neutral-200 rounded-xl p-3 text-left hover:border-neutral-400 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 translate="no" className="notranslate t-card text-black break-words">{r.name}</h3>
                  <p className="t-tag text-gray-400 mt-0.5">
                    {tr(areaOf(r.area).label, lang)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Stars value={r.rating} />
                  <p translate="no" className="notranslate t-tag text-gray-400 mt-0.5">{r.rating.toFixed(1)}</p>
                </div>
              </div>

              <p className="t-body text-neutral-700 mt-1.5">
                {tr(DISH[r.dish], lang)}
                <span translate="no" className="notranslate t-tag text-gray-400 ml-1.5">
                  {r.price.replace(/~/g, '–')}{lang === 'KR' ? '원' : ' KRW'}
                  {r.per === 'person' ? ` ${tr(FOOD_LABEL.perPerson, lang)}` : r.per === 'two' ? ` ${tr(FOOD_LABEL.perTwo, lang)}` : ''}
                </span>
              </p>

              <div className="flex flex-wrap gap-1 mt-1.5">
                {r.tags.map(t => (
                  <span key={t} className="t-tag bg-neutral-100 text-neutral-600 rounded-full px-1.5 py-0.5">
                    {tr(FOOD_TAGS[t as FoodTag], lang)}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <a href={links.naver} target="_blank" rel="noopener noreferrer" className="t-tag text-[#dc2626] hover:underline">
                  {tr(FOOD_LABEL.mapLink, lang)} ↗
                </a>
                <a href={links.google} target="_blank" rel="noopener noreferrer" className="t-tag text-gray-400 hover:underline">
                  Google ↗
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {mounted && totalCount === 0 && (
        <p className="t-body text-gray-400 mt-2 text-left">{tr(FOOD_LABEL.empty, lang)}</p>
      )}

      <p className="t-tag text-gray-400 mt-2 text-left">{tr(JLABEL.priceNote, lang)}</p>

      {/* 관광객 직접 등록 폼 */}
      <div className="mt-3 bg-white border border-neutral-200 rounded-2xl p-3 md:p-4 text-left">
        <p className="t-card text-black">{tr(FOOD_LABEL.formTitle, lang)}</p>
        <p className="t-sub text-gray-400 mt-0.5">{tr(FOOD_LABEL.formDesc, lang)}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
          <label className="block">
            <span className="block t-tag uppercase text-gray-400 mb-1">{tr(FOOD_LABEL.name, lang)}</span>
            <input
              value={fName}
              onChange={e => { setFName(e.target.value); if (hint) setHint(''); }}
              maxLength={40}
              aria-label={tr(FOOD_LABEL.name, lang)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-2 t-body text-black placeholder-neutral-400 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>
          <label className="block">
            <span className="block t-tag uppercase text-gray-400 mb-1">{tr(FOOD_LABEL.area, lang)}</span>
            <select
              value={fArea}
              onChange={e => setFArea(e.target.value)}
              aria-label={tr(FOOD_LABEL.area, lang)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag text-black outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
            >
              {FOOD_AREAS.map(a => (
                <option key={a.key} value={a.key}>{tr(a.label, lang)}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block t-tag uppercase text-gray-400 mb-1">{tr(FOOD_LABEL.where, lang)}</span>
            <input
              value={fWhere}
              onChange={e => setFWhere(e.target.value)}
              maxLength={40}
              aria-label={tr(FOOD_LABEL.where, lang)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-2 t-body text-black placeholder-neutral-400 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>
          <label className="block">
            <span className="block t-tag uppercase text-gray-400 mb-1">{tr(FOOD_LABEL.menu, lang)}</span>
            <input
              value={fMenu}
              onChange={e => setFMenu(e.target.value)}
              maxLength={40}
              aria-label={tr(FOOD_LABEL.menu, lang)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-2 t-body text-black placeholder-neutral-400 outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>
        </div>

        <div className="mt-2">
          <span className="block t-tag uppercase text-gray-400 mb-1">{tr(FOOD_LABEL.rating, lang)}</span>
          <div className="flex items-center gap-1" role="group" aria-label={tr(FOOD_LABEL.rating, lang)}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                aria-label={`${n} / 5`}
                aria-pressed={fRating === n}
                onClick={() => setFRating(n)}
                className={`w-8 h-8 rounded-lg border t-btn leading-none transition-colors active:scale-95 ${
                  n <= fRating
                    ? 'border-[#E5E7EB] bg-neutral-100 text-[#dc2626]'
                    : 'border-[#E5E7EB] bg-white text-gray-300 hover:text-neutral-500'
                }`}
              >
                ★
              </button>
            ))}
            <span translate="no" className="notranslate t-tag text-gray-400 ml-1">{fRating}/5</span>
          </div>
        </div>

        <div className="mt-2">
          <span className="block t-tag uppercase text-gray-400 mb-1">{tr(FOOD_LABEL.note, lang)}</span>
          <textarea
            value={fNote}
            onChange={e => { setFNote(e.target.value); if (hint) setHint(''); }}
            maxLength={100}
            placeholder={tr(FOOD_LABEL.notePh, lang)}
            aria-label={tr(FOOD_LABEL.note, lang)}
            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg t-body text-black placeholder-neutral-400 outline-none p-2.5 h-16 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
          <p className="t-tag text-gray-400">{tr(FOOD_LABEL.saved, lang)}</p>
          <button
            type="button"
            onClick={submit}
            className="shrink-0 bg-black hover:bg-[#dc2626] text-white t-btn px-4 py-2.5 rounded-lg transition-all active:scale-95"
          >
            {tr(FOOD_LABEL.submit, lang)}
          </button>
        </div>

        {hint && <p className="t-tag text-[#dc2626] mt-1.5">{hint}</p>}
        {savedMsg && !hint && (
          <div className="mt-2 bg-neutral-50 border-l-[3px] border-[#dc2626] rounded-lg px-2.5 py-2">
            <p className="t-tag text-black">{tr(FOOD_LABEL.visitor, lang)} · {tr(FOOD_LABEL.saved, lang)}</p>
          </div>
        )}
      </div>

      {/* 체험·예약 창구 */}
      <p className="t-tag uppercase text-gray-400 text-left mt-3 mb-1">{tr(FOOD_LABEL.experience, lang)}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {EXPERIENCE.map(c => (
          <article key={c.id} className="bg-white border border-neutral-200 rounded-xl p-3 text-left flex flex-col hover:border-neutral-400 transition-colors">
            <div className="flex items-start gap-1.5">
              <span aria-hidden translate="no" className="notranslate shrink-0 text-[length:calc(15px*var(--pi-scale))] leading-none mt-[1px]">
                {c.icon}
              </span>
              <h3 translate="no" className="notranslate t-card text-black min-w-0 flex-1">{tr(c.title, lang)}</h3>
            </div>
            <div className="mt-1.5">
              <AuthBadge kind={c.badge} lang={lang} />
            </div>
            <p className="t-body text-neutral-600 mt-1.5 flex-1">{tr(c.body, lang)}</p>
            {c.url && (
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-2 t-tag text-[#dc2626] hover:underline self-end">
                <span translate="no" className="notranslate">{c.urlName}</span> ↗
              </a>
            )}
          </article>
        ))}
      </div>

      {bypass && <BypassNote lines={bypass} lang={lang} />}
    </section>
  );
}
