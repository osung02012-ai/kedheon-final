'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PiBadge from '../components/PiBadge';
import { usePi } from '../components/PiProvider';
import PiReadOnlyBanner from '../components/PiReadOnlyBanner';
import PiBookmarkNotice from '../components/PiBookmarkNotice';
import AppDock from '../components/AppDock';
import AppHeader from '../components/AppHeader';
import LangSelect from '../components/LangSelect';
import AccRow, { useAccordion } from './components/Accordion';
import CountryPicker from './components/CountryPicker';
import { LANGS, LANG_TAG, detectLang, tr, ui, type Lang, type L10, type UIKey } from './lib/i18n';
import { COUNTRY_MAP, GLOBAL_COUNTRY, QUICK_CODES, type Country } from './countries';
import { RAILS, SEED_LISTINGS, TAGS, type DealMode, type Listing, type RailKey } from './lib/listings';

/* ------------------------------------------------------------------
 * VENDOR — REAL-ECONOMY EXCHANGE (Kedheon · pivendor.pi)
 *
 *  · 국가를 먼저 '컨택'한다 — Civil·FactFilter와 같이 ISO 3166-1 238개국 중
 *    내 나라를 고르면 그 나라의 인력·당근·B2B 원장으로 들어간다(글로벌 = 전체).
 *  · 3대 레일은 탭, 각 거래는 "제목 · 지역 · 조건 ▾" 1줄 행 — 누른 것만 펼친다.
 *  · 직접 등록 폼은 접힌 아코디언, 등록분은 localStorage에 저장되어 즉시 반영된다.
 * 디자인: BNPi 기준 px 고정 타이포(--pi-scale) · 1px #E5E7EB · 화이트/블랙/레드.
 * ------------------------------------------------------------------ */

const LS = {
  country: 'vendor.country.v1',
  posts: 'vendor.posts.v1',
  reqs: 'vendor.reqs.v1'
};

const fmtPi = (n: number) => (Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2))));

const countryOf = (code: string): Country =>
  code === 'GLOBAL' ? GLOBAL_COUNTRY : COUNTRY_MAP[code] ?? { code, flag: '🏳️', ko: code, en: code };

export default function VendorPage() {
  const { requireAuth, authenticated, setGateLang } = usePi();
  const [lang, setLang] = useState<Lang>('KR');
  const [mounted, setMounted] = useState(false);

  const [country, setCountry] = useState('GLOBAL');
  const [rail, setRail] = useState<RailKey>('WORK');
  const [posts, setPosts] = useState<Listing[]>([]);
  const [reqs, setReqs] = useState<Record<string, boolean>>({});
  const [beom, setBeom] = useState(0);
  const [pickerFor, setPickerFor] = useState<'view' | 'form' | null>(null);

  // ✍️ 직접 등록 폼
  const form = useAccordion();
  const [fRail, setFRail] = useState<RailKey>('WORK');
  const [fCountry, setFCountry] = useState('KR');
  const [fCity, setFCity] = useState('');
  const [fTitle, setFTitle] = useState('');
  const [fPrice, setFPrice] = useState('');
  const [fMode, setFMode] = useState<DealMode>('pi');
  const [fDetail, setFDetail] = useState('');
  const [formMsg, setFormMsg] = useState<'saved' | 'errTitle' | 'errCity' | null>(null);

  const T = (k: UIKey) => ui(k, lang);
  const L = (v: L10 | string) => (typeof v === 'string' ? v : tr(v, lang));
  const countryName = (code: string) => {
    const c = countryOf(code);
    return lang === 'KR' ? c.ko : c.en;
  };

  useEffect(() => {
    setLang(detectLang());
    try {
      const savedCountry = localStorage.getItem(LS.country);
      if (savedCountry && (savedCountry === 'GLOBAL' || COUNTRY_MAP[savedCountry])) setCountry(savedCountry);

      const savedPosts = JSON.parse(localStorage.getItem(LS.posts) || '[]');
      if (Array.isArray(savedPosts)) setPosts(savedPosts.filter((p: Listing) => p && p.id));

      const savedReqs = JSON.parse(localStorage.getItem(LS.reqs) || '[]');
      if (Array.isArray(savedReqs)) {
        setReqs(Object.fromEntries(savedReqs.map((id: string) => [id, true])));
      }
    } catch {
      /* 저장소를 못 읽어도 화면은 그대로 뜬다 */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANG_TAG[lang] || 'en';
  }, [lang]);

  // 실행 권한 안내 패널도 같은 언어로
  useEffect(() => {
    setGateLang(lang);
  }, [lang, setGateLang]);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(LS.country, country); } catch { /* ignore */ }
  }, [country, mounted]);

  const all = useMemo(() => [...posts, ...SEED_LISTINGS], [posts]);
  const rows = useMemo(
    () => all.filter(it => it.rail === rail && (country === 'GLOBAL' || it.country === country)),
    [all, rail, country]
  );
  const counts = useMemo(() => {
    const c: Record<RailKey, number> = { WORK: 0, LOCAL: 0, B2B: 0 };
    all.forEach(it => {
      if (country === 'GLOBAL' || it.country === country) c[it.rail] += 1;
    });
    return c;
  }, [all, country]);

  const priceOf = (it: Listing) => {
    if (it.mode === 'barter') return T('priceBarter');
    if (it.piMin !== undefined && it.piMax !== undefined) return `${fmtPi(it.piMin)}–${fmtPi(it.piMax)} Pi`;
    if (it.pi !== undefined) return `${fmtPi(it.pi)} Pi`;
    return T('priceQuote');
  };

  const pickCountry = (code: string) => {
    setCountry(code);
    if (form.open === 'post') setFCountry(code === 'GLOBAL' ? 'KR' : code);
  };

  const persistPosts = (next: Listing[]) => {
    setPosts(next);
    try { localStorage.setItem(LS.posts, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const openPostForm = () => {
    setFRail(rail);
    setFCountry(country === 'GLOBAL' ? 'KR' : country);
    setFormMsg(null);
    if (form.open !== 'post') form.toggle('post');
  };

  const submitPost = () => {
    if (!requireAuth(T('postToggle'))) return;
    if (!fTitle.trim()) { setFormMsg('errTitle'); return; }
    if (!fCity.trim()) { setFormMsg('errCity'); return; }

    const item: Listing = {
      id: `mine-${Date.now().toString(36)}`,
      rail: fRail,
      country: fCountry,
      city: fCity.trim(),
      tag: fRail === 'WORK' ? 'translate' : fRail === 'LOCAL' ? 'goods' : 'equip',
      title: fTitle.trim(),
      detail: fDetail.trim() || '—',
      mode: fMode,
      pi: fMode === 'pi' && fPrice.trim() !== '' && !Number.isNaN(Number(fPrice)) ? Number(fPrice) : undefined,
      dev: 100,
      posted: 'now',
      mine: true
    };

    persistPosts([item, ...posts]);
    setCountry(fCountry);
    setRail(fRail);
    setFTitle('');
    setFCity('');
    setFPrice('');
    setFDetail('');
    setFormMsg('saved');
    setBeom(v => v + 3);
  };

  const removePost = (id: string) => {
    if (!requireAuth(T('mineDelete'))) return;
    persistPosts(posts.filter(p => p.id !== id));
  };

  const requestDeal = (it: Listing) => {
    if (!requireAuth(T('reqAuth'))) return;
    const next = { ...reqs, [it.id]: true };
    setReqs(next);
    setBeom(v => v + 1);
    try {
      localStorage.setItem(LS.reqs, JSON.stringify(Object.keys(next)));
    } catch { /* ignore */ }
  };

  if (!mounted) return <div className="bg-white min-h-screen" />;

  const view = countryOf(country);
  const railDef = RAILS.find(r => r.key === rail) ?? RAILS[0];

  return (
    <div className={`flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-24 selection:bg-red-50 overflow-x-hidden ${lang === 'KR' ? 'break-keep' : ''}`}>

      {/* ── 상단 네비게이션 (케데헌 규격 · 10개국어) ─────────────── */}
      <AppHeader
        brand={
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg border border-black bg-black flex items-center justify-center shrink-0">
              <span translate="no" className="notranslate text-white t-card">V</span>
            </div>
            <div className="text-left leading-tight font-bold min-w-0">
              <h1 translate="no" className="notranslate t-brand text-black italic uppercase truncate">Vendor</h1>
              <span className="block text-gray-400 t-tag font-mono uppercase whitespace-nowrap">REAL-ECONOMY EXCHANGE</span>
            </div>
          </div>
        }
      >
        <PiBadge en={lang !== 'KR'} />
        <LangSelect
          value={lang}
          onChange={v => setLang(v as Lang)}
          options={LANGS.map(l => ({ value: l.code, label: `${l.flag} ${l.label}` }))}
        />
      </AppHeader>

      <main className="w-full max-w-5xl px-3 py-3">

        <PiReadOnlyBanner className="mb-3" />

        {/* ── 1. 히어로 ─────────────────────────────────────────── */}
        <section className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-[var(--card-shadow)] overflow-hidden px-3 py-2.5 md:px-8 md:py-7">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#dc2626]/5" />

          <div className="relative md:grid md:grid-cols-[1.08fr_0.92fr] md:gap-7 md:items-center">
            {/* 모바일: 상단 중앙 대표이미지 카드(그림 안에 VENDOR 명패 포함) / 데스크톱: 오른쪽 큰 그림 + 캡션.
                히어로가 첫 화면을 덮지 않도록 모바일 카드는 148px 로 묶는다(BNPi·Hangang 기준). */}
            <figure className="relative mx-auto w-full max-w-[148px] sm:max-w-[176px] md:order-2 md:max-w-[340px] md:shrink-0">
              <img
                src="/vendor-hero.png"
                alt={T('imgAlt')}
                width={1024}
                height={1024}
                fetchPriority="high"
                className="w-full aspect-square object-cover rounded-xl border border-[#E5E7EB] shadow-[var(--card-shadow)]"
              />
              <figcaption className="hidden md:block mt-2 text-center t-tag font-mono uppercase text-gray-400">
                {T('imgCaption')}
              </figcaption>
            </figure>

            <div className="min-w-0 text-left mt-2 md:mt-0 md:order-1">
              <div className="flex items-center justify-between gap-2">
                <h2 translate="no" className="notranslate t-hero text-black italic uppercase">Vendor</h2>
                <span translate="no" className="notranslate shrink-0 bg-black text-white rounded-md px-2 py-1 t-tag font-mono">pivendor.pi</span>
              </div>
              <p translate="no" className="notranslate t-tag font-mono uppercase text-[#dc2626] mt-0.5">REAL-ECONOMY EXCHANGE</p>
              <p className="t-card text-black mt-1.5">{T('slogan')}</p>
              <p className="hidden sm:block t-sub text-gray-500 mt-1 max-w-2xl">{T('heroDesc')}</p>
            </div>
          </div>

          {/* 국가 컨택 — 이 나라의 원장으로 들어간다 */}
          <div className="relative mt-2.5 md:mt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="t-tag uppercase text-gray-400">{T('countryLabel')}</p>
              <span className="t-tag text-gray-300 whitespace-nowrap">
                <span className="sm:hidden">{T('countryCountShort')}</span>
                <span className="hidden sm:inline">{T('countryCount')}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPickerFor('view')}
              className="mt-1 w-full flex items-center justify-between gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-left active:scale-[0.99] transition-transform"
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <span translate="no" className="notranslate shrink-0 text-[length:calc(15px*var(--pi-scale))] leading-none">{view.flag}</span>
                <span className="truncate t-card text-black">{countryName(country)}</span>
                <span translate="no" className="notranslate shrink-0 t-tag font-mono text-gray-400">{country === 'GLOBAL' ? 'ALL' : country}</span>
              </span>
              <span className="shrink-0 t-tag text-[#dc2626]">{T('countrySelect')} ▾</span>
            </button>

            {/* 주요국 빠른 선택 — 인도·아프리카·동남아·한국이 앞쪽 */}
            <div className="mt-1 flex gap-1 overflow-x-auto no-scrollbar pb-0.5">
              <button
                type="button"
                translate="no"
                onClick={() => setCountry('GLOBAL')}
                className={`notranslate shrink-0 px-2 py-1 rounded-lg t-tag whitespace-nowrap transition-colors ${country === 'GLOBAL' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'}`}
              >
                🌍 ALL
              </button>
              {QUICK_CODES.map(code => {
                const c = countryOf(code);
                const on = country === code;
                return (
                  <button
                    key={code}
                    type="button"
                    translate="no"
                    onClick={() => setCountry(code)}
                    title={countryName(code)}
                    className={`notranslate shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg t-tag whitespace-nowrap transition-colors ${on ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'}`}
                  >
                    <span aria-hidden>{c.flag}</span>{c.code}
                  </button>
                );
              })}
            </div>

            {/* 통계 */}
            <div className="mt-2 grid grid-cols-4 items-center gap-x-1 border-t border-neutral-200 pt-2 md:mt-5 md:gap-2 md:border-0 md:pt-0 md:max-w-3xl md:mx-auto">
              {[
                { v: '238', label: T('statCountries'), short: T('statCountriesS') },
                { v: T('statFee'), label: T('statFeeLabel'), short: T('statFeeS') },
                { v: '1', label: T('statKyc'), short: T('statKycS') },
                { v: `🐾 ${beom}`, label: T('statBeom'), short: T('statBeomS') }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-0 md:items-start md:bg-white md:border md:border-neutral-200 md:rounded-xl md:px-2 md:py-2">
                  <p translate="no" className="notranslate text-black t-tag font-black md:text-[length:var(--t-stat)] whitespace-nowrap">{s.v}</p>
                  <p className="text-gray-400 t-tag md:mt-0.5 whitespace-nowrap">
                    <span className="md:hidden">{s.short}</span>
                    <span className="hidden md:inline">{s.label}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. 3대 거래 레일 탭 ───────────────────────────────── */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {RAILS.map(r => {
            const on = rail === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => {
                  setRail(r.key);
                  if (form.open === 'post') form.toggle('post');
                }}
                aria-pressed={on}
                className={`flex flex-col items-center gap-0.5 rounded-xl border px-1 py-2 transition-all active:scale-[0.98] ${
                  on ? 'bg-black border-black text-white shadow-sm' : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                <span aria-hidden translate="no" className="notranslate text-[length:calc(15px*var(--pi-scale))] leading-none">{r.icon}</span>
                <span className="t-tag whitespace-nowrap">{T(r.short)}</span>
                <span translate="no" className={`notranslate t-tag font-mono ${on ? 'text-white/50' : 'text-gray-300'}`}>{counts[r.key]}</span>
              </button>
            );
          })}
        </div>

        {/* 선택한 레일 안내 + 1줄 행 힌트 */}
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <p className="t-tag text-gray-500 min-w-0">
            <span className="text-[#dc2626] mr-1" aria-hidden>{railDef.icon}</span>
            {T(railDef.title)} · {T(railDef.desc)}
          </p>
          <p className="hidden sm:block shrink-0 t-tag text-gray-300">{T('listHint')}</p>
        </div>

        {/* ── 3. 1줄 클릭형 거래 목록 ───────────────────────────── */}
        <div className="mt-1.5 space-y-1">
          {rows.length === 0 && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-4 text-center">
              <p translate="no" className="notranslate t-tag text-gray-400">{view.flag} {country === 'GLOBAL' ? 'ALL' : country}</p>
              <p className="t-card text-neutral-800 mt-1">{T('listEmptyTitle')}</p>
              <p className="t-sub text-neutral-500 mt-1">{T('listEmptyBody').replace('{c}', countryName(country))}</p>
              <button
                type="button"
                onClick={openPostForm}
                className="mt-2 bg-black hover:bg-[#dc2626] text-white t-btn px-3 py-2 rounded-lg transition-colors active:scale-95"
              >
                ✍️ {T('postToggle')}
              </button>
            </div>
          )}

          {rows.map(it => {
            const info = countryOf(it.country);
            return (
              <AccRow
                key={it.id}
                id={it.id}
                open={form.open === it.id}
                onToggle={() => form.toggle(it.id)}
                icon={TAGS[it.tag].icon}
                title={L(it.title)}
                region={<><span aria-hidden>{info.flag}</span> {it.city}</>}
                price={priceOf(it)}
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="t-tag bg-neutral-100 text-neutral-600 rounded-full px-1.5 py-0.5">{L(TAGS[it.tag].label)}</span>
                  {it.mine && (
                    <span className="t-tag bg-[#dc2626] text-white rounded-full px-1.5 py-0.5">{T('mineBadge')}</span>
                  )}
                  <span translate="no" className="notranslate t-tag text-gray-300 ml-auto">{it.posted}</span>
                </div>

                <p className="t-body text-neutral-600">{L(it.detail)}</p>

                <div className="space-y-0.5 border-t border-neutral-100 pt-1.5">
                  <p className="t-tag text-neutral-500">✓ {T('kycLine')}</p>
                  {!it.mine && <p className="t-tag text-neutral-500">🐾 {T('devLine').replace('{n}', String(it.dev))}</p>}
                  <p className="t-tag text-neutral-500">{it.escrow ? `🔒 ${T('escrowLine')}` : `· ${T('directLine')}`}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-0.5">
                  {it.mine ? (
                    <button
                      type="button"
                      onClick={() => removePost(it.id)}
                      className="shrink-0 border border-neutral-300 text-neutral-500 hover:text-[#dc2626] hover:border-[#dc2626] t-tag px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      {T('mineDelete')}
                    </button>
                  ) : reqs[it.id] ? (
                    <p className="t-tag text-[#dc2626]">✓ {T('reqDone')}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => requestDeal(it)}
                      className="shrink-0 bg-black hover:bg-[#dc2626] text-white t-btn px-3 py-2 rounded-lg transition-all active:scale-95"
                    >
                      {T('reqBtn')}{!authenticated && ' 🔒'}
                    </button>
                  )}
                </div>
              </AccRow>
            );
          })}
        </div>

        {rows.length > 0 && (
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="t-tag text-gray-400">
              <span translate="no" className="notranslate">{view.flag}</span> {countryName(country)} · {T('listCount').replace('{n}', String(rows.length))}
            </p>
            <p className="hidden sm:block t-tag text-gray-300">{T('listHint')}</p>
          </div>
        )}

        {/* ── 4. ✍️ 거래·일감 직접 올리기 (접힌 아코디언 폼) ─────── */}
        <div className="mt-3">
          <AccRow
            id="post"
            open={form.open === 'post'}
            onToggle={() => {
              setFormMsg(null);
              if (form.open !== 'post') {
                setFRail(rail);
                setFCountry(country === 'GLOBAL' ? 'KR' : country);
              }
              form.toggle('post');
            }}
            icon="✍️"
            title={T('postToggle')}
            accent="red"
          >
            <div className="grid grid-cols-2 gap-1.5">
              <label className="block text-left">
                <span className="block t-tag text-gray-400 mb-0.5">{T('postRail')}</span>
                <select
                  value={fRail}
                  onChange={e => setFRail(e.target.value as RailKey)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
                >
                  {RAILS.map(r => (
                    <option key={r.key} value={r.key}>{r.icon} {T(r.title)}</option>
                  ))}
                </select>
              </label>
              <label className="block text-left">
                <span className="block t-tag text-gray-400 mb-0.5">{T('postMode')}</span>
                <select
                  value={fMode}
                  onChange={e => setFMode(e.target.value as DealMode)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
                >
                  <option value="pi">{T('modePi')}</option>
                  <option value="barter">{T('modeBarter')}</option>
                  <option value="quote">{T('modeQuote')}</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div className="text-left">
                <span className="block t-tag text-gray-400 mb-0.5">{T('postCountry')}</span>
                <button
                  type="button"
                  onClick={() => setPickerFor('form')}
                  className="w-full flex items-center justify-between gap-1 bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black shadow-xs hover:border-black transition-colors"
                >
                  <span className="flex items-center gap-1 min-w-0">
                    <span aria-hidden>{countryOf(fCountry).flag}</span>
                    <span className="truncate">{countryName(fCountry)}</span>
                  </span>
                  <span className="shrink-0 text-gray-400">▾</span>
                </button>
              </div>
              <label className="block text-left">
                <span className="block t-tag text-gray-400 mb-0.5">{T('postCity')}</span>
                <input
                  value={fCity}
                  onChange={e => setFCity(e.target.value)}
                  placeholder={T('postCityPh')}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black placeholder-neutral-400 shadow-xs outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </label>
            </div>

            <input
              value={fTitle}
              onChange={e => setFTitle(e.target.value)}
              placeholder={T('postTitlePh')}
              aria-label={T('postTitle')}
              className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-body text-black placeholder-neutral-400 shadow-xs outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />

            {fMode === 'pi' && (
              <label className="block text-left">
                <span className="block t-tag text-gray-400 mb-0.5">{T('postPrice')}</span>
                <input
                  value={fPrice}
                  onChange={e => setFPrice(e.target.value)}
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  placeholder="0.5 – 50"
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-body text-black placeholder-neutral-400 shadow-xs outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </label>
            )}

            <textarea
              value={fDetail}
              onChange={e => setFDetail(e.target.value)}
              placeholder={T('postDetailPh')}
              aria-label={T('postDetail')}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg t-body text-black placeholder-neutral-400 outline-none transition-colors focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 p-2.5 h-16"
            />

            {formMsg && (
              <p className={`t-tag ${formMsg === 'saved' ? 'text-[#dc2626]' : 'text-[#b91c1c]'}`}>
                {formMsg === 'saved'
                  ? `✓ ${T('postSaved')}`
                  : formMsg === 'errTitle'
                    ? T('postErrTitle')
                    : T('postErrCity')}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
              <p className="t-tag text-gray-400">{T('postNote')}</p>
              <button
                type="button"
                onClick={submitPost}
                className="shrink-0 bg-black hover:bg-[#dc2626] text-white t-btn px-4 py-2.5 rounded-lg transition-all active:scale-95"
              >
                {T('postSubmit')}{!authenticated && ' 🔒'}
              </button>
            </div>
          </AccRow>
        </div>

        {/* ── 5. 안전 거래 3원칙 ────────────────────────────────── */}
        <div className="mt-2">
          <AccRow id="safety" open={form.open === 'safety'} onToggle={() => form.toggle('safety')} icon="🛡️" title={T('safetyToggle')}>
            <ul className="space-y-1">
              {[T('safety1'), T('safety2'), T('safety3')].map((line, i) => (
                <li key={i} className="flex gap-1.5 text-left">
                  <span translate="no" className="notranslate shrink-0 t-tag text-[#dc2626]">{i + 1}</span>
                  <span className="t-body text-gray-600">{line}</span>
                </li>
              ))}
            </ul>
          </AccRow>
        </div>

        {/* Pi Browser 공식 ★ 북마크 안내 */}
        <PiBookmarkNotice lang={lang} />

        <p className="text-center text-gray-300 t-tag mt-6 mb-2">
          <span translate="no" className="notranslate">Vendor</span> · <span translate="no" className="notranslate">vendor.kedheon.com</span> · {T('footerTag')}
        </p>
      </main>

      {/* 국가 선택 패널 — 보기/등록 폼 공용 */}
      <CountryPicker
        open={pickerFor !== null}
        title={T('countryPickTitle')}
        desc={T('countryPickDesc')}
        searchPlaceholder={T('countrySearch')}
        globalLabel={T('countryGlobal')}
        emptyLabel={T('noCountry')}
        countLabel={T('countryCount')}
        current={pickerFor === 'form' ? fCountry : country}
        onClose={() => setPickerFor(null)}
        onSelect={code => {
          if (pickerFor === 'form') setFCountry(code === 'GLOBAL' ? 'KR' : code);
          else pickCountry(code);
        }}
      />

      {/* ── 하단 고정 푸터 (6개 앱) ──────────────────────────── */}
      <AppDock active="VENDOR" soonMessage={T('alertSoon')} />
    </div>
  );
}
