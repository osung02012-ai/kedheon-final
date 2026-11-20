'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PiBadge from '../components/PiBadge';
import PiPayButton from '../components/PiPayButton';
import { usePi } from '../components/PiProvider';
import PiReadOnlyBanner from '../components/PiReadOnlyBanner';
import AppDock from '../components/AppDock';
import PrivacyLink from '../components/PrivacyLink';
import AppHeader from '../components/AppHeader';
import HanbokIcon from '../components/HanbokIcon';
import LangSelect from '../components/LangSelect';
import SectionHead from './components/SectionHead';
import AccRow, { Requirement, useAccordion } from './components/Accordion';
import JourneyRail from './components/JourneyRail';
import JourneySection, { BypassNote } from './components/JourneySection';
import TicketsSection from './components/TicketsSection';
import FoodMapSection from './components/FoodMapSection';
import {
  LANGS, LANG_TAG, detectLang, tr, ui,
  type Lang, type L10, type UIKey
} from './lib/i18n';
import { ZONES, PICK_ORDER, type PickKey } from './lib/zones';
import { GOODS, LINKS } from './lib/packs';
import { SEC, ARRIVAL, TRANSIT, STAY, BYPASS, JLABEL } from './lib/journey';
import { ACL } from './lib/accordion';
import { GOODS_CHANNELS } from './lib/culture';

/* ------------------------------------------------------------------
 * Hangang — Korea-wide K-culture pass (Kedheon ecosystem)
 * 디자인 시스템: 케데헌과 동일 (White / Black / Red #DC2626)
 * 10개국어 · 1~100 여정(입국→출국) · 인증 뱃지 · 순수 관광객 맛집 지도
 * ------------------------------------------------------------------ */

const PICK_ICON: Record<PickKey, string> = {
  stay: '🏨', culture: '🎫', food: '🍗', transit: '🚌'
};

const PICK_LABEL_KEY: Record<PickKey, UIKey> = {
  stay: 'pickStay', culture: 'pickCulture', food: 'pickFood', transit: 'pickTransit'
};

/** 장소·패스 북마크 보관 키. 비로그인 방문자는 이 브라우저(localStorage)에만 저장된다. */
const BOOKMARK_KEY = 'hangang.bookmarks';

function fmtPi(n: number) {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

export default function HangangPage() {
  const { requireAuth, authenticated, setGateLang, accessToken } = usePi();
  const [lang, setLang] = useState<Lang>('KR');
  const [mounted, setMounted] = useState(false);
  const [zoneKey, setZoneKey] = useState('SEOUL');
  const [pick, setPick] = useState<Record<PickKey, number>>({ stay: 0, culture: 0, food: 0, transit: 0 });
  const [inquiry, setInquiry] = useState(false);
  const [booked, setBooked] = useState<{ zone: string; total: number; id: string }[]>([]);
  const [beom, setBeom] = useState(0);
  const [reqType, setReqType] = useState('pensive');
  const [reqZone, setReqZone] = useState('SEOUL');
  const [reqNote, setReqNote] = useState('');
  const [requests, setRequests] = useState<{ id: string; type: string; zone: string; note: string }[]>([]);
  /** 저장한 장소·패스(권역 키). 로그인 시 서버 hangang_bookmarks, 비로그인 시 localStorage. */
  const [spots, setSpots] = useState<string[]>([]);
  // 06 굿즈·응급 — 1줄 클릭형 아코디언(누른 항목만 안쪽이 열린다)
  const goodsAcc = useAccordion();

  const T = (k: UIKey) => ui(k, lang);
  const L = (v: L10) => tr(v, lang);

  useEffect(() => {
    setLang(detectLang());
    setMounted(true);
  }, []);

  /** localStorage와 화면 상태를 함께 갱신한다(서버 저장 실패 시의 폴백). */
  const applySpots = useCallback((next: string[]) => {
    setSpots(next);
    try {
      window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
    } catch {
      /* 저장소가 막힌 브라우저 — 화면 상태만 유지 */
    }
  }, []);

  // 장소 북마크: 먼저 이 브라우저에 남은 목록을 그리고, 로그인하면 서버 원장으로 맞춘다.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BOOKMARK_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setSpots(parsed.filter((v): v is string => typeof v === 'string'));
    } catch {
      /* 손상된 값은 무시 */
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    let alive = true;
    fetch('/api/hangang/bookmark', {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store'
    })
      .then(r => r.json())
      .then((data: { ok?: boolean; spotIds?: string[] } | null) => {
        if (!alive || !data?.ok || !Array.isArray(data.spotIds)) return;
        applySpots(data.spotIds);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [accessToken, applySpots]);

  const toggleSpot = async (spotId: string) => {
    if (accessToken) {
      try {
        const res = await fetch('/api/hangang/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ spotId })
        });
        const data = (await res.json().catch(() => null)) as { ok?: boolean; spotIds?: string[] } | null;
        if (res.ok && data?.ok && Array.isArray(data.spotIds)) {
          applySpots(data.spotIds);
          return;
        }
      } catch {
        /* 네트워크 실패 → 로컬 저장으로 폴백 */
      }
    }
    applySpots(spots.includes(spotId) ? spots.filter(s => s !== spotId) : [...spots, spotId]);
  };

  useEffect(() => {
    document.documentElement.lang = LANG_TAG[lang] || 'en';
  }, [lang]);

  // 실행 권한 안내 패널도 같은 언어로 (10개국어)
  useEffect(() => {
    setGateLang(lang);
  }, [lang, setGateLang]);

  const zone = ZONES.find(z => z.key === zoneKey) ?? ZONES[0];
  const total = useMemo(
    () => PICK_ORDER.reduce((sum, k) => sum + zone.picks[k][pick[k]].pi, 0),
    [zone, pick]
  );

  const selectZone = (k: string) => {
    setZoneKey(k);
    setPick({ stay: 0, culture: 0, food: 0, transit: 0 });
  };

  const confirmBooking = () => {
    if (!requireAuth(T('modalConfirm'))) return;
    setBooked(prev => [{ zone: zone.code, total, id: `${zone.key}-${Date.now().toString().slice(-6)}` }, ...prev]);
    setBeom(v => v + 5);
    setInquiry(false);
  };

  const submitRequest = () => {
    if (!requireAuth(T('submitBtn'))) return;
    if (!reqNote.trim()) {
      alert(T('alertNote'));
      return;
    }
    setRequests(prev => [{ id: Date.now().toString().slice(-6), type: reqType, zone: reqZone, note: reqNote.trim() }, ...prev]);
    setBeom(v => v + 2);
    setReqNote('');
  };

  if (!mounted) return <div className="bg-white min-h-screen" />;

  const goodsOf = (id: string) => GOODS.find(g => g.id === id) || GOODS[0];

  return (
    <div className={`flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-24 selection:bg-red-50 overflow-x-hidden ${lang === 'KR' ? 'break-keep' : ''}`}>

      {/* ── 상단 네비게이션 (케데헌 규격 · 10개국어) ─────────────── */}
      <AppHeader
        brand={
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg border border-black bg-black flex items-center justify-center shrink-0">
              <span className="text-white t-card" translate="no">H</span>
            </div>
            <div className="text-left leading-tight font-bold min-w-0">
              <h1 className="notranslate t-brand text-black italic uppercase truncate" translate="no">Hangang</h1>
              <span className="block text-gray-400 t-tag font-mono uppercase whitespace-nowrap">K-CULTURE PASS</span>
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

      <main className="w-full max-w-5xl px-4 py-3">

        <PiReadOnlyBanner className="mb-3" />
        {/* ── 1. 히어로 ─────────────────────────────────────────── */}
        {/* 첫 화면(390×844)에서 히어로 + '01 전국 7대 권역' 머리까지 같이 보이도록,
            대표이미지는 모바일 158px 카드로 묶었다(BNPi 기준). 큰 글씨 설정에서
            히어로가 화면을 덮지 않게 하는 것이 목적이다. 명패(hangang.pi)는 그림 안에 있다.
            캡션·태그 뱃지·통계 카드박스는 데스크톱 전용. */}
        <section className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-[var(--card-shadow)] overflow-hidden px-3 py-2.5 md:px-8 md:py-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#dc2626]/5" />

          <div className="relative md:grid md:grid-cols-[1.08fr_0.92fr] md:gap-7 md:items-center">
            {/* 모바일: 상단 중앙 대표이미지 카드(그림에 hangang.pi 명패 포함) / 데스크톱: 오른쪽 칸 큰 그림 + 캡션 */}
            <figure className="relative mx-auto w-full max-w-[158px] sm:max-w-[180px] md:order-2 md:max-w-[340px] md:shrink-0">
              <img
                src="/hangang-hero-emerald.jpg"
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

            <div className="min-w-0 text-left md:order-1 mt-2 md:mt-0">
              <p translate="no" className="notranslate hidden md:inline-block t-tag font-mono text-[#dc2626] uppercase whitespace-nowrap">
                hangang.pi · K-Culture Pass
              </p>
              <h2 className="t-hero text-black mt-0.5">
                {T('heroTitle')}
              </h2>
              <p className="text-gray-500 t-sub mt-1 max-w-2xl">
                {T('heroDesc')}
              </p>
              <div className="hidden md:flex flex-wrap items-center justify-start gap-1.5 mt-3">
                <span className="t-tag font-mono uppercase bg-black text-white rounded-md px-2 py-1">
                  {T('heroTag1')}
                </span>
                <span className="t-tag font-mono uppercase bg-neutral-100 text-neutral-600 rounded-md px-2 py-1">
                  {T('heroTag2')}
                </span>
              </div>
            </div>
          </div>

          {/* 통계: 모바일은 얇은 1줄 4칸 스트립, 데스크톱은 1×4 카드 */}
          <div className="relative mt-2.5 grid grid-cols-4 items-center gap-x-1 border-t border-neutral-200 pt-2 md:mt-5 md:gap-2 md:border-0 md:pt-0 md:max-w-3xl md:mx-auto">
            {[
              { v: '0%', label: T('statFee'), short: T('statFeeS') },
              { v: '7', label: T('statZones'), short: T('statZonesS') },
              { v: '1330', label: T('statHotline'), short: T('statHotlineS') },
              { v: `🐾 ${beom}`, label: T('statBeom'), short: T('statBeomS') }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-0 md:items-start md:gap-0 md:bg-white md:border md:border-neutral-200 md:rounded-xl md:px-2 md:py-2">
                <p translate="no" className="notranslate text-black t-tag font-black md:text-[length:var(--t-stat)] whitespace-nowrap">{s.v}</p>
                <p className="text-gray-400 t-tag md:mt-0.5 whitespace-nowrap">
                  <span className="md:hidden">{s.short}</span>
                  <span className="hidden md:inline">{s.label}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 여정 스텝 레일 + 인증 뱃지 범례 ───────────────────── */}
        <JourneyRail lang={lang} />

        {/* ── 01 입국·공항 ─────────────────────────────────────── */}
        <JourneySection
          id="journey-arrival"
          no="01"
          title={SEC.arrival.title}
          desc={SEC.arrival.desc}
          cards={ARRIVAL}
          lang={lang}
          bypass={[BYPASS[1]]}
        />

        {/* ── 02 교통·결제 ─────────────────────────────────────── */}
        <JourneySection
          id="journey-transit"
          no="02"
          title={SEC.transit.title}
          desc={SEC.transit.desc}
          cards={TRANSIT}
          lang={lang}
        />

        {/* ── 03 숙소·짐 ───────────────────────────────────────── */}
        <JourneySection
          id="journey-stay"
          no="03"
          title={SEC.stay.title}
          desc={SEC.stay.desc}
          cards={STAY}
          lang={lang}
          bypass={[BYPASS[2]]}
        />

        {/* ── 04 콘서트·공연 예매 ──────────────────────────────── */}
        <TicketsSection lang={lang} />

        {/* ── 05 순수 관광객 맛집 지도 ─────────────────────────── */}
        <FoodMapSection lang={lang} bypass={[BYPASS[3]]} />

        {/* ── 06 한국 장인 굿즈 · 응급 안전망 ──────────────────── */}
        <section id="journey-goods" className="scroll-mt-3">
        <SectionHead no="06" title={L(SEC.goods.title)} desc={L(SEC.goods.desc)} />

        {/* 06-1. 장인 굿즈 3대 공식 판로 — 1줄 행(누른 항목만 안쪽이 열린다) */}
        <p className="t-tag uppercase text-gray-400 text-left mb-1">K-CRAFT OFFICIAL STORES</p>
        <div className="space-y-1">
          {GOODS_CHANNELS.map(g => (
            <AccRow
              key={g.id}
              id={`goods-${g.id}`}
              open={goodsAcc.open === `goods-${g.id}`}
              onToggle={() => goodsAcc.toggle(`goods-${g.id}`)}
              icon="🏺"
              title={g.name}
              titleNoTranslate
            >
              <Requirement kind={g.badge} lang={lang} />
              <p className="t-body text-neutral-600">{L(g.desc)}</p>
              <p className="t-tag text-neutral-500 border-t border-neutral-100 pt-1.5">{L(g.items)}</p>
              <div className="flex justify-end">
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-tag text-[#dc2626] hover:underline"
                >
                  <span translate="no" className="notranslate">{g.urlName}</span> ↗
                </a>
              </div>
            </AccRow>
          ))}

          <AccRow
            id="goods-bypass"
            open={goodsAcc.open === 'goods-bypass'}
            onToggle={() => goodsAcc.toggle('goods-bypass')}
            icon="🧷"
            title={L(JLABEL.bypassTitle)}
            accent="red"
          >
            <BypassNote lines={[BYPASS[4]]} lang={lang} />
            <p className="t-tag text-gray-400">{L(ACL.bypassHint)}</p>
          </AccRow>
        </div>

        {/* 06-2. K-굿즈 · 한복 · 짐보관 대행 보드 (기존 구조 유지) */}
        <p className="t-tag uppercase text-gray-400 text-left mt-3 mb-1">{T('sec2Title')}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2">
          {GOODS.map(g => (
            <div key={g.id} className="bg-white border border-neutral-200 rounded-xl p-2.5 flex flex-col justify-between hover:border-neutral-400 transition-colors">
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[length:calc(18px*var(--pi-scale))] md:text-[length:calc(20px*var(--pi-scale))] leading-none text-black">
                    {g.id === 'hanbok' ? <HanbokIcon /> : g.icon}
                  </span>
                  <span className="notranslate t-tag bg-neutral-100 text-neutral-600 rounded-full px-1.5 py-0.5">{g.grade}</span>
                </div>
                <p className="t-tag text-black mt-1.5">{L(g.t)}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span translate="no" className="notranslate t-tag text-[#dc2626]">{fmtPi(g.pi)} Pi</span>
                <span className="t-tag text-gray-300">FactFilter {g.grade}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <AccRow
            id="goods-request"
            open={goodsAcc.open === 'goods-request'}
            onToggle={() => goodsAcc.toggle('goods-request')}
            icon="✍️"
            title={T('requestLabel')}
          >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <select
              value={reqType}
              onChange={e => setReqType(e.target.value)}
              aria-label={T('requestLabel')}
              className="bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
            >
              {GOODS.map(g => (
                <option key={g.id} value={g.id}>{L(g.t)}</option>
              ))}
            </select>
            <select
              value={reqZone}
              onChange={e => setReqZone(e.target.value)}
              aria-label="Region"
              className="bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
            >
              {ZONES.map(z => (
                <option key={z.key} value={z.key} translate="no" className="notranslate">{z.code} · {L(z.sub)}</option>
              ))}
            </select>
          </div>
          <textarea
            value={reqNote}
            onChange={e => setReqNote(e.target.value)}
            placeholder={T('reqPlaceholder')}
            className="w-full mt-1.5 bg-neutral-50 border border-neutral-300 rounded-lg t-body text-black placeholder-neutral-400 outline-none transition-colors focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 p-2.5 h-16"
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2">
            <p className="text-gray-400 t-tag">{T('reqNote')}</p>
            <button
              onClick={submitRequest}
              className="shrink-0 bg-black hover:bg-[#dc2626] text-white t-btn px-4 py-2.5 rounded-lg transition-all active:scale-95"
            >
              {T('submitBtn')}{!authenticated && ' 🔒'}
            </button>
          </div>

          {requests.length > 0 && (
            <div className="mt-2 space-y-1">
              {requests.map(r => (
                <div key={r.id} className="flex items-start justify-between gap-2 bg-neutral-50 rounded-lg px-2.5 py-2 border-l-[3px] border-neutral-400">
                  <div className="min-w-0 text-left">
                    <p className="t-tag text-black truncate">{L(goodsOf(r.type).t)}</p>
                    <p className="t-tag text-gray-400 truncate">{r.note}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="notranslate t-tag text-gray-400" translate="no">{r.zone} #{r.id}</p>
                    <p className="t-tag text-[#dc2626]">{T('matchingHost')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          </AccRow>
        </div>

        {/* 06-3. 전국 세이프티 실드 */}
        <p className="t-tag uppercase text-gray-400 text-left mt-3 mb-1">{T('sec4Title')}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2">
          {[
            { num: '112', tel: '112', label: T('hotlinePolice'), sub: T('hotlinePoliceSub') },
            { num: '119', tel: '119', label: T('hotlineAmbulance'), sub: T('hotlineAmbulanceSub') },
            { num: '1330', tel: '1330', label: T('hotlineTour'), sub: T('hotlineTourSub') },
            { num: '120', tel: '02120', label: T('hotlineSeoul'), sub: T('hotlineSeoulSub') }
          ].map(h => (
            <a
              key={h.num}
              href={`tel:${h.tel}`}
              className="bg-black rounded-xl p-3 text-left transition-colors group hover:opacity-90"
            >
              <p translate="no" className="notranslate t-stat text-white group-hover:text-[#dc2626]">{h.num}</p>
              <p className="text-white/70 t-tag mt-1">{h.label}</p>
              <p className="text-white/40 t-tag mt-1">{h.sub}</p>
            </a>
          ))}
        </div>

        <div className="mt-2 space-y-1.5">
          {LINKS.map(l => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2.5 hover:border-neutral-400 transition-colors"
            >
              <div className="min-w-0 text-left">
                <p className="t-card text-black">{L(l.t)}</p>
                <p className="t-tag text-gray-400 mt-0.5">{L(l.d)}</p>
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                <span translate="no" className="notranslate t-tag bg-neutral-100 text-neutral-600 rounded-full px-1.5 py-0.5">{l.tag}</span>
                <span className="text-gray-300 t-sub">↗</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-2 bg-neutral-50 border-l-[3px] border-[#dc2626] rounded-lg px-3 py-2.5">
          <p className="t-tag text-gray-500 text-left">
            {T('safetyNote')}
          </p>
        </div>
        </section>

        {/* ── 07 전국 7대 권역 올인원 빌더 ──────────────────────── */}
        <SectionHead no="07" title={T('sec1Title')} desc={T('sec1Desc')} />

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ZONES.map(z => (
            <button
              key={z.key}
              translate="no"
              onClick={() => selectZone(z.key)}
              className={`notranslate shrink-0 px-3 py-2 rounded-xl text-left transition-all ${zone.key === z.key ? 'bg-black text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:text-black'}`}
            >
              <span className="block t-card">{z.code}</span>
              <span className={`block t-tag mt-1 ${zone.key === z.key ? 'text-white/60' : 'text-gray-300'}`}>{L(z.sub)}</span>
            </button>
          ))}
        </div>

        {/* 저장한 권역 — 로그인 시 서버 원장, 비로그인 시 이 브라우저(localStorage) */}
        {spots.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <span className="t-tag uppercase text-gray-400 mr-0.5">{T('savedSpots')}</span>
            {spots.map(key => {
              const z = ZONES.find(x => x.key === key);
              if (!z) return null;
              return (
                <button
                  key={key}
                  translate="no"
                  onClick={() => selectZone(key)}
                  className={`notranslate t-tag rounded-full px-2 py-0.5 border transition-colors ${key === zone.key ? 'bg-black text-white border-black' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'}`}
                >
                  {z.code}
                </button>
              );
            })}
          </div>
        )}

        {/* 권역 실속 팁 */}
        <div className="mt-2 bg-neutral-50 border border-neutral-200 rounded-2xl px-3 py-2.5 md:px-4">
          <p className="t-tag uppercase text-[#dc2626] mb-1.5">
            {T('tipsLabel')}
          </p>
          <ul className="space-y-1">
            {zone.tips.map((tip, i) => (
              <li key={i} className="flex gap-1.5 text-left">
                <span className="shrink-0 t-tag text-[#dc2626]">{i + 1}</span>
                <span className="t-body text-gray-600">{L(tip)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 bg-white border border-neutral-200 rounded-2xl p-3 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2.5">
            <div className="text-left">
              <p className="text-black t-card">{L(zone.venues)}</p>
              <p className="text-neutral-500 t-sub mt-1">{T('zoneOptionsDesc')}</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <button
                onClick={() => toggleSpot(zone.key)}
                aria-pressed={spots.includes(zone.key)}
                className={`t-tag rounded-full px-2 py-1 border transition-colors ${spots.includes(zone.key) ? 'bg-[#dc2626] text-white border-[#dc2626]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'}`}
              >
                🔖 {spots.includes(zone.key) ? T('savedSpot') : T('saveSpot')}
              </button>
              <span className="t-tag bg-neutral-100 px-2 py-1 rounded-full text-neutral-600">
                {T('kycBadge')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
            {PICK_ORDER.map(k => (
              <div key={k} className="bg-neutral-50 rounded-xl border border-neutral-200 p-2.5">
                <p className={`t-tag mb-1.5 ${k === 'stay' ? 'uppercase text-gray-400' : 'uppercase text-gray-400'}`}>
                  <span className="mr-1">{PICK_ICON[k]}</span>
                  {T(PICK_LABEL_KEY[k])}
                </p>
                <div className="space-y-1">
                  {zone.picks[k].map((o, i) => {
                    const on = pick[k] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setPick(p => ({ ...p, [k]: i }))}
                        className={`w-full text-left flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 border transition-all ${on ? 'bg-white border-[#dc2626] shadow-sm' : 'bg-white border-neutral-200 hover:border-neutral-400'}`}
                      >
                        <span className={`min-w-0 block t-body ${on ? 'text-black' : 'text-gray-500'}`}>
                          {L(o.t)}
                        </span>
                        <span translate="no" className={`notranslate shrink-0 t-body ${on ? 'text-[#dc2626]' : 'text-gray-400'}`}>
                          {fmtPi(o.pi)} <span className="t-tag">Pi</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-black rounded-xl px-3 py-3">
            <div className="text-left">
              <p className="text-white/50 t-tag">{T('totalLabel')}</p>
              <p className="text-white t-stat mt-1">
                <span translate="no" className="notranslate">{fmtPi(total)}</span>
                <span translate="no" className="notranslate text-[#dc2626] t-body ml-1">Pi</span>
                <span className="notranslate text-white/60 t-tag ml-2">+ 🐾 5</span>
              </p>
            </div>
            <button
              onClick={() => { if (!requireAuth(T('bookBtn'))) return; setInquiry(true); }}
              className="bg-[#dc2626] hover:bg-white hover:text-black text-white t-btn px-4 py-2.5 rounded-lg transition-all active:scale-95"
            >
              {T('bookBtn')}{!authenticated && ' 🔒'}
            </button>
          </div>
          <p className="text-neutral-500 t-sub mt-2">{T('bookNote')}</p>
        </div>

        {booked.length > 0 && (
          <div className="mt-2 space-y-1">
            {booked.map(b => (
              <div key={b.id} className="flex items-center justify-between gap-2 bg-neutral-50 border-l-[3px] border-[#dc2626] rounded-lg px-2.5 py-2">
                <p className="t-tag text-black truncate">
                  <span className="notranslate" translate="no">{b.zone}</span> · {T('reservedLabel')} · <span className="notranslate" translate="no">#{b.id}</span>
                </p>
                <p className="t-tag text-[#dc2626] shrink-0">
                  <span translate="no" className="notranslate">{fmtPi(b.total)} Pi</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── 08 한국 여행 실속 팩 ─────────────────────────────── */}
        <SectionHead no="08" title={T('sec3Title')} desc={T('sec3Desc')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { icon: '💳', title: T('util1Title'), body: T('util1Body') },
            { icon: '🔌', title: T('util2Title'), body: T('util2Body') },
            { icon: '🧾', title: T('util3Title'), body: T('util3Body') },
            { icon: '🚪', title: T('util4Title'), body: T('util4Body') }
          ].map((u, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-xl p-3">
              <p className="text-black t-card flex items-center gap-1.5">
                <span className="text-[length:calc(16px*var(--pi-scale))] leading-none">{u.icon}</span>
                {u.title}
              </p>
              <p className="text-neutral-600 t-body mt-1.5">{u.body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-300 t-tag mt-6 mb-2">
          <span translate="no" className="notranslate">Hangang</span> · <span translate="no" className="notranslate">hangang.pi</span> · {T('footerTag')}
        </p>
        <PrivacyLink className="mt-1 mb-2" />
      </main>

      {/* ── 예약·문의 모달 ───────────────────────────────────────── */}
      {inquiry && (
        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4" onClick={() => setInquiry(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl border border-neutral-200 p-4 md:p-5 space-y-3 text-left shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-black t-card">{T('modalTitle')}</h3>
                <p translate="no" className="notranslate text-neutral-500 t-sub mt-0.5">{zone.code} · {L(zone.venues)}</p>
              </div>
              <button onClick={() => setInquiry(false)} aria-label="close" className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 t-btn hover:bg-neutral-200">✕</button>
            </div>

            <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-xl p-3">
              <img src="/qr-personal.png" alt="Kedheon secure QR" className="w-20 h-20 object-contain bg-white rounded-lg border border-neutral-200" />
              <div className="min-w-0">
                <p className="t-card text-black">{T('modalQR')}</p>
                <p className="t-tag text-gray-500 mt-1">{T('modalQRDesc')}</p>
              </div>
            </div>

            <div className="space-y-1">
              {PICK_ORDER.map(k => (
                <div key={k} className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-1">
                  <p className="t-tag text-gray-500 min-w-0">
                    <span className="text-gray-300 mr-1">{PICK_ICON[k]}</span>
                    {L(zone.picks[k][pick[k]].t)}
                  </p>
                  <p translate="no" className="notranslate shrink-0 t-tag text-black">{fmtPi(zone.picks[k][pick[k]].pi)} Pi</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-black rounded-xl px-3 py-2.5">
              <p className="text-white/50 t-tag">{T('totalLabel')}</p>
              <p translate="no" className="notranslate text-white t-card">{fmtPi(total)} Pi <span className="text-[#dc2626] t-tag ml-1">+ 🐾 5</span></p>
            </div>

            <button onClick={confirmBooking} className="w-full bg-[#dc2626] hover:bg-black text-white t-btn py-3 rounded-xl transition-all active:scale-95">
              {T('modalConfirm')}{!authenticated && ' 🔒'}
            </button>
            <PiPayButton
              amount={total}
              memo={`Hangang pass · ${zone.code}`}
              label={lang === 'KR' ? `${fmtPi(total)} Pi로 결제` : `Pay ${fmtPi(total)} Pi`}
              doneLabel={lang === 'KR' ? '결제 완료' : 'Paid'}
              webHint={lang === 'KR' ? '파이 결제는 Pi Browser 앱 안에서만 진행됩니다.' : 'Pi payments open inside the Pi Browser app.'}
              cancelHint={lang === 'KR' ? '결제를 취소했습니다.' : 'Payment cancelled.'}
              failHint={lang === 'KR' ? '결제가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.' : 'Payment did not complete. Please try again.'}
            />
            <p className="text-gray-400 t-tag">{T('modalDemo')}</p>
          </div>
        </div>
      )}

      {/* ── 하단 고정 푸터 (6개 앱) ──────────────────────────── */}
      <AppDock active="HANGANG" soonMessage={T('alertSoon')} />
    </div>
  );
}
