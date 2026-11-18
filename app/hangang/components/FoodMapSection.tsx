'use client';

import React, { useEffect, useMemo, useState } from 'react';
import SectionHead from './SectionHead';
import AccRow, { Requirement, useAccordion } from './Accordion';
import { BypassNote } from './JourneySection';
import { SEC, JLABEL } from '../lib/journey';
import { ACL } from '../lib/accordion';
import { EXPERIENCE } from '../lib/culture';
import {
  FOOD_AREAS, FOOD_TAGS, DISH, RESTAURANTS, FOOD_LABEL, mapLinks,
  type FoodTag,
} from '../lib/foodmap';
import { tr, type Lang, type L10 } from '../lib/i18n';

const STORE_KEY = 'hangang.foodmap.v1';
/** 처음 화면에 보이는 가게 행 수 — 나머지는 '전체 보기' 뒤로 접는다 */
const COLLAPSED_ROWS = 5;

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

/** 05 순수 관광객 맛집 지도 — 1줄 행(가게명 · 지역 · ★) 클릭 시 메뉴·지도가 열린다 */
export default function FoodMapSection({ lang, bypass }: { lang: Lang; bypass?: L10[] }) {
  const [area, setArea] = useState<string>('ALL');
  const [entries, setEntries] = useState<VisitorEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { open, toggle } = useAccordion();

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

  // 1줄 행 목록 — 지역 전체에서도 5줄만 먼저 보이고 나머지는 '전체 보기'로 펼친다
  const rows: { key: string; kind: 'v' | 'd'; v?: VisitorEntry; d?: (typeof RESTAURANTS)[number] }[] = [
    ...(mounted ? visitors.map(v => ({ key: `v-${v.id}`, kind: 'v' as const, v })) : []),
    ...dishes.map(d => ({ key: `d-${d.id}`, kind: 'd' as const, d })),
  ];
  const limited = area === 'ALL' && !showAll;
  const shown = limited ? rows.slice(0, COLLAPSED_ROWS) : rows;
  const hidden = rows.length - shown.length;

  const pickArea = (key: string) => {
    setArea(key);
    setShowAll(false);
  };

  return (
    <section id="journey-eat" className="scroll-mt-3">
      <SectionHead no="05" title={tr(SEC.food.title, lang)} desc={tr(SEC.food.desc, lang)} />

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span translate="no" className="notranslate t-tag bg-black text-white rounded-md px-2 py-1">
          {tr(FOOD_LABEL.noAds, lang)}
        </span>
        <span className="t-tag text-gray-400">
          {tr(FOOD_LABEL.curation, lang)} · <span translate="no" className="notranslate">{totalCount}</span>
          {lang === 'KR' ? '' : ' '}
          {tr(FOOD_LABEL.count, lang)}
        </span>
      </div>

      {/* 지역 필터 */}
      <p className="t-tag uppercase text-gray-400 text-left mb-1">{tr(FOOD_LABEL.sortByArea, lang)}</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => pickArea('ALL')}
          className={`shrink-0 t-tag rounded-lg px-2.5 py-1.5 transition-colors ${area === 'ALL' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'}`}
        >
          {tr(FOOD_LABEL.all, lang)}
        </button>
        {FOOD_AREAS.map(a => (
          <button
            key={a.key}
            type="button"
            onClick={() => pickArea(a.key)}
            className={`shrink-0 t-tag rounded-lg px-2.5 py-1.5 whitespace-nowrap transition-colors ${area === a.key ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'}`}
          >
            {tr(a.label, lang)}
          </button>
        ))}
      </div>

      {/* 가게 1줄 행 — 누른 행만 메뉴·태그·지도 링크가 열린다 */}
      <div className="space-y-1 mt-2">
        {shown.map(row => {
          if (row.kind === 'v' && row.v) {
            const v = row.v;
            const rowId = `food-${row.key}`;
            const links = mapLinks(v.name, v.where || areaOf(v.area).ko);
            return (
              <AccRow
                key={row.key}
                id={rowId}
                open={open === rowId}
                onToggle={() => toggle(rowId)}
                icon="🙋"
                title={v.name}
                titleNoTranslate
                meta={
                  <>
                    {tr(areaOf(v.area).label, lang)} · <span className="text-[#dc2626]">★</span>{' '}
                    <span translate="no" className="notranslate">{v.rating.toFixed(1)}</span>
                  </>
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="t-tag bg-neutral-100 text-neutral-600 rounded-full px-1.5 py-0.5">
                    {tr(FOOD_LABEL.visitor, lang)}
                  </span>
                  <Stars value={v.rating} />
                </div>
                {v.menu && (
                  <p translate="no" className="notranslate t-body text-neutral-700">{v.menu}</p>
                )}
                <p className="t-body text-neutral-600">{v.note}</p>
                <div className="flex items-center justify-end gap-2 pt-0.5">
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
              </AccRow>
            );
          }

          const r = row.d!;
          const rowId = `food-${row.key}`;
          const links = mapLinks(r.name, r.where);
          return (
            <AccRow
              key={row.key}
              id={rowId}
              open={open === rowId}
              onToggle={() => toggle(rowId)}
              title={r.name}
              titleNoTranslate
              meta={
                <>
                  {tr(areaOf(r.area).label, lang)} · <span className="text-[#dc2626]">★</span>{' '}
                  <span translate="no" className="notranslate">{r.rating.toFixed(1)}</span>
                </>
              }
            >
              <div className="flex items-center justify-between gap-2">
                <p className="t-body text-neutral-700 min-w-0">
                  {tr(DISH[r.dish], lang)}
                  <span translate="no" className="notranslate t-tag text-gray-400 ml-1.5">
                    {r.price.replace(/~/g, '–')}
                    {lang === 'KR' ? '원' : ' KRW'}
                    {r.per === 'person' ? ` ${tr(FOOD_LABEL.perPerson, lang)}` : r.per === 'two' ? ` ${tr(FOOD_LABEL.perTwo, lang)}` : ''}
                  </span>
                </p>
                <Stars value={r.rating} />
              </div>

              <div className="flex flex-wrap gap-1">
                {r.tags.map(t => (
                  <span key={t} className="t-tag bg-neutral-100 text-neutral-600 rounded-full px-1.5 py-0.5">
                    {tr(FOOD_TAGS[t as FoodTag], lang)}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-0.5">
                <a href={links.naver} target="_blank" rel="noopener noreferrer" className="t-tag text-[#dc2626] hover:underline">
                  {tr(FOOD_LABEL.mapLink, lang)} ↗
                </a>
                <a href={links.google} target="_blank" rel="noopener noreferrer" className="t-tag text-gray-400 hover:underline">
                  Google ↗
                </a>
              </div>
            </AccRow>
          );
        })}
      </div>

      {/* 전체 보기 / 접기 */}
      {(hidden > 0 || (area === 'ALL' && showAll && rows.length > COLLAPSED_ROWS)) && (
        <button
          type="button"
          onClick={() => setShowAll(v => !v)}
          className="w-full mt-1.5 bg-white border border-neutral-300 rounded-xl t-tag text-neutral-600 py-2.5 hover:border-neutral-500 hover:text-black transition-colors active:scale-[0.99]"
        >
          {showAll ? (
            <>▲ {tr(ACL.showLess, lang)}</>
          ) : (
            <>
              ▼ {tr(ACL.showAll, lang)} {hidden}
              {lang === 'KR' ? '' : ' '}
              {tr(FOOD_LABEL.count, lang)}
            </>
          )}
        </button>
      )}

      {mounted && totalCount === 0 && (
        <p className="t-body text-gray-400 mt-2 text-left">{tr(FOOD_LABEL.empty, lang)}</p>
      )}

      <p className="t-tag text-gray-400 mt-2 text-left">{tr(JLABEL.priceNote, lang)}</p>

      {/* 관광객 직접 등록 폼 — 기본 접힘 */}
      <div className="mt-2">
        <AccRow
          id="food-form"
          open={open === 'food-form'}
          onToggle={() => toggle('food-form')}
          icon="✍️"
          title={tr(FOOD_LABEL.formTitle, lang)}
        >
          <p className="t-sub text-gray-400">{tr(FOOD_LABEL.formDesc, lang)}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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

          <div>
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

          <div>
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="t-tag text-gray-400">{tr(FOOD_LABEL.saved, lang)}</p>
            <button
              type="button"
              onClick={submit}
              className="shrink-0 bg-black hover:bg-[#dc2626] text-white t-btn px-4 py-2.5 rounded-lg transition-all active:scale-95"
            >
              {tr(FOOD_LABEL.submit, lang)}
            </button>
          </div>

          {hint && <p className="t-tag text-[#dc2626]">{hint}</p>}
          {savedMsg && !hint && (
            <div className="bg-neutral-50 border-l-[3px] border-[#dc2626] rounded-lg px-2.5 py-2">
              <p className="t-tag text-black">{tr(FOOD_LABEL.visitor, lang)} · {tr(FOOD_LABEL.saved, lang)}</p>
            </div>
          )}
        </AccRow>
      </div>

      {/* 체험·예약 창구 — 1줄 행 */}
      <p className="t-tag uppercase text-gray-400 text-left mt-3 mb-1">{tr(FOOD_LABEL.experience, lang)}</p>
      <div className="space-y-1">
        {EXPERIENCE.map(c => {
          const rowId = `exp-${c.id}`;
          return (
            <AccRow
              key={c.id}
              id={rowId}
              open={open === rowId}
              onToggle={() => toggle(rowId)}
              icon={c.icon}
              title={tr(c.title, lang)}
              titleNoTranslate
            >
              <Requirement kind={c.badge} lang={lang} />
              <p className="t-body text-neutral-600">{tr(c.body, lang)}</p>
              {c.url && (
                <div className="flex justify-end">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="t-tag text-[#dc2626] hover:underline">
                    <span translate="no" className="notranslate">{c.urlName}</span> ↗
                  </a>
                </div>
              )}
            </AccRow>
          );
        })}

        {bypass && bypass.length > 0 && (
          <AccRow
            id="food-bypass"
            open={open === 'food-bypass'}
            onToggle={() => toggle('food-bypass')}
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
