'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PiBadge from '../components/PiBadge';
import { usePi } from '../components/PiProvider';
import PiReadOnlyBanner from '../components/PiReadOnlyBanner';
import AppDock from '../components/AppDock';
import AppHeader from '../components/AppHeader';
import LangSelect from '../components/LangSelect';
import AccRow, { useAccordion } from './components/Accordion';
import CountryPicker from './components/CountryPicker';
import { LANGS, LANG_TAG, detectLang, tr, ui, type Lang, type L10, type UIKey } from './lib/i18n';
import { COUNTRY_MAP, GLOBAL_COUNTRY, QUICK_CODES, type Country } from './countries';
import {
  BUMP_LIMIT,
  DEAL_MODES,
  HANDOFFS,
  RAILS,
  RAIL_SIDES,
  SEED_LISTINGS,
  STATUS_LABEL,
  TAGS,
  TIER_BADGE,
  ageLabel,
  type DealMode,
  type Handoff,
  type Listing,
  type ListingStatus,
  type RailKey,
  type SideKey,
  type TagKey,
  type Tier
} from './lib/listings';

/* ------------------------------------------------------------------
 * VENDOR — REAL-ECONOMY EXCHANGE (Kedheon · pivendor.pi) · 0단계
 *
 *  0단계의 목표는 "목업 → 골격"이다. 상대(서버)는 아직 없지만, 다음 단계에서
 *  데이터를 그대로 옮길 수 있게 상태·문구·구조를 먼저 확정한다.
 *
 *  · 상시 요소는 3개뿐이다 — ① 생활권 한 줄(+반경 4단계) ② 레일 서브칩 한 줄
 *    ③ 🔎 조건·정렬 한 줄. 나머지 정보는 전부 '누른 것만' 펼치는 1줄 아코디언 안쪽에 둔다.
 *  · 거래는 상태를 가진다: 모집중 → 예약중 → 완료. 이행(만남/택배/컨테이너/원격)과
 *    정산(Pi 즉시/30·70 분할)은 다른 축이다.
 *  · 보관형 에스크로는 아직 작동하지 않는다 → '준비 중'으로만 표기하고 "보호"라고 쓰지 않는다.
 *  · 신뢰는 측정값만 적는다. 지어낸 완료율(dev)과 누르면 오르던 🐾는 삭제했고,
 *    시드는 '예시' 배지 + 발자국 0으로 정직하게 표시한다.
 * 디자인: BNPi 기준 px 고정 타이포(--pi-scale) · 1px #E5E7EB · 화이트/블랙/레드.
 * ------------------------------------------------------------------ */

const LS = {
  country: 'vendor.country.v2',
  posts: 'vendor.posts.v2',
  offers: 'vendor.offers.v2',
  saved: 'vendor.saved.v2',
  area: 'vendor.area.v2'
};

type Radius = 'hood' | 'city' | 'country' | 'global';
type SortKey = 'new' | 'near' | 'cheap' | 'trust';
type Area = { country: string; city: string; district: string; radius: Radius };
type Offer = { id: string; amount?: number; at: string };

const RADII: { key: Radius; label: UIKey }[] = [
  { key: 'hood', label: 'radiusHood' },
  { key: 'city', label: 'radiusCity' },
  { key: 'country', label: 'radiusCountry' },
  { key: 'global', label: 'radiusGlobal' }
];

const SORTS: { key: SortKey; label: UIKey }[] = [
  { key: 'new', label: 'sortNew' },
  { key: 'near', label: 'sortNear' },
  { key: 'cheap', label: 'sortCheap' },
  { key: 'trust', label: 'sortTrust' }
];

const DEFAULT_AREA: Area = { country: 'KR', city: '', district: '', radius: 'global' };

const fmtPi = (n: number) => (Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2))));
const norm = (s?: string) => (s || '').trim().toLowerCase();

const countryOf = (code: string): Country =>
  code === 'GLOBAL' ? GLOBAL_COUNTRY : COUNTRY_MAP[code] ?? { code, flag: '🏳️', ko: code, en: code };

/** 상태 칩 — 글자를 함께 쓴다(색만으로 뜻을 전하지 않는다). */
function StatusChip({ status, label }: { status: ListingStatus; label: string }) {
  const cls =
    status === 'reserved'
      ? 'bg-black text-white border-black'
      : status === 'done'
        ? 'bg-white text-neutral-500 border-neutral-300'
        : 'bg-white text-[#dc2626] border-[#dc2626]';
  return <span className={`shrink-0 t-tag border rounded-full px-1.5 py-0.5 whitespace-nowrap ${cls}`}>{label}</span>;
}

/** 모집 → 예약 → 완료 3단계. 지금 어디인지 점과 글자로 보여 준다. */
function StepBar({ step, labels }: { step: number; labels: [string, string, string] }) {
  return (
    <div className="flex items-center gap-1 pt-0.5">
      {labels.map((label, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={`h-px flex-1 ${i <= step ? 'bg-black' : 'bg-neutral-200'}`} />}
          <span className={`t-tag whitespace-nowrap ${i <= step ? 'text-black font-bold' : 'text-gray-300'}`}>
            <span aria-hidden>{i <= step ? '●' : '○'}</span> {label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function VendorPage() {
  const { requireAuth, authenticated, setGateLang } = usePi();
  const [lang, setLang] = useState<Lang>('KR');
  const [mounted, setMounted] = useState(false);

  const [country, setCountry] = useState('GLOBAL');
  const [rail, setRail] = useState<RailKey>('WORK');
  const [side, setSide] = useState<SideKey | null>(null);
  const [area, setArea] = useState<Area>(DEFAULT_AREA);

  const [posts, setPosts] = useState<Listing[]>([]);
  const [offers, setOffers] = useState<Record<string, Offer>>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [offerId, setOfferId] = useState<string | null>(null);
  const [offerAmt, setOfferAmt] = useState('');

  const [pickerFor, setPickerFor] = useState<'view' | 'form' | 'area' | null>(null);
  const [areaOpen, setAreaOpen] = useState(false);

  /* 🔎 조건 · 정렬 */
  const [fTag, setFTag] = useState<TagKey | null>(null);
  const [fMin, setFMin] = useState('');
  const [fMax, setFMax] = useState('');
  const [qHandoff, setQHandoff] = useState<Handoff | null>(null);
  const [qTier, setQTier] = useState<Tier | null>(null);
  const [fReserved, setFReserved] = useState(false);
  const [sort, setSort] = useState<SortKey>('new');

  const row = useAccordion();
  const form = useAccordion();

  /* ✍️ 등록 폼 */
  const [fRail, setFRail] = useState<RailKey>('WORK');
  const [fSide, setFSide] = useState<SideKey>('gig');
  const [fCountry, setFCountry] = useState('KR');
  const [fCity, setFCity] = useState('');
  const [fPlace, setFPlace] = useState('');
  const [fTagSel, setFTagSel] = useState<TagKey>('translate');
  const [fTitle, setFTitle] = useState('');
  const [fPrice, setFPrice] = useState('');
  const [fMode, setFMode] = useState<DealMode>('pi');
  const [fHandoff, setFHandoff] = useState<Handoff>('meet');
  const [fTerms, setFTerms] = useState('');
  const [fDetail, setFDetail] = useState('');
  const [fTier, setFTier] = useState<Tier>(0);
  const [formMsg, setFormMsg] = useState<'saved' | 'errTitle' | 'errCity' | 'errTerms' | null>(null);

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

      const savedArea = JSON.parse(localStorage.getItem(LS.area) || 'null');
      if (savedArea && typeof savedArea === 'object') {
        setArea({
          country: typeof savedArea.country === 'string' ? savedArea.country : DEFAULT_AREA.country,
          city: typeof savedArea.city === 'string' ? savedArea.city : '',
          district: typeof savedArea.district === 'string' ? savedArea.district : '',
          radius: ['hood', 'city', 'country', 'global'].includes(savedArea.radius) ? savedArea.radius : 'global'
        });
      }

      const savedPosts = JSON.parse(localStorage.getItem(LS.posts) || '[]');
      if (Array.isArray(savedPosts)) setPosts(savedPosts.filter((p: Listing) => p && p.id));

      const savedOffers = JSON.parse(localStorage.getItem(LS.offers) || '{}');
      if (savedOffers && typeof savedOffers === 'object' && !Array.isArray(savedOffers)) setOffers(savedOffers);

      const savedIds = JSON.parse(localStorage.getItem(LS.saved) || '[]');
      if (Array.isArray(savedIds)) setSaved(savedIds.filter((id: unknown) => typeof id === 'string'));
    } catch {
      /* 저장소를 못 읽어도 화면은 그대로 뜬다 */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANG_TAG[lang] || 'en';
  }, [lang]);

  useEffect(() => {
    setGateLang(lang);
  }, [lang, setGateLang]);

  useEffect(() => { if (mounted) { try { localStorage.setItem(LS.country, country); } catch { /* ignore */ } } }, [country, mounted]);
  useEffect(() => { if (mounted) { try { localStorage.setItem(LS.area, JSON.stringify(area)); } catch { /* ignore */ } } }, [area, mounted]);
  useEffect(() => { if (mounted) { try { localStorage.setItem(LS.saved, JSON.stringify(saved)); } catch { /* ignore */ } } }, [saved, mounted]);

  const persistPosts = (next: Listing[]) => {
    setPosts(next);
    try { localStorage.setItem(LS.posts, JSON.stringify(next)); } catch { /* ignore */ }
  };
  const persistOffers = (next: Record<string, Offer>) => {
    setOffers(next);
    try { localStorage.setItem(LS.offers, JSON.stringify(next)); } catch { /* ignore */ }
  };

  /* ── 원장 계산 ─────────────────────────────────────────────── */

  const all = useMemo(() => [...posts, ...SEED_LISTINGS], [posts]);

  /** 발자국 = 정산까지 끝난 거래. 내 글을 '완료'로 바꾼 것만으로는 늘지 않는다(상대 확인이 필요). */
  const footprints = useMemo(() => posts.reduce((n, p) => n + (p.dealsDone || 0), 0), [posts]);

  const myPosts = posts.length;
  const myReserved = posts.filter(p => p.status === 'reserved').length;
  const myDone = posts.filter(p => p.status === 'done').length;

  const sidesForRail = RAIL_SIDES[rail];
  const activeSide: SideKey = side && sidesForRail.some(s => s.key === side) ? side : sidesForRail[0].key;

  const inRail = useMemo(
    () => all.filter(it => it.rail === rail && (country === 'GLOBAL' || it.country === country || it.handoff === 'remote')),
    [all, rail, country]
  );

  const sideCounts = useMemo(() => {
    const c: Record<string, number> = {};
    sidesForRail.forEach(s => { c[s.key] = 0; });
    inRail.forEach(it => { if (c[it.side] !== undefined) c[it.side] += 1; });
    return c;
  }, [inRail, sidesForRail]);

  /** 생활권 반경 — 원격(remote)은 지역이 없으므로 항상 보인다. 다른 나라 원장을 볼 때는 적용하지 않는다. */
  const matchesArea = (it: Listing) => {
    if (area.radius === 'global' || !area.city) return true;
    if (!(country === 'GLOBAL' || country === area.country)) return true;
    if (it.handoff === 'remote') return true;
    if (it.country !== area.country) return false;
    if (area.radius === 'country') return true;
    if (norm(it.city) !== norm(area.city)) return false;
    if (area.radius === 'city') return true;
    return !area.district || norm(it.place) === norm(area.district);
  };

  const priceOf = (it: Listing): number | undefined => it.pi ?? it.piMin;

  const rows = useMemo(() => {
    let out = inRail.filter(it => it.side === activeSide && matchesArea(it));

    if (fTag) out = out.filter(it => it.tag === fTag);
    if (qHandoff) out = out.filter(it => it.handoff === qHandoff);
    if (qTier !== null) out = out.filter(it => it.tier === qTier);
    if (!fReserved) out = out.filter(it => it.status !== 'reserved');
    out = out.filter(it => it.status !== 'done');

    const min = fMin.trim() === '' ? null : Number(fMin);
    const max = fMax.trim() === '' ? null : Number(fMax);
    if (min !== null && Number.isFinite(min)) out = out.filter(it => (priceOf(it) ?? Number.POSITIVE_INFINITY) >= min);
    if (max !== null && Number.isFinite(max)) out = out.filter(it => (priceOf(it) ?? 0) <= max);

    const near = (it: Listing) => (area.city && norm(it.city) === norm(area.city) ? 0 : 1);
    out = [...out].sort((a, b) => {
      if (sort === 'near') {
        const d = near(a) - near(b);
        if (d !== 0) return d;
      }
      if (sort === 'cheap') {
        const d = (priceOf(a) ?? Number.POSITIVE_INFINITY) - (priceOf(b) ?? Number.POSITIVE_INFINITY);
        if (d !== 0) return d;
      }
      if (sort === 'trust') {
        const d = b.dealsDone - a.dealsDone || b.reviews - a.reviews;
        if (d !== 0) return d;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inRail, activeSide, area, country, fTag, qHandoff, qTier, fReserved, fMin, fMax, sort]);

  const filterOn = fTag !== null || qHandoff !== null || qTier !== null || fMin.trim() !== '' || fMax.trim() !== '' || fReserved;

  /* ── 표시 도우미 ───────────────────────────────────────────── */

  const priceLabel = (it: Listing) => {
    if (it.mode === 'free') return T('sideFree');
    if (it.mode === 'barter') return T('priceBarter');
    if (it.mode === 'offer') return T('modeOffer');
    if (it.piMin !== undefined && it.piMax !== undefined) return `${fmtPi(it.piMin)}–${fmtPi(it.piMax)} Pi`;
    if (it.pi !== undefined) return `${fmtPi(it.pi)} Pi`;
    return T('priceQuote');
  };

  const settleLabel = (it: Listing) => {
    if (it.mode === 'pi') return T('settleDirect');
    if (it.mode === 'milestone') return T('settleMilestone');
    if (it.mode === 'barter') return T('modeBarter');
    if (it.mode === 'free') return T('sideFree');
    return T('modeOffer');
  };

  const handoffOf = (it: Listing) => HANDOFFS.find(h => h.key === it.handoff) ?? HANDOFFS[0];

  const stepOf = (s: ListingStatus) => (s === 'open' ? 0 : s === 'reserved' ? 1 : 2);

  /** '이웃' 배지는 GPS가 아니라 완료 기록이 증명한다 — 이 도시에서 완료 3건 이상. */
  const neighborDeals = (it: Listing) =>
    posts.filter(p => p.mine && norm(p.city) === norm(it.city) && p.status === 'done').length;

  /* ── 쓰기 동작 (0단계: 이 기기 안에서만) ───────────────────── */

  const toggleSave = (id: string) => setSaved(cur => (cur.includes(id) ? cur.filter(x => x !== id) : [id, ...cur]));

  const requestDeal = (it: Listing) => {
    if (!requireAuth(T('reqBtn'))) return;
    persistOffers({ ...offers, [it.id]: { id: it.id, at: new Date().toISOString() } });
  };

  const submitOffer = (it: Listing) => {
    if (!requireAuth(T('modeOffer'))) return;
    const amount = Number(offerAmt);
    persistOffers({
      ...offers,
      [it.id]: { id: it.id, amount: Number.isFinite(amount) && amount > 0 ? amount : undefined, at: new Date().toISOString() }
    });
    setOfferId(null);
    setOfferAmt('');
  };

  const setStatus = (it: Listing, status: ListingStatus) => {
    persistPosts(posts.map(p =>
      p.id === it.id
        ? {
            ...p,
            status,
            reservedUntil: status === 'reserved' ? new Date(Date.now() + 24 * 3600_000).toISOString() : undefined
          }
        : p
    ));
  };

  const bumpPost = (it: Listing) => {
    const used = it.bumpCount ?? 0;
    if (it.status !== 'open' || used >= BUMP_LIMIT) return;
    persistPosts(posts.map(p => (p.id === it.id ? { ...p, bumpCount: used + 1, bumpAt: new Date().toISOString(), createdAt: new Date().toISOString() } : p)));
  };

  const removePost = (id: string) => {
    if (!requireAuth(T('mineDelete'))) return;
    persistPosts(posts.filter(p => p.id !== id));
  };

  const openPostForm = () => {
    setFRail(rail);
    setFSide(activeSide);
    setFCountry(country === 'GLOBAL' ? (area.country || 'KR') : country);
    setFHandoff(rail === 'B2B' ? 'freight' : rail === 'LOCAL' ? 'meet' : 'remote');
    setFMode(rail === 'B2B' ? 'milestone' : rail === 'LOCAL' ? 'pi' : 'pi');
    setFTagSel(rail === 'WORK' ? 'translate' : rail === 'LOCAL' ? 'goods' : 'equip');
    setFPlace(area.city ? area.district : '');
    setFCity(area.city || '');
    setFormMsg(null);
    if (form.open !== 'post') form.toggle('post');
  };

  const submitPost = () => {
    if (!requireAuth(T('postToggle'))) return;
    if (!fTitle.trim()) { setFormMsg('errTitle'); return; }
    if (!fCity.trim()) { setFormMsg('errCity'); return; }
    if (fHandoff !== 'meet' && !fTerms.trim()) { setFormMsg('errTerms'); return; }

    const price = Number(fPrice);
    const item: Listing = {
      id: `mine-${Date.now().toString(36)}`,
      rail: fRail,
      side: fSide,
      country: fCountry,
      city: fCity.trim(),
      place: fPlace.trim() || undefined,
      tag: fTagSel,
      title: fTitle.trim(),
      detail: fDetail.trim() || '—',
      terms: fTerms.trim() || undefined,
      mode: fMode,
      handoff: fHandoff,
      pi: fMode !== 'free' && fMode !== 'barter' && fPrice.trim() !== '' && Number.isFinite(price) && price > 0 ? price : undefined,
      escrowSoon: fMode === 'milestone',
      tier: fTier,
      status: 'open',
      createdAt: new Date().toISOString(),
      mine: true,
      dealsDone: 0,
      dealsClosed: 0,
      reviews: 0,
      disputes: 0
    };

    persistPosts([item, ...posts]);
    setCountry(fCountry);
    setRail(fRail);
    setSide(fSide);
    setFTitle('');
    setFPrice('');
    setFTerms('');
    setFDetail('');
    setFormMsg('saved');
  };

  if (!mounted) return <div className="bg-white min-h-screen" />;

  const view = countryOf(country);
  const railDef = RAILS.find(r => r.key === rail) ?? RAILS[0];
  const areaLabel = area.city || T('areaLabel');

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
              <span className="flex items-center gap-1.5 min-w-0 flex-1">
                <span translate="no" className="notranslate shrink-0 text-[length:calc(15px*var(--pi-scale))] leading-none">{view.flag}</span>
                <span className="truncate t-card text-black">{countryName(country)}</span>
                <span translate="no" className="notranslate shrink-0 t-tag font-mono text-gray-400">{country === 'GLOBAL' ? 'ALL' : country}</span>
              </span>
              <span className="shrink-0 t-tag text-[#dc2626]">{T('countrySelect')} ▾</span>
            </button>

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

            {/* 통계 — 🐾는 실제 정산 완료 거래에서만 올라간다(지금은 0) */}
            <div className="mt-2 grid grid-cols-4 items-center gap-x-1 border-t border-neutral-200 pt-2 md:mt-5 md:gap-2 md:border-0 md:pt-0 md:max-w-3xl md:mx-auto">
              {[
                { v: '238', label: T('statCountries'), short: T('statCountriesS') },
                { v: T('statFee'), label: T('statFeeLabel'), short: T('statFeeS') },
                { v: '1', label: T('statKyc'), short: T('statKycS') },
                { v: `🐾 ${footprints}`, label: T('statBeom'), short: T('statBeomS') }
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

        {/* ── 2. 상시 ① 생활권 한 줄 (동네 → 도시 → 국가 → 🌍) ──────── */}
        <div className="mt-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAreaOpen(true)}
            className="min-w-0 flex items-center gap-1 border border-neutral-200 rounded-lg bg-neutral-50 px-2 py-1.5 active:scale-[0.99] transition-transform"
          >
            <span aria-hidden className="shrink-0 t-tag">📍</span>
            <span className="truncate t-tag text-black max-w-[104px]">{areaLabel}</span>
            <span aria-hidden className="shrink-0 t-tag text-gray-400">▾</span>
          </button>
          <div className="ml-auto flex items-center gap-0.5 shrink-0" role="group" aria-label={T('radius')}>
            {RADII.map(r => {
              const on = area.radius === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setArea(cur => ({ ...cur, radius: r.key }))}
                  aria-pressed={on}
                  className={`px-1.5 py-1 rounded-md t-tag whitespace-nowrap transition-colors ${on ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-500 hover:text-black'}`}
                >
                  {r.key === 'global' ? `🌍 ${T(r.label)}` : T(r.label)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. 3대 거래 레일 탭 ───────────────────────────────── */}
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {RAILS.map(r => {
            const on = rail === r.key;
            const n = all.filter(it => it.rail === r.key && (country === 'GLOBAL' || it.country === country || it.handoff === 'remote')).length;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => {
                  setRail(r.key);
                  setSide(null);
                  if (form.open === 'post') form.toggle('post');
                }}
                aria-pressed={on}
                className={`flex flex-col items-center gap-0.5 rounded-xl border px-1 py-2 transition-all active:scale-[0.98] ${
                  on ? 'bg-black border-black text-white shadow-sm' : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                <span aria-hidden translate="no" className="notranslate text-[length:calc(15px*var(--pi-scale))] leading-none">{r.icon}</span>
                <span className="t-tag whitespace-nowrap">{T(r.short)}</span>
                <span translate="no" className={`notranslate t-tag font-mono ${on ? 'text-white/50' : 'text-gray-300'}`}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* ── 4. 상시 ② 레일 서브칩 한 줄 (양방향) ───────────────── */}
        <div className="mt-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {sidesForRail.map(s => {
            const on = activeSide === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSide(s.key)}
                aria-pressed={on}
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg t-tag whitespace-nowrap border transition-colors ${
                  on ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {T(s.label)}
                <span translate="no" className={`notranslate font-mono ${on ? 'text-white/60' : 'text-gray-300'}`}>{sideCounts[s.key] ?? 0}</span>
              </button>
            );
          })}
          <span className="ml-auto shrink-0 hidden sm:block t-tag text-gray-300">{T('listHint')}</span>
        </div>

        {/* ── 5. 상시 ③ 🔎 조건 · 정렬 (1줄 아코디언) ─────────────── */}
        <div className="mt-1.5">
          <AccRow
            id="filter"
            open={form.open === 'filter'}
            onToggle={() => form.toggle('filter')}
            icon="🔎"
            title={T('filterLabel')}
            badge={
              filterOn ? <span className="shrink-0 t-tag bg-[#dc2626] text-white rounded-full px-1.5 py-0.5">•</span> : null
            }
            price={
              <span translate="no" className="notranslate">
                {T(SORTS.find(s => s.key === sort)?.label ?? 'sortNew')}
              </span>
            }
          >
            <p className="t-tag text-gray-400">{T('postRail')}</p>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setFTag(null)}
                className={`px-1.5 py-0.5 rounded-md t-tag border ${fTag === null ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
              >
                {T('radiusGlobal')}
              </button>
              {(Object.keys(TAGS) as TagKey[]).map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFTag(fTag === k ? null : k)}
                  className={`px-1.5 py-0.5 rounded-md t-tag border ${fTag === k ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
                >
                  {TAGS[k].icon} {L(TAGS[k].label)}
                </button>
              ))}
            </div>

            <p className="t-tag text-gray-400 pt-0.5">{T('postPrice')}</p>
            <div className="flex items-center gap-1">
              <input
                value={fMin}
                onChange={e => setFMin(e.target.value)}
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="0"
                aria-label="min"
                className="w-20 bg-white border border-neutral-300 rounded-lg px-2 py-1.5 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
              <span className="t-tag text-gray-400">–</span>
              <input
                value={fMax}
                onChange={e => setFMax(e.target.value)}
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="∞"
                aria-label="max"
                className="w-20 bg-white border border-neutral-300 rounded-lg px-2 py-1.5 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
              <span translate="no" className="notranslate t-tag text-gray-400">Pi</span>
            </div>

            <p className="t-tag text-gray-400 pt-0.5">{T('handoffLabel')}</p>
            <div className="flex flex-wrap gap-1">
              {HANDOFFS.map(h => (
                <button
                  key={h.key}
                  type="button"
                  onClick={() => setQHandoff(qHandoff === h.key ? null : h.key)}
                  className={`px-1.5 py-0.5 rounded-md t-tag border ${qHandoff === h.key ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
                >
                  {h.icon} {T(h.label)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              <p className="t-tag text-gray-400 mr-1">L0–L3</p>
              {([0, 1, 2, 3] as Tier[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQTier(qTier === t ? null : t)}
                  className={`px-1.5 py-0.5 rounded-md t-tag border ${qTier === t ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
                >
                  L{t}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              <p className="t-tag text-gray-400 mr-1">{T('stateLabel')}</p>
              <button
                type="button"
                onClick={() => setFReserved(false)}
                className={`px-1.5 py-0.5 rounded-md t-tag border ${!fReserved ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
              >
                {T('statusOpen')}
              </button>
              <button
                type="button"
                onClick={() => setFReserved(true)}
                className={`px-1.5 py-0.5 rounded-md t-tag border ${fReserved ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
              >
                {T('statusOpen')} · {T('statusReserved')}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              {SORTS.map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSort(s.key)}
                  className={`px-1.5 py-0.5 rounded-md t-tag border ${sort === s.key ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
                >
                  {T(s.label)}
                </button>
              ))}
              {filterOn && (
                <button
                  type="button"
                  onClick={() => { setFTag(null); setQHandoff(null); setQTier(null); setFMin(''); setFMax(''); setFReserved(false); }}
                  className="ml-auto t-tag text-[#dc2626] border border-[#dc2626]/40 rounded-md px-1.5 py-0.5"
                >
                  ↺
                </button>
              )}
            </div>
          </AccRow>
        </div>

        {/* ── 6. 1줄 클릭형 거래 목록 ───────────────────────────── */}
        <div className="mt-1.5 space-y-1">
          {rows.length === 0 && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-4 text-center">
              <p translate="no" className="notranslate t-tag text-gray-400">{view.flag} {country === 'GLOBAL' ? 'ALL' : country} · {T(sidesForRail.find(s => s.key === activeSide)?.label ?? 'sideSell')}</p>
              <p className="t-card text-neutral-800 mt-1">{T('listEmptyTitle')}</p>
              <p className="t-sub text-neutral-500 mt-1">{T('listEmptyBody').replace('{c}', countryName(country))}</p>
              {area.radius !== 'global' && area.city !== '' && (
                <button
                  type="button"
                  onClick={() => setArea(cur => ({ ...cur, radius: cur.radius === 'hood' ? 'city' : cur.radius === 'city' ? 'country' : 'global' }))}
                  className="mt-1 t-tag text-[#dc2626] underline"
                >
                  {T('areaWideHint')}
                </button>
              )}
              <button
                type="button"
                onClick={openPostForm}
                className="mt-2 block mx-auto bg-black hover:bg-[#dc2626] text-white t-btn px-3 py-2 rounded-lg transition-colors active:scale-95"
              >
                ✍️ {T('postToggle')}
              </button>
            </div>
          )}

          {rows.map(it => {
            const info = countryOf(it.country);
            const h = handoffOf(it);
            const step = stepOf(it.status);
            const isOpen = row.open === it.id;
            const myOffer = offers[it.id];
            const isMine = !!it.mine;
            const bumpUsed = it.bumpCount ?? 0;

            return (
              <AccRow
                key={it.id}
                id={it.id}
                open={isOpen}
                onToggle={() => row.toggle(it.id)}
                icon={TAGS[it.tag].icon}
                title={L(it.title)}
                badge={
                  it.status !== 'open'
                    ? <StatusChip status={it.status} label={T(STATUS_LABEL[it.status])} />
                    : it.mode === 'free'
                      ? <span className="shrink-0 t-tag border border-[#dc2626] text-[#dc2626] rounded-full px-1.5 py-0.5 whitespace-nowrap">{T('sideFree')}</span>
                      : null
                }
                region={<><span aria-hidden>{info.flag}</span> {it.city}</>}
                price={priceLabel(it)}
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="t-tag bg-neutral-100 text-neutral-600 rounded-full px-1.5 py-0.5">{L(TAGS[it.tag].label)}</span>
                  <span translate="no" className="notranslate t-tag border border-neutral-300 text-neutral-600 rounded-full px-1.5 py-0.5">{TIER_BADGE[it.tier]}</span>
                  {it.demo && <span className="t-tag bg-neutral-100 text-neutral-500 rounded-full px-1.5 py-0.5">{T('demoBadge')}</span>}
                  {isMine && <span className="t-tag bg-[#dc2626] text-white rounded-full px-1.5 py-0.5">{T('mineBadge')}</span>}
                  <span translate="no" className="notranslate t-tag text-gray-300 ml-auto">{ageLabel(it.createdAt)}</span>
                </div>

                <p className="t-body text-neutral-600">{L(it.detail)}</p>

                {/* 이행 × 정산 — 두 축을 따로 적는다 */}
                <div className="space-y-0.5 border-t border-neutral-100 pt-1.5">
                  <p className="t-tag text-neutral-600">
                    <span aria-hidden>{h.icon}</span> {T(h.label)} · <span className="text-black">{settleLabel(it)}</span>
                    {it.qty && <span className="text-gray-400"> · {it.qty}</span>}
                  </p>
                  {it.place && (
                    <p className="t-tag text-neutral-500">
                      📍 {it.place}
                      {neighborDeals(it) >= 3 && (
                        <span className="text-[#dc2626]"> · {T('neighborBadge')} 🐾 {neighborDeals(it)}</span>
                      )}
                    </p>
                  )}
                  {it.escrowSoon && <p className="t-tag text-[#dc2626]">🔒 {T('settleEscrowSoon')}</p>}
                  {it.priceBreaks && it.priceBreaks.length > 0 && (
                    <p translate="no" className="notranslate t-tag text-neutral-600">
                      {it.priceBreaks.map(b => `${b.label}: ${b.price}`).join(' · ')} Pi
                      {it.moq ? ` · MOQ ${it.moq}` : ''}
                    </p>
                  )}
                  {it.terms && <p className="t-tag text-neutral-500">📄 {it.terms}</p>}
                  <p className="t-tag text-neutral-500">
                    🐾 {it.dealsDone}
                    <span className="text-gray-300"> · </span>
                    {T('verifiedDeal')} {it.reviews}
                    {it.stars !== undefined && <span className="text-black"> ⭐ {it.stars}</span>}
                  </p>
                  {it.tier >= 2 && <p className="t-tag text-neutral-500">🛡️ {T('disputeSeal')}</p>}
                  {it.status === 'done' && it.reviews === 0 && <p className="t-tag text-neutral-400">{T('reviewLocked')}</p>}
                </div>

                <StepBar step={step} labels={[T('statusOpen'), T('statusReserved'), T('statusDone')]} />

                {/* 내 글 — 상태 잠금(예약중/완료) · 끌올 3회 · 삭제 */}
                {isMine ? (
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    <button
                      type="button"
                      onClick={() => setStatus(it, 'reserved')}
                      disabled={it.status !== 'open'}
                      className={`t-tag px-2 py-1 rounded-lg border transition-colors ${it.status === 'open' ? 'border-neutral-300 text-neutral-700 hover:border-black' : 'border-neutral-200 text-neutral-300'}`}
                    >
                      {T('statusReserved')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(it, 'done')}
                      disabled={it.status === 'done'}
                      className={`t-tag px-2 py-1 rounded-lg border transition-colors ${it.status !== 'done' ? 'border-neutral-300 text-neutral-700 hover:border-black' : 'border-neutral-200 text-neutral-300'}`}
                    >
                      {T('statusDone')}
                    </button>
                    <button
                      type="button"
                      onClick={() => bumpPost(it)}
                      disabled={it.status !== 'open' || bumpUsed >= BUMP_LIMIT}
                      className={`t-tag px-2 py-1 rounded-lg border transition-colors ${it.status === 'open' && bumpUsed < BUMP_LIMIT ? 'border-neutral-300 text-neutral-700 hover:border-black' : 'border-neutral-200 text-neutral-300'}`}
                    >
                      {T('bump')} {bumpUsed}/{BUMP_LIMIT}
                    </button>
                    <button
                      type="button"
                      onClick={() => removePost(it.id)}
                      className="ml-auto t-tag px-2 py-1 rounded-lg border border-neutral-300 text-neutral-500 hover:text-[#dc2626] hover:border-[#dc2626] transition-colors"
                    >
                      {T('mineDelete')}
                    </button>
                  </div>
                ) : myOffer ? (
                  <div className="flex items-center gap-2 pt-0.5">
                    <p className="t-tag text-[#dc2626]">
                      ✓ {T('reqDone')}{myOffer.amount ? ` · ${fmtPi(myOffer.amount)} Pi` : ''}
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleSave(it.id)}
                      aria-label={T('mySaved')}
                      className="ml-auto t-tag text-[#dc2626]"
                    >
                      {saved.includes(it.id) ? '★' : '☆'}
                    </button>
                  </div>
                ) : offerId === it.id ? (
                  <div className="flex items-center gap-1 pt-0.5">
                    <input
                      value={offerAmt}
                      onChange={e => setOfferAmt(e.target.value)}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      placeholder="Pi"
                      aria-label={T('modeOffer')}
                      className="w-20 bg-white border border-neutral-300 rounded-lg px-2 py-1.5 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    />
                    <button
                      type="button"
                      onClick={() => submitOffer(it)}
                      className="bg-black hover:bg-[#dc2626] text-white t-btn px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      {T('postSubmit')}
                    </button>
                    <button type="button" onClick={() => setOfferId(null)} className="t-tag text-gray-400 px-1">✕</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => { setOfferId(it.id); setOfferAmt(''); }}
                      className="t-tag px-2 py-1 rounded-lg border border-neutral-300 text-neutral-700 hover:border-black transition-colors"
                    >
                      {T('modeOffer')}
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDeal(it)}
                      className="bg-black hover:bg-[#dc2626] text-white t-btn px-3 py-1.5 rounded-lg transition-all active:scale-95"
                    >
                      {T('reqBtn')}{!authenticated && ' 🔒'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSave(it.id)}
                      aria-label={T('mySaved')}
                      className={`ml-auto t-tag px-1.5 ${saved.includes(it.id) ? 'text-[#dc2626]' : 'text-gray-300'}`}
                    >
                      {saved.includes(it.id) ? '★' : '☆'}
                    </button>
                  </div>
                )}
              </AccRow>
            );
          })}
        </div>

        {rows.length > 0 && (
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="t-tag text-gray-400">
              <span translate="no" className="notranslate">{view.flag}</span> {countryName(country)} · {T('listCount').replace('{n}', String(rows.length))}
            </p>
            <p className="hidden sm:block t-tag text-gray-300">{T(railDef.title)} · {T(railDef.desc)}</p>
          </div>
        )}

        {/* ── 7. ✍️ 거래·일감 올리기 (접힌 아코디언 폼) ─────────── */}
        <div className="mt-3">
          <AccRow
            id="post"
            open={form.open === 'post'}
            onToggle={() => {
              setFormMsg(null);
              if (form.open !== 'post') openPostForm();
            }}
            icon="✍️"
            title={T('postToggle')}
            accent="red"
          >
            <div className="flex flex-wrap gap-1">
              {RAILS.map(r => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => {
                    setFRail(r.key);
                    const first = RAIL_SIDES[r.key][0].key;
                    setFSide(first);
                    setFTagSel(r.key === 'WORK' ? 'translate' : r.key === 'LOCAL' ? 'goods' : 'equip');
                    setFHandoff(r.key === 'B2B' ? 'freight' : r.key === 'LOCAL' ? 'meet' : 'remote');
                    setFMode(r.key === 'B2B' ? 'milestone' : 'pi');
                  }}
                  className={`px-2 py-1 rounded-lg t-tag border ${fRail === r.key ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
                >
                  {r.icon} {T(r.short)}
                </button>
              ))}
            </div>

            {/* 양방향 — 일감 올리기 ↔ 내 기술·시간 / 직거래·구해요·나눔 / 매물·견적 */}
            <div className="flex flex-wrap gap-1">
              {RAIL_SIDES[fRail].map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setFSide(s.key)}
                  className={`px-2 py-1 rounded-lg t-tag border ${fSide === s.key ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'bg-white text-neutral-600 border-neutral-200'}`}
                >
                  {T(s.label)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <label className="block text-left">
                <span className="block t-tag text-gray-400 mb-0.5">{T('handoffLabel')}</span>
                <select
                  value={fHandoff}
                  onChange={e => setFHandoff(e.target.value as Handoff)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
                >
                  {HANDOFFS.map(h => (
                    <option key={h.key} value={h.key}>{h.icon} {T(h.label)}</option>
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
                  {DEAL_MODES.map(m => (
                    <option key={m.key} value={m.key}>{T(m.label)}</option>
                  ))}
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

            <div className="grid grid-cols-2 gap-1.5">
              <label className="block text-left">
                <span className="block t-tag text-gray-400 mb-0.5">{T('postRail')}</span>
                <select
                  value={fTagSel}
                  onChange={e => setFTagSel(e.target.value as TagKey)}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
                >
                  {(Object.keys(TAGS) as TagKey[]).map(k => (
                    <option key={k} value={k}>{TAGS[k].icon} {L(TAGS[k].label)}</option>
                  ))}
                </select>
              </label>
              <label className="block text-left">
                <span className="block t-tag text-gray-400 mb-0.5">L0–L3</span>
                <select
                  value={fTier}
                  onChange={e => setFTier(Number(e.target.value) as Tier)}
                  translate="no"
                  className="notranslate w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
                >
                  {([0, 1, 2, 3] as Tier[]).map(t => (
                    <option key={t} value={t}>{TIER_BADGE[t]}</option>
                  ))}
                </select>
              </label>
            </div>

            <input
              value={fPlace}
              onChange={e => setFPlace(e.target.value)}
              placeholder="동네 · 거점 (예: 해운대 · Ikeja)"
              aria-label={T('areaLabel')}
              className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag text-black placeholder-neutral-400 shadow-xs outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />

            <input
              value={fTitle}
              onChange={e => setFTitle(e.target.value)}
              placeholder={T('postTitlePh')}
              aria-label={T('postTitle')}
              className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-body text-black placeholder-neutral-400 shadow-xs outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />

            {fMode !== 'free' && fMode !== 'barter' && (
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

            {/* 이행 방식에 따라 필요한 조건이 다르다 — 접힌 채로 필드만 바뀐다 */}
            {fHandoff !== 'meet' && (
              <input
                value={fTerms}
                onChange={e => setFTerms(e.target.value)}
                placeholder={
                  fHandoff === 'delivery' ? T('postTermsDelivery') : fHandoff === 'freight' ? T('postTermsFreight') : T('postTermsRemote')
                }
                aria-label={T('handoffLabel')}
                className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag text-black placeholder-neutral-400 shadow-xs outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
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
                    : formMsg === 'errCity'
                      ? T('postErrCity')
                      : T('postErrTerms')}
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

        {/* ── 8. 🛡️ 안전 거래 4원칙 ─────────────────────────────── */}
        <div className="mt-2">
          <AccRow id="safety" open={form.open === 'safety'} onToggle={() => form.toggle('safety')} icon="🛡️" title={T('safetyToggle')}>
            <ul className="space-y-1">
              {[T('safety1'), T('safety2'), T('safety3'), T('safety4')].map((line, i) => (
                <li key={i} className="flex gap-1.5 text-left">
                  <span translate="no" className="notranslate shrink-0 t-tag text-[#dc2626]">{i + 1}</span>
                  <span className="t-body text-gray-600">{line}</span>
                </li>
              ))}
            </ul>
            <p className="t-tag text-neutral-500 border-t border-neutral-100 pt-1.5">🛡️ {T('disputeSeal')}</p>
          </AccRow>
        </div>

        {/* ── 9. 📦 내 거래함 — 재방문 이유 ──────────────────────── */}
        <div className="mt-2">
          <AccRow
            id="deals"
            open={form.open === 'deals'}
            onToggle={() => form.toggle('deals')}
            icon="📦"
            title={T('myDeals')}
            badge={
              <span className="shrink-0 t-tag text-neutral-500 whitespace-nowrap">
                {T('myPosts')} {myPosts}
                <span className="text-gray-300"> · </span>
                {T('myReserved')} {myReserved}
              </span>
            }
            price={`★ ${saved.length}`}
          >
            {myPosts === 0 && saved.length === 0 ? (
              <p className="t-body text-neutral-500">{T('listEmptyTitle')}</p>
            ) : (
              <div className="space-y-1.5">
                {myPosts > 0 && (
                  <div className="space-y-1">
                    <p className="t-tag text-gray-400">{T('myPosts')} {myPosts}</p>
                    {posts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { row.toggle(p.id); }}
                        className="w-full flex items-center gap-1.5 text-left bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5"
                      >
                        <span aria-hidden className="shrink-0 t-tag">{TAGS[p.tag].icon}</span>
                        <span className="truncate t-tag text-black min-w-0 flex-1">{L(p.title)}</span>
                        <StatusChip status={p.status} label={T(STATUS_LABEL[p.status])} />
                      </button>
                    ))}
                  </div>
                )}

                {Object.keys(offers).length > 0 && (
                  <div className="space-y-1">
                    <p className="t-tag text-gray-400">{T('reqDone')}</p>
                    {Object.values(offers).map(o => {
                      const target = all.find(x => x.id === o.id);
                      if (!target) return null;
                      return (
                        <div key={o.id} className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5">
                          <span className="truncate t-tag text-black min-w-0 flex-1">{L(target.title)}</span>
                          <span translate="no" className="notranslate shrink-0 t-tag text-[#dc2626]">
                            {o.amount ? `${fmtPi(o.amount)} Pi` : T('reqDone')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {saved.length > 0 && (
                  <div className="space-y-1">
                    <p className="t-tag text-gray-400">★ {T('mySaved')} {saved.length}</p>
                    {saved.map(id => {
                      const target = all.find(x => x.id === id);
                      if (!target) return null;
                      return (
                        <div key={id} className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5">
                          <span className="truncate t-tag text-black min-w-0 flex-1">{L(target.title)}</span>
                          <span translate="no" className="notranslate shrink-0 t-tag text-gray-400">{priceLabel(target)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <p className="t-tag text-neutral-400 border-t border-neutral-100 pt-1.5">{T('footprintRule')}</p>
          </AccRow>
        </div>

        <p className="text-center text-gray-300 t-tag mt-6 mb-2">
          <span translate="no" className="notranslate">Vendor</span> · <span translate="no" className="notranslate">vendor.kedheon.com</span> · {T('footerTag')}
        </p>
      </main>

      {/* ── 생활권 시트 (위치 추적 없음 · 내가 고른다) ─────────────── */}
      {areaOpen && (
        <div
          className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setAreaOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-2xl border border-neutral-200 overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 pt-3 pb-2 border-b border-neutral-200 flex items-start justify-between gap-2">
              <div className="min-w-0 text-left">
                <h3 className="text-black t-card">{T('areaSet')}</h3>
                <p className="text-neutral-500 t-sub mt-0.5">{T('areaNoGps')}</p>
              </div>
              <button
                type="button"
                onClick={() => setAreaOpen(false)}
                aria-label="close"
                className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 t-btn hover:bg-neutral-200"
              >
                ✕
              </button>
            </div>

            <div className="px-4 py-3 space-y-2 text-left">
              <button
                type="button"
                onClick={() => { setAreaOpen(false); setPickerFor('area'); }}
                className="w-full flex items-center justify-between gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <span aria-hidden className="shrink-0">{countryOf(area.country).flag}</span>
                  <span className="truncate t-card text-black">{countryName(area.country)}</span>
                </span>
                <span className="shrink-0 t-tag text-gray-400">▾</span>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <label className="block">
                  <span className="block t-tag text-gray-400 mb-0.5">{T('radiusCity')}</span>
                  <input
                    value={area.city}
                    onChange={e => setArea(cur => ({ ...cur, city: e.target.value }))}
                    placeholder={T('postCityPh')}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                </label>
                <label className="block">
                  <span className="block t-tag text-gray-400 mb-0.5">{T('radiusHood')}</span>
                  <input
                    value={area.district}
                    onChange={e => setArea(cur => ({ ...cur, district: e.target.value }))}
                    placeholder="해운대 · Ikeja"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-2 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                </label>
              </div>

              <div>
                <p className="t-tag text-gray-400 mb-0.5">{T('radius')}</p>
                <div className="flex flex-wrap gap-1">
                  {RADII.map(r => {
                    const on = area.radius === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setArea(cur => ({ ...cur, radius: r.key }))}
                        className={`px-2 py-1 rounded-lg t-tag border ${on ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200'}`}
                      >
                        {r.key === 'global' ? `🌍 ${T(r.label)}` : T(r.label)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAreaOpen(false)}
                className="w-full bg-black text-white t-btn py-2.5 rounded-lg active:scale-95 transition-transform"
              >
                {T('areaSet')} ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 국가 선택 패널 — 보기/등록 폼/생활권 공용 */}
      <CountryPicker
        open={pickerFor !== null}
        title={T('countryPickTitle')}
        desc={T('countryPickDesc')}
        searchPlaceholder={T('countrySearch')}
        globalLabel={T('countryGlobal')}
        emptyLabel={T('noCountry')}
        countLabel={T('countryCount')}
        current={pickerFor === 'form' ? fCountry : pickerFor === 'area' ? area.country : country}
        onClose={() => setPickerFor(null)}
        onSelect={code => {
          if (pickerFor === 'form') setFCountry(code === 'GLOBAL' ? 'KR' : code);
          else if (pickerFor === 'area') {
            setArea(cur => ({ ...cur, country: code === 'GLOBAL' ? 'KR' : code }));
            setAreaOpen(true);
          } else setCountry(code);
        }}
      />

      {/* ── 하단 고정 푸터 (6개 앱) ──────────────────────────── */}
      <AppDock active="VENDOR" soonMessage={T('alertSoon')} />
    </div>
  );
}
