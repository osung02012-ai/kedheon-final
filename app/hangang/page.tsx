'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PiBadge from '../components/PiBadge';
import {
  LANGS, LANG_TAG, detectLang, tr, ui,
  type Lang, type L10, type UIKey
} from './lib/i18n';
import { ZONES, PICK_ORDER, type PickKey } from './lib/zones';
import { GOODS, LINKS } from './lib/packs';

/* ------------------------------------------------------------------
 * Hangang — Korea-wide K-culture pass (Kedheon ecosystem)
 * 디자인 시스템: 케데헌과 동일 (White / Black / Red #DC2626)
 * 10개국어 · 전국 7개 권역 · 실속 가이드 · KYC 안전망
 * ------------------------------------------------------------------ */

const PICK_ICON: Record<PickKey, string> = {
  stay: '🏨', culture: '🎫', food: '🍗', transit: '🚌'
};

const PICK_LABEL_KEY: Record<PickKey, UIKey> = {
  stay: 'pickStay', culture: 'pickCulture', food: 'pickFood', transit: 'pickTransit'
};

function fmtPi(n: number) {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

function SectionHead({ no, title, desc }: { no: string; title: string; desc: string }) {
  return (
    <div className="mt-6 mb-2 text-left">
      <div className="flex items-center gap-2">
        <span className="text-[#dc2626] text-[11px] md:text-xs font-black italic leading-none">{no}</span>
        <h2 className="text-black text-base md:text-xl font-black italic uppercase tracking-tighter leading-none">{title}</h2>
      </div>
      <p className="text-gray-400 text-[11px] md:text-xs font-bold mt-1.5 leading-snug">{desc}</p>
    </div>
  );
}

export default function HangangPage() {
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

  const T = (k: UIKey) => ui(k, lang);
  const L = (v: L10) => tr(v, lang);

  useEffect(() => {
    setLang(detectLang());
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANG_TAG[lang] || 'en';
  }, [lang]);

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
    setBooked(prev => [{ zone: zone.code, total, id: `${zone.key}-${Date.now().toString().slice(-6)}` }, ...prev]);
    setBeom(v => v + 5);
    setInquiry(false);
  };

  const submitRequest = () => {
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
    <div className={`flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-24 font-black selection:bg-red-50 overflow-x-hidden ${lang === 'KR' ? 'break-keep' : ''}`}>

      {/* ── 상단 네비게이션 (케데헌 규격 · 10개국어) ─────────────── */}
      <nav className="w-full max-w-5xl flex justify-between items-center px-4 py-2 sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-black/10 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg border-2 border-black bg-black flex items-center justify-center shrink-0">
            <span className="text-white text-sm md:text-lg font-black italic leading-none" translate="no">H</span>
          </div>
          <div className="text-left leading-tight font-black min-w-0">
            <h1 className="notranslate text-black text-sm md:text-base italic uppercase leading-none truncate" translate="no">Hangang</h1>
            <span className="text-gray-400 text-[10px] md:text-[11px] font-mono tracking-widest uppercase">K-CULTURE PASS</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <PiBadge en={lang !== 'KR'} />
          <div className="relative">
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Lang)}
              aria-label="Language"
              className="appearance-none bg-gray-100 border border-gray-200 text-black text-[11px] md:text-xs font-black rounded-lg pl-2 pr-5 py-1 outline-none cursor-pointer shadow-sm focus:border-black transition-colors"
            >
              {LANGS.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-400">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-5xl px-4 py-3">

        {/* ── 1. 히어로 ─────────────────────────────────────────── */}
        <section className="relative bg-gray-50 rounded-2xl border border-black/5 shadow-inner overflow-hidden px-4 py-7 md:px-8 md:py-9">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#dc2626]/5" />

          <div className="relative grid grid-cols-1 md:grid-cols-[1.08fr_0.92fr] gap-5 md:gap-7 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <p translate="no" className="notranslate inline-block text-[10px] md:text-[11px] font-mono tracking-[0.25em] text-[#dc2626] uppercase mb-2">
                hangang.pi · K-Culture Pass
              </p>
              <h2 className="text-black text-xl md:text-4xl font-black tracking-tighter leading-tight">
                {T('heroTitle')}
              </h2>
              <p className="text-gray-500 text-[11px] md:text-sm font-bold mt-3 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                {T('heroDesc')}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-3">
                <span className="text-[9px] md:text-[10px] font-mono font-black tracking-[0.14em] uppercase bg-black text-white rounded-md px-2 py-1">
                  {T('heroTag1')}
                </span>
                <span className="text-[9px] md:text-[10px] font-mono font-black tracking-[0.14em] uppercase bg-white border border-black/10 text-gray-500 rounded-md px-2 py-1">
                  {T('heroTag2')}
                </span>
              </div>
            </div>

            {/* 대표 이미지 · 조선 민화 까치호랑이 + hangang.pi 명패 */}
            <figure className="order-1 md:order-2 mx-auto w-full max-w-[280px] md:max-w-[360px]">
              <img
                src="/hangang-hero.jpg"
                alt={T('imgAlt')}
                width={1024}
                height={1024}
                fetchPriority="high"
                className="w-full aspect-square object-cover rounded-2xl border-2 border-black shadow-xl"
              />
              <figcaption className="mt-2.5 text-center text-[9px] md:text-[10px] font-mono font-black tracking-[0.14em] uppercase text-gray-400">
                {T('imgCaption')}
              </figcaption>
            </figure>
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2 mt-5 max-w-3xl mx-auto">
            {[
              { v: '0%', label: T('statFee') },
              { v: '7', label: T('statZones') },
              { v: '24h', label: T('statHotline') },
              { v: `🐾 ${beom}`, label: T('statBeom') }
            ].map((s, i) => (
              <div key={i} className="bg-white border border-black/10 rounded-xl px-2 py-2.5">
                <p translate="no" className="notranslate text-black text-sm md:text-lg font-black leading-none">{s.v}</p>
                <p className="text-gray-400 text-[10px] md:text-[11px] font-bold mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. 전국 7대 권역 올인원 빌더 ──────────────────────── */}
        <SectionHead no="01" title={T('sec1Title')} desc={T('sec1Desc')} />

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ZONES.map(z => (
            <button
              key={z.key}
              translate="no"
              onClick={() => selectZone(z.key)}
              className={`notranslate shrink-0 px-3 py-2 rounded-xl border text-left transition-all ${zone.key === z.key ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-400 border-black/10 hover:text-black'}`}
            >
              <span className="block text-[11px] md:text-sm font-black italic leading-none">{z.code}</span>
              <span className={`block text-[9px] md:text-[10px] font-bold mt-1 leading-tight ${zone.key === z.key ? 'text-white/60' : 'text-gray-300'}`}>{L(z.sub)}</span>
            </button>
          ))}
        </div>

        {/* 권역 실속 팁 */}
        <div className="mt-2 bg-gray-50 border border-black/10 rounded-2xl px-3 py-2.5 md:px-4">
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#dc2626] mb-1.5">
            {T('tipsLabel')}
          </p>
          <ul className="space-y-1">
            {zone.tips.map((tip, i) => (
              <li key={i} className="flex gap-1.5 text-left">
                <span className="shrink-0 text-[10px] md:text-[11px] font-black text-[#dc2626] leading-snug">{i + 1}</span>
                <span className="text-[10px] md:text-[11px] font-bold text-gray-600 leading-snug">{L(tip)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 bg-white border-2 border-black/10 rounded-2xl p-3 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
            <div className="text-left">
              <p className="text-black text-xs md:text-sm font-black">{L(zone.venues)}</p>
              <p className="text-gray-400 text-[10px] md:text-[11px] font-bold mt-0.5">{T('zoneOptionsDesc')}</p>
            </div>
            <span className="text-[10px] md:text-[11px] font-black bg-gray-100 px-2 py-1 rounded-full text-gray-500">
              {T('kycBadge')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
            {PICK_ORDER.map(k => (
              <div key={k} className="bg-gray-50 rounded-xl border border-black/5 p-2.5">
                <p className={`text-[10px] md:text-[11px] font-black tracking-widest mb-1.5 ${k === 'stay' ? 'uppercase text-gray-400' : 'uppercase text-gray-400'}`}>
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
                        className={`w-full text-left flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 border transition-all ${on ? 'bg-white border-[#dc2626] shadow-sm' : 'bg-white/60 border-black/5 hover:border-black/20'}`}
                      >
                        <span className={`min-w-0 block text-[11px] md:text-xs font-black leading-snug ${on ? 'text-black' : 'text-gray-500'}`}>
                          {L(o.t)}
                        </span>
                        <span translate="no" className={`notranslate shrink-0 text-[11px] md:text-xs font-black ${on ? 'text-[#dc2626]' : 'text-gray-400'}`}>
                          {fmtPi(o.pi)} <span className="text-[9px]">Pi</span>
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
              <p className="text-white/50 text-[10px] md:text-[11px] font-bold leading-none">{T('totalLabel')}</p>
              <p className="text-white text-lg md:text-2xl font-black leading-none mt-1">
                <span translate="no" className="notranslate">{fmtPi(total)}</span>
                <span translate="no" className="notranslate text-[#dc2626] text-xs md:text-sm ml-1">Pi</span>
                <span className="notranslate text-white/60 text-[10px] md:text-xs ml-2">+ 🐾 5</span>
              </p>
            </div>
            <button
              onClick={() => setInquiry(true)}
              className="bg-[#dc2626] hover:bg-white hover:text-black text-white text-xs md:text-sm font-black px-4 py-2.5 rounded-lg transition-all active:scale-95"
            >
              {T('bookBtn')}
            </button>
          </div>
          <p className="text-gray-400 text-[10px] md:text-[11px] font-bold mt-2 leading-snug">{T('bookNote')}</p>
        </div>

        {booked.length > 0 && (
          <div className="mt-2 space-y-1">
            {booked.map(b => (
              <div key={b.id} className="flex items-center justify-between gap-2 bg-gray-50 border-l-[4px] border-[#dc2626] rounded-lg px-2.5 py-2">
                <p className="text-[10px] md:text-[11px] font-black text-black truncate">
                  <span className="notranslate" translate="no">{b.zone}</span> · {T('reservedLabel')} · <span className="notranslate" translate="no">#{b.id}</span>
                </p>
                <p className="text-[10px] md:text-[11px] font-black text-[#dc2626] shrink-0">
                  <span translate="no" className="notranslate">{fmtPi(b.total)} Pi</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── 3. K-굿즈 · 한복 · 짐보관 대행 보드 ───────────────── */}
        <SectionHead no="02" title={T('sec2Title')} desc={T('sec2Desc')} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2">
          {GOODS.map(g => (
            <div key={g.id} className="bg-white border border-black/10 rounded-xl p-2.5 flex flex-col justify-between hover:border-[#dc2626] transition-colors">
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-lg md:text-xl leading-none">{g.icon}</span>
                  <span className="notranslate text-[9px] font-black bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">{g.grade}</span>
                </div>
                <p className="text-[10px] md:text-[11px] font-black text-black leading-snug mt-1.5">{L(g.t)}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span translate="no" className="notranslate text-[11px] md:text-xs font-black text-[#dc2626]">{fmtPi(g.pi)} Pi</span>
                <span className="text-[9px] font-bold text-gray-300">FactFilter {g.grade}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 bg-white border-2 border-black/10 rounded-2xl p-3 md:p-4">
          <p className="text-[11px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
            {T('requestLabel')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <select
              value={reqType}
              onChange={e => setReqType(e.target.value)}
              aria-label={T('requestLabel')}
              className="bg-gray-50 border border-black/5 rounded-lg px-2.5 py-2 text-[11px] md:text-xs font-black outline-none focus:border-black"
            >
              {GOODS.map(g => (
                <option key={g.id} value={g.id}>{L(g.t)}</option>
              ))}
            </select>
            <select
              value={reqZone}
              onChange={e => setReqZone(e.target.value)}
              aria-label="Region"
              className="bg-gray-50 border border-black/5 rounded-lg px-2.5 py-2 text-[11px] md:text-xs font-black outline-none focus:border-black"
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
            className="w-full mt-1.5 bg-gray-50 border border-black/5 rounded-lg p-2.5 text-[11px] md:text-xs font-bold h-16 outline-none focus:border-black leading-relaxed"
          />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2">
            <p className="text-gray-400 text-[10px] md:text-[11px] font-bold leading-snug">{T('reqNote')}</p>
            <button
              onClick={submitRequest}
              className="shrink-0 bg-black hover:bg-[#dc2626] text-white text-xs md:text-sm font-black px-4 py-2.5 rounded-lg transition-all active:scale-95"
            >
              {T('submitBtn')}
            </button>
          </div>

          {requests.length > 0 && (
            <div className="mt-2 space-y-1">
              {requests.map(r => (
                <div key={r.id} className="flex items-start justify-between gap-2 bg-gray-50 rounded-lg px-2.5 py-2 border-l-[4px] border-black">
                  <div className="min-w-0 text-left">
                    <p className="text-[10px] md:text-[11px] font-black text-black truncate">{L(goodsOf(r.type).t)}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate">{r.note}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="notranslate text-[9px] font-black text-gray-400" translate="no">{r.zone} #{r.id}</p>
                    <p className="text-[9px] font-black text-[#dc2626]">{T('matchingHost')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 4. 한국 여행 실속 팩 ─────────────────────────────── */}
        <SectionHead no="03" title={T('sec3Title')} desc={T('sec3Desc')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { icon: '💳', title: T('util1Title'), body: T('util1Body') },
            { icon: '🔌', title: T('util2Title'), body: T('util2Body') },
            { icon: '🧾', title: T('util3Title'), body: T('util3Body') },
            { icon: '🚪', title: T('util4Title'), body: T('util4Body') }
          ].map((u, i) => (
            <div key={i} className="bg-white border border-black/10 rounded-xl p-3">
              <p className="text-black text-[11px] md:text-xs font-black flex items-center gap-1.5">
                <span className="text-base leading-none">{u.icon}</span>
                {u.title}
              </p>
              <p className="text-gray-500 text-[10px] md:text-[11px] font-bold leading-relaxed mt-1.5">{u.body}</p>
            </div>
          ))}
        </div>

        {/* ── 5. 전국 세이프티 실드 ─────────────────────────────── */}
        <SectionHead no="04" title={T('sec4Title')} desc={T('sec4Desc')} />

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
              className="bg-black rounded-xl p-3 text-left border-2 border-black hover:border-[#dc2626] transition-colors group"
            >
              <p translate="no" className="notranslate text-white text-xl md:text-2xl font-black leading-none group-hover:text-[#dc2626]">{h.num}</p>
              <p className="text-white/70 text-[10px] md:text-[11px] font-black mt-1 leading-tight">{h.label}</p>
              <p className="text-white/40 text-[9px] font-bold mt-1 leading-tight">{h.sub}</p>
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
              className="flex items-start justify-between gap-2 bg-white border border-black/10 rounded-xl px-3 py-2.5 hover:border-black transition-colors"
            >
              <div className="min-w-0 text-left">
                <p className="text-[11px] md:text-xs font-black text-black leading-snug">{L(l.t)}</p>
                <p className="text-[10px] md:text-[11px] font-bold text-gray-400 leading-snug mt-0.5">{L(l.d)}</p>
              </div>
              <div className="shrink-0 flex items-center gap-1.5">
                <span translate="no" className="notranslate text-[9px] font-black bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">{l.tag}</span>
                <span className="text-gray-300 text-sm">↗</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-2 bg-gray-50 border-l-[4px] border-[#dc2626] rounded-lg px-3 py-2.5">
          <p className="text-[10px] md:text-[11px] font-bold text-gray-500 leading-relaxed text-left">
            {T('safetyNote')}
          </p>
        </div>

        <p className="text-center text-gray-300 text-[10px] font-bold mt-6 mb-2">
          <span translate="no" className="notranslate">Hangang</span> · <span translate="no" className="notranslate">hangang.pi</span> · {T('footerTag')}
        </p>
      </main>

      {/* ── 예약·문의 모달 ───────────────────────────────────────── */}
      {inquiry && (
        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4" onClick={() => setInquiry(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl border-2 border-black p-4 md:p-5 space-y-3 text-left shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-black text-sm md:text-base font-black">{T('modalTitle')}</h3>
                <p translate="no" className="notranslate text-gray-400 text-[11px] font-bold mt-0.5">{zone.code} · {L(zone.venues)}</p>
              </div>
              <button onClick={() => setInquiry(false)} aria-label="close" className="shrink-0 w-8 h-8 rounded-full border border-black/10 text-black text-sm font-black hover:bg-gray-100">✕</button>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 border border-black/10 rounded-xl p-3">
              <img src="/qr-personal.png" alt="Kedheon secure QR" className="w-20 h-20 object-contain bg-white rounded-lg border border-black/10" />
              <div className="min-w-0">
                <p className="text-[11px] md:text-xs font-black text-black">{T('modalQR')}</p>
                <p className="text-[10px] md:text-[11px] font-bold text-gray-500 leading-snug mt-1">{T('modalQRDesc')}</p>
              </div>
            </div>

            <div className="space-y-1">
              {PICK_ORDER.map(k => (
                <div key={k} className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1">
                  <p className="text-[10px] md:text-[11px] font-bold text-gray-500 min-w-0">
                    <span className="text-gray-300 mr-1">{PICK_ICON[k]}</span>
                    {L(zone.picks[k][pick[k]].t)}
                  </p>
                  <p translate="no" className="notranslate shrink-0 text-[10px] md:text-[11px] font-black text-black">{fmtPi(zone.picks[k][pick[k]].pi)} Pi</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-black rounded-xl px-3 py-2.5">
              <p className="text-white/50 text-[10px] font-bold">{T('totalLabel')}</p>
              <p translate="no" className="notranslate text-white text-base font-black">{fmtPi(total)} Pi <span className="text-[#dc2626] text-[10px] ml-1">+ 🐾 5</span></p>
            </div>

            <button onClick={confirmBooking} className="w-full bg-[#dc2626] hover:bg-black text-white text-xs md:text-sm font-black py-3 rounded-xl transition-all active:scale-95">
              {T('modalConfirm')}
            </button>
            <p className="text-gray-400 text-[10px] font-bold leading-snug">{T('modalDemo')}</p>
          </div>
        </div>
      )}

      {/* ── 하단 고정 푸터 (6개 앱) ──────────────────────────── */}
      <footer className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto bg-white border-2 border-black px-1 py-1.5 rounded-2xl flex justify-between gap-0.5 md:gap-1.5 z-[1000] shadow-2xl font-black">
        {[
          { name: 'KEDHEON', path: '/' },
          { name: 'CIVIL', path: '/civil' },
          { name: 'FACTFILTER', path: '/factfilter' },
          { name: 'HANGANG', path: '/hangang' },
          { name: 'NEXUS', path: '#' },
          { name: 'VENDOR', path: '#' }
        ].map(app => (
          <button
            key={app.name}
            translate="no"
            onClick={() => {
              if (app.path === '#') {
                alert(app.name + T('alertSoon'));
              } else {
                window.location.href = app.path;
              }
            }}
            className={`notranslate flex-1 min-w-0 px-0.5 py-3.5 md:py-4.5 rounded-xl transition-all font-black text-center leading-none whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
              app.name === 'HANGANG' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'
            }`}
            style={{ fontSize: 'clamp(7px, 2.05vw, 14px)' }}
          >
            {app.name}
          </button>
        ))}
      </footer>
    </div>
  );
}
