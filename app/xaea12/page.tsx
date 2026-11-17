'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PiBadge from '../components/PiBadge';
import { usePi } from '../components/PiProvider';
import PiReadOnlyBanner from '../components/PiReadOnlyBanner';
import AppDock from '../components/AppDock';
import AppHeader from '../components/AppHeader';
import LangSelect from '../components/LangSelect';
import {
  LANGS, LANG_TAG, detectLang, tr, ui,
  type Lang, type L10, type UIKey
} from './lib/i18n';
import {
  CATS, CAT_ICON, SAMPLE_STORIES, HALL_SEED,
  CELEB_BLOCKLIST, FIAT_PATTERNS,
  type CatKey, type HallTab, type Story
} from './lib/stories';

/* ------------------------------------------------------------------
 * XAEA12 — Short by N Pi · 생태계 위시 & 선물하기 놀이터
 * 디자인 시스템: 케데헌과 동일 (White / Black / Red #DC2626)
 * 10개국어 · 2단계 시나리오(Testnet 리허설 → Mainnet) · 안전장치 3종
 * ------------------------------------------------------------------ */

const STORE_KEY = 'xaea12.playground.v1';

interface SavedState {
  board: Story[];
  beom: number;
  notify: boolean;
  chips: number;
  fulls: number;
  totalPi: number;
}

const EMPTY_STATE: SavedState = {
  board: SAMPLE_STORIES,
  beom: 0,
  notify: false,
  chips: 0,
  fulls: 0,
  totalPi: 0
};

function fmtPi(n: number) {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

function SectionHead({ no, title, desc }: { no: string; title: string; desc: string }) {
  return (
    <div className="mt-4 mb-1.5 text-left border-t-2 border-[#dc2626] pt-2.5">
      <div className="flex items-baseline gap-2">
        <span className="t-tag text-[#dc2626] shrink-0">{no}</span>
        <h2 className="t-section text-neutral-900 uppercase border-l-[5px] border-black pl-2.5">{title}</h2>
      </div>
      <p className="t-sub text-neutral-500 mt-1 pl-[calc(5px+0.625rem)]">{desc}</p>
    </div>
  );
}

export default function Xaea12Page() {
  const { requireAuth, authenticated, setGateLang, pay, paying, username } = usePi();
  const [lang, setLang] = useState<Lang>('KR');
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<SavedState>(EMPTY_STATE);
  const [cat, setCat] = useState<CatKey | 'ALL'>('ALL');
  const [hallTab, setHallTab] = useState<HallTab>('today');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 사연 등록 폼
  const [formOpen, setFormOpen] = useState(false);
  const [fCat, setFCat] = useState<CatKey>('home');
  const [fUser, setFUser] = useState('');
  const [fGoal, setFGoal] = useState('');
  const [fStory, setFStory] = useState('');
  const [fSafe, setFSafe] = useState(false);

  const T = (k: UIKey) => ui(k, lang);
  const L = (v: L10) => tr(v, lang);

  useEffect(() => {
    setLang(detectLang());
    setMounted(true);
  }, []);

  // 저장된 놀이터 상태 복원 (이 브라우저에만)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<SavedState>;
      const board = Array.isArray(parsed.board) && parsed.board.length ? parsed.board : SAMPLE_STORIES;
      setState({
        board,
        beom: typeof parsed.beom === 'number' ? parsed.beom : 0,
        notify: !!parsed.notify,
        chips: typeof parsed.chips === 'number' ? parsed.chips : 0,
        fulls: typeof parsed.fulls === 'number' ? parsed.fulls : 0,
        totalPi: typeof parsed.totalPi === 'number' ? parsed.totalPi : 0
      });
    } catch {
      // 손상된 값은 무시하고 샘플 보드로 시작한다.
    }
  }, []);

  const persist = useCallback((next: SavedState) => {
    setState(next);
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      // 저장 실패(사생활 보호 모드 등)해도 이번 화면은 그대로 동작한다.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANG_TAG[lang] || 'en';
  }, [lang]);

  // 실행 권한 안내 패널도 같은 언어로
  useEffect(() => {
    setGateLang(lang);
  }, [lang, setGateLang]);

  const flash = useCallback((text: string) => {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5200);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const board = state.board;
  const visible = useMemo(
    () => (cat === 'ALL' ? board : board.filter(s => s.cat === cat)),
    [board, cat]
  );

  const pct = (s: Story) => Math.min(100, Math.round((s.raised / Math.max(1, s.goal)) * 100));
  const closed = (s: Story) => s.raised >= s.goal;

  /** 보태기 · 원탭 완납. Pi Browser에서는 실제 Pi 결제, 일반 웹에서는 Test-Pi 리허설 기록. */
  const contribute = async (s: Story, mode: 'chip' | 'full') => {
    if (closed(s) || paying) return;
    if (!requireAuth(mode === 'chip' ? T('chipBtn') : T('rescueBtn'))) return;

    const need = s.goal - s.raised;
    const amount = mode === 'chip' ? Math.min(1, need) : need;
    const result = await pay(amount, `XAEA12 · @${s.user} · ${fmtPi(amount)} Pi`, {
      app: 'XAEA12',
      story: s.id,
      mode
    });

    const testMode = result.status === 'unavailable' && result.mode === 'web';
    if (!result.ok && !testMode) {
      flash(result.status === 'cancelled' ? T('toastCancel') : T('toastFail'));
      return;
    }

    const nextBoard = board.map(item => {
      if (item.id !== s.id) return item;
      const raised = Math.min(item.goal, item.raised + amount);
      return { ...item, raised, backers: item.backers + 1 };
    });
    const nowClosed = nextBoard.find(item => item.id === s.id)?.goal ===
      nextBoard.find(item => item.id === s.id)?.raised;

    persist({
      ...state,
      board: nextBoard,
      beom: state.beom + (mode === 'chip' ? 1 : 3),
      chips: state.chips + (mode === 'chip' ? 1 : 0),
      fulls: state.fulls + (mode === 'full' ? 1 : 0),
      totalPi: Math.round((state.totalPi + amount) * 100) / 100
    });

    flash(result.ok ? T('toastPaid') : T('toastTest'));
    if (nowClosed) setTimeout(() => flash(T('toastClosed')), 1400);
  };

  const reserveNotify = () => {
    if (state.notify) return;
    if (!requireAuth(T('notifyBtn'))) return;
    persist({ ...state, beom: state.beom + 1, notify: true });
  };

  const submitStory = () => {
    if (!requireAuth(T('formSubmit'))) return;

    const handle = fUser.trim().replace(/^@+/, '');
    if (!/^[A-Za-z0-9_]{3,20}$/.test(handle)) return flash(T('formAlertUser'));

    const goal = Number(fGoal);
    if (!Number.isInteger(goal) || goal < 1 || goal > 500) return flash(T('formAlertGoal'));

    const text = fStory.trim().replace(/\s+/g, ' ');
    if (text.length < 5 || text.length > 90) return flash(T('formAlertStory'));
    if (!fSafe) return flash(T('formAlertSafe'));

    const lower = text.toLowerCase();
    if (
      /\+?\d[\d\s-]{6,}/.test(text) ||
      /[\w.+-]+@[\w-]+\.[\w.]{2,}/.test(text) ||
      /(카톡|카카오톡|텔레그램|telegram|kakao|whatsapp|왓츠앱|오픈채팅)/i.test(text)
    ) {
      return flash(T('formAlertPII'));
    }
    if (CELEB_BLOCKLIST.some(word => lower.includes(word))) return flash(T('formAlertCeleb'));
    if (FIAT_PATTERNS.some(re => re.test(text))) return flash(T('formAlertFiat'));

    const filled = Array(10).fill(text) as unknown as L10;
    const story: Story = {
      id: `local-${Date.now()}`,
      cat: fCat,
      src: 'Kedheon',
      user: handle,
      goal,
      raised: 0,
      backers: 0,
      title: filled,
      local: true
    };

    persist({ ...state, board: [story, ...board], beom: state.beom + 2 });
    setFormOpen(false);
    setFStory('');
    setFGoal('');
    setFSafe(false);
    setCat('ALL');
    flash(T('formSuccess'));
  };

  const hallRows = useMemo(() => {
    const base = HALL_SEED[hallTab].map(row => ({ ...row, mine: false }));
    const mine =
      hallTab === 'today' ? state.chips + state.fulls
        : hallTab === 'total' ? state.totalPi
          : state.beom;
    if (authenticated && username) base.push({ user: username, value: mine, mine: true });
    return base.sort((a, b) => b.value - a.value).slice(0, 6);
  }, [hallTab, state.chips, state.fulls, state.totalPi, state.beom, authenticated, username]);

  const hallUnit = hallTab === 'today' ? T('unitCount') : hallTab === 'total' ? 'Pi' : '🐾';

  if (!mounted) return <div className="bg-white min-h-screen" />;

  const stageCard = 'text-left rounded-2xl border p-3 md:p-4';

  return (
    <div className={`flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-24 selection:bg-red-50 overflow-x-hidden ${lang === 'KR' ? 'break-keep' : ''}`}>

      {/* ── 상단 네비게이션 (케데헌 규격 · 10개국어) ─────────────── */}
      <AppHeader
        brand={
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg border border-black bg-black flex items-center justify-center shrink-0">
              <span className="text-white t-card" translate="no">X</span>
            </div>
            <div className="text-left leading-tight font-bold min-w-0">
              <h1 className="notranslate t-brand text-black italic uppercase truncate" translate="no">XAEA12</h1>
              <span className="block text-gray-400 t-tag font-mono uppercase whitespace-nowrap">SHORT BY N PI</span>
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
        {/* 모바일: 상단 중앙 240px 대표이미지 카드 / 데스크톱: 오른쪽 큰 그림 + 캡션.
            케데헌·한강과 같은 압축 규격(히어로 + 01 머리까지 첫 화면에). */}
        <section className="relative bg-white rounded-2xl border-2 border-black overflow-hidden px-3 py-3 md:px-8 md:py-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#dc2626]/5" />

          <div className="relative md:grid md:grid-cols-[1.08fr_0.92fr] md:gap-7 md:items-center">
            <figure className="relative mx-auto w-full max-w-[240px] sm:max-w-[260px] md:order-2 md:max-w-[360px] md:shrink-0">
              <img
                src="/xaea12-hero.jpg"
                alt={T('imgAlt')}
                width={1024}
                height={1024}
                fetchPriority="high"
                className="w-full aspect-square object-cover rounded-2xl border border-neutral-200 shadow-lg"
              />
              <figcaption className="hidden md:block mt-2.5 text-center t-tag font-mono uppercase text-gray-400">
                {T('imgCaption')}
              </figcaption>
            </figure>

            <div className="min-w-0 text-left md:order-1 mt-2.5 md:mt-0">
              <p translate="no" className="notranslate hidden md:inline-block t-tag font-mono text-[#dc2626] uppercase whitespace-nowrap">
                xaea12.pi · Short by N Pi
              </p>
              <h2 className="t-hero text-black mt-0.5">
                {T('heroTitle')}
              </h2>
              <p className="text-gray-500 t-sub mt-1.5 max-w-2xl">
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
              { v: 'Test-Pi', label: T('statStage'), short: T('statStageS') },
              { v: `🐾 ${state.beom}`, label: T('statBeom'), short: T('statBeomS') },
              { v: '100%', label: T('statAuto'), short: T('statAutoS') }
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

        {/* ── 2. 2단계 시나리오 ────────────────────────────────── */}
        <SectionHead no="01" title={T('secStageTitle')} desc={T('secStageDesc')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* 1단계 · 지금 */}
          <div className={`${stageCard} bg-white border-2 border-black`}>
            <div className="flex items-center justify-between gap-2">
              <span className="t-tag uppercase text-[#dc2626]">{T('stage1Label')}</span>
              <span className="notranslate t-tag bg-black text-white rounded-full px-2 py-0.5" translate="no">TEST-PI</span>
            </div>
            <p className="text-black t-card mt-1.5">{T('stage1Title')}</p>
            <p className="text-neutral-600 t-body mt-1.5">{T('stage1Desc')}</p>
            <ul className="mt-2 space-y-1">
              {[T('stage1b1'), T('stage1b2'), T('stage1b3')].map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="shrink-0 t-tag text-[#dc2626]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t-body text-gray-600">{line}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={reserveNotify}
              className={`w-full mt-2.5 rounded-lg t-btn px-3 py-2.5 transition-all active:scale-95 ${
                state.notify ? 'bg-neutral-100 text-neutral-500' : 'bg-[#dc2626] hover:bg-black text-white'
              }`}
            >
              {state.notify ? T('notifyDone') : `${T('notifyBtn')}${!authenticated ? ' 🔒' : ''}`}
            </button>
            <p className="text-neutral-500 t-sub mt-2">{T('stage1Note')}</p>
          </div>

          {/* 2단계 · Mainnet */}
          <div className={`${stageCard} bg-neutral-50 border-neutral-300 border-dashed`}>
            <div className="flex items-center justify-between gap-2">
              <span className="t-tag uppercase text-gray-500">{T('stage2Label')}</span>
              <span className="notranslate t-tag bg-white border border-neutral-300 text-neutral-500 rounded-full px-2 py-0.5" translate="no">MAINNET</span>
            </div>
            <p className="text-black t-card mt-1.5">{T('stage2Title')}</p>
            <p className="text-neutral-600 t-body mt-1.5">{T('stage2Desc')}</p>
            <ul className="mt-2 space-y-1">
              {[T('stage2b1'), T('stage2b2'), T('stage2b3')].map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="shrink-0 t-tag text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t-body text-gray-600">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── 3. 코어팀 3대 안전장치 ───────────────────────────── */}
        <SectionHead no="02" title={T('secSafetyTitle')} desc={T('secSafetyDesc')} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2">
          {[
            { no: '00', title: T('safe1Title'), body: T('safe1Body') },
            { no: '01', title: T('safe2Title'), body: T('safe2Body') },
            { no: '02', title: T('safe3Title'), body: T('safe3Body') }
          ].map((s, i) => (
            <div key={i} className="bg-white border border-neutral-200 border-l-[3px] border-l-[#dc2626] rounded-xl p-3">
              <p className="t-tag text-[#dc2626] notranslate" translate="no">{s.no}</p>
              <p className="text-black t-card mt-0.5">{s.title}</p>
              <p className="text-neutral-600 t-body mt-1.5">{s.body}</p>
            </div>
          ))}
        </div>

        {/* ── 4. 사연 보드 ─────────────────────────────────────── */}
        <SectionHead no="03" title={T('secBoardTitle')} desc={T('secBoardDesc')} />

        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { key: 'ALL' as const, icon: '✦', label: T('filterAll') },
            ...CATS.map(c => ({ key: c.key, icon: c.icon, label: T(c.labelKey) }))
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setCat(tab.key)}
              className={`shrink-0 px-3 py-2 rounded-xl text-left transition-all ${
                cat === tab.key ? 'bg-black text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:text-black'
              }`}
            >
              <span className="block t-card whitespace-nowrap">
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* 사연 올리기 */}
        <div className="mt-2">
          {!formOpen ? (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="w-full bg-white border border-black text-black t-btn px-4 py-2.5 rounded-lg transition-all hover:bg-black hover:text-white active:scale-95"
            >
              + {T('formOpen')}{!authenticated && ' 🔒'}
            </button>
          ) : (
            <div className="bg-white border-2 border-black rounded-2xl p-3 md:p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 text-left">
                  <p className="text-black t-card">{T('formTitle')}</p>
                  <p className="text-neutral-500 t-sub mt-0.5">{T('formDesc')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  aria-label={T('formCancel')}
                  className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 t-btn hover:bg-neutral-200"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-2.5">
                <label className="text-left">
                  <span className="block t-tag uppercase text-gray-400 mb-1">{T('formCat')}</span>
                  <select
                    value={fCat}
                    onChange={e => setFCat(e.target.value as CatKey)}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
                  >
                    {CATS.map(c => (
                      <option key={c.key} value={c.key}>{c.icon} {T(c.labelKey)}</option>
                    ))}
                  </select>
                </label>
                <label className="text-left">
                  <span className="block t-tag uppercase text-gray-400 mb-1">{T('formGoal')}</span>
                  <input
                    value={fGoal}
                    onChange={e => setFGoal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
                    inputMode="numeric"
                    placeholder="20"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                </label>
                <label className="text-left md:col-span-2">
                  <span className="block t-tag uppercase text-gray-400 mb-1">{T('formUser')}</span>
                  <input
                    value={fUser}
                    onChange={e => setFUser(e.target.value.slice(0, 21))}
                    placeholder="@pioneer0001"
                    autoCapitalize="none"
                    autoCorrect="off"
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                </label>
              </div>

              <label className="block text-left mt-1.5">
                <span className="block t-tag uppercase text-gray-400 mb-1">
                  {T('formStory')} · {fStory.trim().length}/90
                </span>
                <textarea
                  value={fStory}
                  onChange={e => setFStory(e.target.value.slice(0, 90))}
                  placeholder={T('formStoryPh')}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg t-body text-black placeholder-neutral-400 outline-none transition-colors focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 p-2.5 h-16"
                />
              </label>

              <label className="flex items-start gap-1.5 mt-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fSafe}
                  onChange={e => setFSafe(e.target.checked)}
                  className="mt-0.5 shrink-0 w-3.5 h-3.5 accent-[#dc2626]"
                />
                <span className="t-tag text-gray-600 text-left">{T('formSafe')}</span>
              </label>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2.5">
                <p className="text-gray-400 t-tag text-left">{T('formPIIhelp')}</p>
                <button
                  type="button"
                  onClick={submitStory}
                  className="shrink-0 bg-black hover:bg-[#dc2626] text-white t-btn px-4 py-2.5 rounded-lg transition-all active:scale-95"
                >
                  {T('formSubmit')}{!authenticated && ' 🔒'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 사연 카드 */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {visible.length === 0 && (
            <p className="t-sub text-gray-400 text-left bg-neutral-50 border border-dashed border-neutral-300 rounded-xl px-3 py-6 md:col-span-2">
              {T('emptyBoard')}
            </p>
          )}
          {visible.map(s => {
            const done = closed(s);
            const left = Math.max(0, s.goal - s.raised);
            return (
              <article
                key={s.id}
                className={`text-left bg-white rounded-2xl border p-3 ${done ? 'border-black' : 'border-neutral-200'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p translate="no" className="notranslate t-tag text-gray-400 truncate">@{s.user}</p>
                    <p className="text-black t-card mt-0.5">{L(s.title)}</p>
                  </div>
                  <span className="shrink-0 t-tag bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5 whitespace-nowrap">
                    {CAT_ICON[s.cat]} {T(CATS.find(c => c.key === s.cat)?.labelKey ?? 'filterAll')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  <span translate="no" className="notranslate t-tag font-mono bg-black text-white rounded px-1.5 py-0.5">{s.src}</span>
                  {s.local && (
                    <span className="t-tag bg-red-50 text-[#dc2626] border border-[#dc2626]/30 rounded px-1.5 py-0.5">{T('localBadge')}</span>
                  )}
                  {done && (
                    <span className="t-tag bg-black text-white rounded px-1.5 py-0.5">✓ {T('closedBadge')}</span>
                  )}
                </div>

                {/* 진행률 */}
                <div className="mt-2 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${done ? 'bg-black' : 'bg-[#dc2626]'}`}
                    style={{ width: `${pct(s)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p translate="no" className="notranslate t-tag text-gray-500">
                    <span className={`font-black ${done ? 'text-black' : 'text-[#dc2626]'}`}>{fmtPi(s.raised)}</span>
                    {' / '}{fmtPi(s.goal)} Pi
                    <span className="text-gray-300"> · {s.backers} {T('backersUnit')}</span>
                  </p>
                  <p translate="no" className="notranslate t-tag font-black text-black">{pct(s)}%</p>
                </div>

                {!done ? (
                  <>
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => contribute(s, 'chip')}
                        disabled={paying}
                        className="bg-white border border-black text-black t-btn px-2 py-2 rounded-lg transition-all hover:bg-black hover:text-white active:scale-95 disabled:opacity-50"
                      >
                        {T('chipBtn')}{!authenticated && ' 🔒'}
                      </button>
                      <button
                        type="button"
                        onClick={() => contribute(s, 'full')}
                        disabled={paying}
                        className="bg-black text-white t-btn px-2 py-2 rounded-lg transition-all hover:bg-[#dc2626] active:scale-95 disabled:opacity-50"
                      >
                        {T('rescueBtn')} {fmtPi(left)} Pi{!authenticated && ' 🔒'}
                      </button>
                    </div>
                    <p className="text-gray-400 t-tag mt-1.5 text-right">
                      {T('leftLabel')} <span translate="no" className="notranslate">{fmtPi(left)} Pi</span>
                    </p>
                  </>
                ) : (
                  <p className="text-neutral-500 t-tag mt-2 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-2">
                    {T('closedBadge')} · {T('goalLabel')} <span translate="no" className="notranslate">{fmtPi(s.goal)} Pi</span>
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-2 bg-neutral-50 border-l-[3px] border-[#dc2626] rounded-lg px-3 py-2.5">
          <p className="t-tag text-gray-500 text-left">{T('boardFoot')}</p>
        </div>

        {/* ── 5. 놀이터 명예의 전당 ─────────────────────────────── */}
        <SectionHead no="04" title={T('hallTitle')} desc={T('hallDesc')} />

        <div className="bg-white border border-neutral-200 rounded-2xl p-3 md:p-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {([
              { key: 'today' as HallTab, label: T('hallTabToday') },
              { key: 'total' as HallTab, label: T('hallTabTotal') },
              { key: 'beom' as HallTab, label: T('hallTabBeom') }
            ]).map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setHallTab(tab.key)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg t-tag transition-all ${
                  hallTab === tab.key ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-2 divide-y divide-neutral-100">
            {hallRows.map((row, i) => (
              <div key={`${row.user}-${i}`} className="flex items-center justify-between gap-2 py-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    translate="no"
                    className={`notranslate shrink-0 w-6 h-6 rounded-full flex items-center justify-center t-tag font-black ${
                      i === 0 ? 'bg-black text-white' : i < 3 ? 'bg-[#dc2626] text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span translate="no" className="notranslate t-body text-black truncate">@{row.user}</span>
                  {row.mine && (
                    <span className="shrink-0 t-tag bg-red-50 text-[#dc2626] border border-[#dc2626]/30 rounded px-1.5 py-0.5">
                      {T('hallYou')}
                    </span>
                  )}
                </div>
                <p translate="no" className="notranslate shrink-0 t-tag font-black text-black">
                  {fmtPi(row.value)} <span className="text-gray-400">{hallUnit}</span>
                </p>
              </div>
            ))}
            {hallRows.length === 0 && (
              <p className="t-sub text-gray-400 py-3">{T('hallEmpty')}</p>
            )}
          </div>
        </div>

        <p className="text-center text-gray-300 t-tag mt-6 mb-2">
          <span translate="no" className="notranslate">XAEA12</span> · <span translate="no" className="notranslate">xaea12.pi</span> · {T('footerTag')}
        </p>
      </main>

      {/* ── 토스트 (하단 독 위) ───────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1500] w-[calc(100%-2rem)] max-w-md pointer-events-none">
          <p className="bg-black text-white t-tag rounded-xl px-3 py-2.5 text-center shadow-lg">
            {toast}
          </p>
        </div>
      )}

      {/* ── 하단 고정 푸터 ───────────────────────────────────── */}
      <AppDock active="XAEA12" soonMessage={T('alertSoon')} />
    </div>
  );
}
