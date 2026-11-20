'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PiBadge from '../components/PiBadge';
import { usePi } from '../components/PiProvider';
import PiReadOnlyBanner from '../components/PiReadOnlyBanner';
import AppDock from '../components/AppDock';
import PrivacyLink from '../components/PrivacyLink';
import AppHeader from '../components/AppHeader';
import LangSelect from '../components/LangSelect';
import {
  LANGS, LANG_TAG, detectLang, tr, ui,
  type Lang, type L10, type UIKey
} from './lib/i18n';
import {
  APPS, APP_MAP, SAMPLE_STORIES, HALL_SEED,
  CELEB_BLOCKLIST, FIAT_PATTERNS, cleanUnit, validUnit,
  type AppKey, type HallTab, type Story
} from './lib/stories';

/* ------------------------------------------------------------------
 * XAEA12 — 생태계 게임 포인트 & 선물하기 매칭 허브
 * 디자인 시스템: 케데헌과 동일 (White / Black / Red #DC2626)
 * 10개국어 · 1단계(게임 포인트·타 앱 선물하기) → 2단계(Mainnet) · 안전장치 1줄 안내
 * ------------------------------------------------------------------ */

const STORE_KEY = 'xaea12.hub.v2';
/** BEOM 응원 1회 비용 */
const CHEER_COST = 15;
/** 선물 기록 1건 보상 */
const GIFT_REWARD = 10;
/** 출석 1회 지급 */
const CHECK_REWARD = 10;
/** 7일 연속 보너스 */
const STREAK7_BONUS = 20;

interface SavedState {
  board: Story[];
  beom: number;
  /** 마지막 출석일 YYYY-MM-DD (브라우저 로컬 기준) */
  lastCheck: string;
  /** 7일 주기의 연속 출석 일수 (1~7) */
  streak: number;
  notify: boolean;
  /** 누적 선물 기록 건수 */
  gifts: number;
  /** 오늘 선물 기록 건수 */
  giftsToday: number;
  /** giftsToday 기준일 */
  giftsDay: string;
}

const EMPTY_STATE: SavedState = {
  board: SAMPLE_STORIES,
  beom: 0,
  lastCheck: '',
  streak: 0,
  notify: false,
  gifts: 0,
  giftsToday: 0,
  giftsDay: ''
};

const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
};

function fmtNum(n: number) {
  return Number.isInteger(n) ? n.toLocaleString('en-US') : n.toFixed(2);
}

function SectionHead({ no, title, desc }: { no: string; title: string; desc: string }) {
  return (
    <div className="mt-3 mb-1.5 text-left border-t border-[#dc2626] pt-2">
      <div className="flex items-baseline gap-2">
        <span className="t-tag text-[#dc2626] shrink-0">{no}</span>
        <h2 className="t-section text-neutral-900 uppercase border-l-[3px] border-neutral-900 pl-2">{title}</h2>
      </div>
      <p className="t-sub text-neutral-500 mt-1 pl-[13px]">{desc}</p>
    </div>
  );
}

export default function Xaea12Page() {
  const { requireAuth, authenticated, setGateLang, username } = usePi();
  const [lang, setLang] = useState<Lang>('KR');
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<SavedState>(EMPTY_STATE);
  const [app, setApp] = useState<AppKey | 'ALL'>('ALL');
  const [hallTab, setHallTab] = useState<HallTab>('today');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 사연 등록 폼
  const [formOpen, setFormOpen] = useState(false);
  const [fApp, setFApp] = useState<AppKey>('BOPI');
  const [fUnit, setFUnit] = useState('');
  const [fUser, setFUser] = useState('');
  const [fGoal, setFGoal] = useState('');
  const [fStory, setFStory] = useState('');
  const [fSafe, setFSafe] = useState(false);

  // 선물 기록 패널
  const [recId, setRecId] = useState<string | null>(null);
  const [recAmount, setRecAmount] = useState('');

  const T = (k: UIKey) => ui(k, lang);
  const L = (v: L10) => tr(v, lang);
  /** KR·CN·JP는 수량과 단위를 붙여 쓴다(9명·14건). */
  const countText = (n: number, unit: string) =>
    lang === 'KR' || lang === 'CN' || lang === 'JP' ? `${n}${unit}` : `${n} ${unit}`;

  useEffect(() => {
    setLang(detectLang());
    setMounted(true);
  }, []);

  // 저장된 허브 상태 복원 (이 브라우저에만)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<SavedState>;
      const board = Array.isArray(parsed.board) && parsed.board.length ? parsed.board : SAMPLE_STORIES;
      setState({
        board,
        beom: typeof parsed.beom === 'number' ? parsed.beom : 0,
        lastCheck: typeof parsed.lastCheck === 'string' ? parsed.lastCheck : '',
        streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
        notify: !!parsed.notify,
        gifts: typeof parsed.gifts === 'number' ? parsed.gifts : 0,
        giftsToday: typeof parsed.giftsToday === 'number' ? parsed.giftsToday : 0,
        giftsDay: typeof parsed.giftsDay === 'string' ? parsed.giftsDay : ''
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
    () => (app === 'ALL' ? board : board.filter(s => s.app === app)),
    [board, app]
  );

  const pct = (s: Story) => Math.min(100, Math.round((s.raised / Math.max(1, s.goal)) * 100));
  const closed = (s: Story) => s.raised >= s.goal;
  const appName = (key: AppKey) => (key === 'ETC' ? T('appOther') : APP_MAP[key].name);

  /** 매일 출석 — 7일 주기 연속 기록. 하루 1회, 이 브라우저에 저장. */
  const checkIn = () => {
    const today = dayKey();
    if (state.lastCheck === today) {
      flash(T('toastAlready'));
      return;
    }
    const cycle = state.lastCheck === yesterdayKey() ? (state.streak % 7) + 1 : 1;
    const bonus = cycle === 7 ? STREAK7_BONUS : 0;
    persist({
      ...state,
      beom: state.beom + CHECK_REWARD + bonus,
      lastCheck: today,
      streak: cycle
    });
    flash(`${T('toastCheck')} · ${countText(cycle, T('dayUnit'))} ${T('checkinStreakLabel')}`);
    if (bonus) setTimeout(() => flash(T('toastStreak7')), 1600);
  };

  /** 앱에서 실제로 보낸 선물을 보드에 기록한다. */
  const recordGift = (s: Story, raw: string) => {
    const left = s.goal - s.raised;
    if (left <= 0) return;
    const parsed = Number(raw.replace(/[^\d]/g, ''));
    if (!Number.isFinite(parsed) || parsed < 1) {
      flash(T('recordDesc'));
      return;
    }
    const amount = Math.min(Math.floor(parsed), left);
    const nextBoard = board.map(item =>
      item.id === s.id
        ? { ...item, raised: Math.min(item.goal, item.raised + amount), gifters: item.gifters + 1 }
        : item
    );
    const today = dayKey();
    const sameDay = state.giftsDay === today;
    persist({
      ...state,
      board: nextBoard,
      beom: state.beom + GIFT_REWARD,
      gifts: state.gifts + 1,
      giftsToday: (sameDay ? state.giftsToday : 0) + 1,
      giftsDay: today
    });
    setRecId(null);
    setRecAmount('');
    flash(T('toastGift'));
    if (nextBoard.find(item => item.id === s.id)?.raised === s.goal) {
      setTimeout(() => flash(T('toastClosedStory')), 1500);
    }
  };

  /** 모은 BEOM으로 응원을 보탠다. */
  const cheer = (s: Story) => {
    if (state.beom < CHEER_COST) {
      flash(T('toastNoBeom'));
      return;
    }
    persist({
      ...state,
      beom: state.beom - CHEER_COST,
      board: board.map(item => (item.id === s.id ? { ...item, cheer: item.cheer + 1 } : item))
    });
    flash(T('toastCheer'));
  };

  const reserveNotify = () => {
    if (state.notify) return;
    if (!requireAuth(T('notifyBtn'))) return;
    persist({ ...state, beom: state.beom + 1, notify: true });
  };

  const copyHandle = async (user: string) => {
    const text = `@${user}`;
    try {
      await navigator.clipboard.writeText(text);
      flash(T('copied'));
      return;
    } catch {
      // 클립보드 API가 막힌 브라우저는 임시 입력으로 대체한다.
    }
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      flash(T('copied'));
    } catch {
      // 복사까지 막히면 화면의 @username을 그대로 보여 주는 것으로 끝낸다.
    }
  };

  const submitStory = () => {
    const handle = fUser.trim().replace(/^@+/, '');
    if (!/^[A-Za-z0-9_]{3,20}$/.test(handle)) return flash(T('formAlertUser'));

    const goal = Number(fGoal);
    if (!Number.isInteger(goal) || goal < 1 || goal > 9999) return flash(T('formAlertGoal'));

    const unit = fApp === 'ETC' ? validUnit(fUnit) : cleanUnit(fUnit || APP_MAP[fApp].unit);
    if (!unit) return flash(T('formAlertUnit'));

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
      app: fApp,
      unit,
      user: handle,
      goal,
      raised: 0,
      gifters: 0,
      cheer: 0,
      title: filled,
      local: true
    };

    persist({ ...state, board: [story, ...board], beom: state.beom + 2 });
    setFormOpen(false);
    setFStory('');
    setFGoal('');
    setFUser('');
    setFUnit('');
    setFSafe(false);
    setApp('ALL');
    flash(T('formSuccess'));
  };

  const hallRows = useMemo(() => {
    const base = HALL_SEED[hallTab].map(row => ({ ...row, mine: false }));
    const mine =
      hallTab === 'today' ? state.giftsToday : hallTab === 'total' ? state.gifts : state.beom;
    if (username) base.push({ user: username, value: mine, mine: true });
    return base.sort((a, b) => b.value - a.value).slice(0, 6);
  }, [hallTab, state.giftsToday, state.gifts, state.beom, username]);

  const hallUnit = hallTab === 'beom' ? '🐾' : T('unitCount');
  /** 랭킹 값 뒤 단위 — KR·CN·JP는 붙여 쓰고(14건) 나머지는 띄어 쓴다(14 times). */
  const hallUnitText =
    hallTab !== 'beom' && (lang === 'KR' || lang === 'CN' || lang === 'JP')
      ? hallUnit
      : ` ${hallUnit}`;

  if (!mounted) return <div className="bg-white min-h-screen" />;

  const stageCard = 'text-left rounded-2xl border p-3 md:p-4';
  const streakDots = Math.min(state.streak, 7);
  const checkedToday = state.lastCheck === dayKey();

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
              <span className="block text-gray-400 t-tag font-mono uppercase whitespace-nowrap">GAME POINT HUB</span>
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
        {/* 모바일: 상단 중앙 158px 대표이미지 카드 / 데스크톱: 오른쪽 큰 그림 + 캡션. */}
        <section className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-[var(--card-shadow)] overflow-hidden px-3 py-2.5 md:px-8 md:py-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#dc2626]/5" />

          <div className="relative md:grid md:grid-cols-[1.08fr_0.92fr] md:gap-7 md:items-center">
            <figure className="relative mx-auto w-full max-w-[158px] sm:max-w-[180px] md:order-2 md:max-w-[340px] md:shrink-0">
              <img
                src="/xaea12-hero.jpg"
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
                xaea12.pi · ecosystem game points
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
              { v: `${APPS.length}`, label: T('statStage'), short: T('statStageS') },
              { v: `🐾 ${fmtNum(state.beom)}`, label: T('statBeom'), short: 'BEOM' },
              { v: '100%', label: T('statMatch'), short: T('statMatchS') }
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

        {/* ── 2. 가이드라인 준수 문구 ──────────────────────────── */}
        <div className="mt-2 bg-neutral-50 border-l-[3px] border-black rounded-lg px-3 py-2.5 text-left">
          <p className="t-tag uppercase text-[#dc2626]">{T('complianceTitle')}</p>
          <p className="t-body text-gray-600 mt-1">{T('complianceBody')}</p>
        </div>

        {/* ── 3. 1단계 · 2단계 시나리오 ─────────────────────────── */}
        <SectionHead no="01" title={T('secStageTitle')} desc={T('secStageDesc')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* 1단계 · 지금 */}
          <div className={`${stageCard} bg-white border border-[#E5E7EB] shadow-[var(--card-shadow)]`}>
            <div className="flex items-center justify-between gap-2">
              <span className="t-tag uppercase text-[#dc2626]">{T('stage1Label')}</span>
              <span className="notranslate t-tag bg-black text-white rounded-full px-2 py-0.5" translate="no">BOPIES · SIGIL · BEOM</span>
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

        {/* ── 4. 매일 출석 · 7일 스트릭 ─────────────────────────── */}
        <SectionHead no="02" title={T('checkinSecTitle')} desc={T('checkinSecDesc')} />

        <div className="bg-white border border-neutral-200 rounded-2xl p-3 md:p-4 text-left">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="t-tag uppercase text-gray-400">🐾 BEOM</p>
              <p translate="no" className="notranslate text-black text-[length:var(--t-stat)] font-black leading-none mt-1">
                {fmtNum(state.beom)}
              </p>
            </div>
            <div className="text-right">
              <p className="t-tag uppercase text-gray-400">{T('checkinStreakLabel')}</p>
              <p translate="no" className="notranslate text-black t-card font-black leading-none mt-1">
                {countText(streakDots, T('dayUnit'))}
              </p>
            </div>
          </div>

          {/* 7일 스트릭 점 */}
          <div className="flex items-center justify-between gap-1 mt-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span
                  className={`w-full h-1.5 rounded-full ${i < streakDots ? 'bg-[#dc2626]' : 'bg-neutral-100'}`}
                  aria-hidden="true"
                />
                <span className={`t-tag notranslate ${i < streakDots ? 'text-[#dc2626]' : 'text-neutral-300'}`} translate="no">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={checkIn}
            className={`w-full mt-3 rounded-lg t-btn px-3 py-2.5 transition-all active:scale-95 ${
              checkedToday ? 'bg-neutral-100 text-neutral-500' : 'bg-black hover:bg-[#dc2626] text-white'
            }`}
          >
            {checkedToday ? `✓ ${T('checkinDone')}` : T('checkinBtn')}
          </button>
          <p className="t-tag text-[#dc2626] mt-2">{T('checkinBonus')}</p>
          <p className="t-sub text-neutral-400 mt-1">{T('checkinNote')}</p>
        </div>

        {/* ── 5. 코어팀 안전장치 1줄 안내 ──────────────────────── */}
        <p className="mt-3 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 t-sub text-neutral-500 text-center">
          {T('safetyLine')}
        </p>

        {/* ── 6. 사연 보드 ─────────────────────────────────────── */}
        <SectionHead no="03" title={T('secBoardTitle')} desc={T('secBoardDesc')} />

        {/* 앱 필터 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { key: 'ALL' as const, icon: '✦', label: T('filterAll') },
            ...APPS.map(a => ({
              key: a.key,
              icon: a.icon,
              label: a.labelKey ? T(a.labelKey) : a.name
            }))
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setApp(tab.key)}
              className={`shrink-0 px-3 py-2 rounded-xl text-left transition-all ${
                app === tab.key ? 'bg-black text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:text-black'
              }`}
            >
              <span className="block t-card whitespace-nowrap">
                <span className="mr-1">{tab.icon}</span>
                {tab.key === 'ETC' ? tab.label : <span translate="no">{tab.label}</span>}
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
              + {T('formOpen')}
            </button>
          ) : (
            <div className="bg-white border border-[#E5E7EB] shadow-[var(--card-shadow)] rounded-2xl p-3 md:p-4">
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
                <label className="text-left md:col-span-2">
                  <span className="block t-tag uppercase text-gray-400 mb-1">{T('formApp')}</span>
                  <select
                    value={fApp}
                    onChange={e => {
                      const next = e.target.value as AppKey;
                      setFApp(next);
                      setFUnit(next === 'ETC' ? fUnit : '');
                    }}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
                  >
                    {APPS.map(a => (
                      <option key={a.key} value={a.key}>
                        {a.icon} {a.key === 'ETC' ? T('appOther') : a.name} · {a.key === 'ETC' ? '—' : a.unit}
                      </option>
                    ))}
                  </select>
                </label>
                {fApp === 'ETC' ? (
                  <label className="text-left">
                    <span className="block t-tag uppercase text-gray-400 mb-1">{T('formUnitCustom')}</span>
                    <input
                      value={fUnit}
                      onChange={e => setFUnit(e.target.value.slice(0, 10))}
                      placeholder={T('formUnitPh')}
                      autoCapitalize="characters"
                      autoCorrect="off"
                      translate="no"
                      className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                ) : (
                  <div className="text-left">
                    <span className="block t-tag uppercase text-gray-400 mb-1">{T('formUnit')}</span>
                    <p translate="no" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2 t-tag font-mono text-neutral-600">
                      {APP_MAP[fApp].unit}
                    </p>
                  </div>
                )}
                <label className="text-left">
                  <span className="block t-tag uppercase text-gray-400 mb-1">{T('formGoal')}</span>
                  <input
                    value={fGoal}
                    onChange={e => setFGoal(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                    inputMode="numeric"
                    placeholder="200"
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

              <p className="text-gray-400 t-tag text-left mt-2.5">{T('formPIIhelp')}</p>
              <button
                type="button"
                onClick={submitStory}
                className="w-full mt-1.5 bg-black hover:bg-[#dc2626] text-white t-btn px-4 py-2.5 rounded-lg transition-all active:scale-95"
              >
                {T('formSubmit')}
              </button>
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
            const recOpen = recId === s.id;
            return (
              <article
                key={s.id}
                className={`text-left bg-white rounded-2xl border p-3 ${done ? 'border-black' : 'border-neutral-200'}`}
              >
                {/* 앱 배지 + 재화 단위 + @username 복사 */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1 min-w-0">
                    <span translate="no" className="notranslate shrink-0 t-tag font-mono bg-black text-white rounded px-1.5 py-0.5">
                      {APP_MAP[s.app].icon} {s.app === 'ETC' ? T('appOther') : APP_MAP[s.app].name}
                    </span>
                    <span translate="no" className="notranslate shrink-0 t-tag font-mono bg-red-50 text-[#dc2626] border border-[#dc2626]/30 rounded px-1.5 py-0.5">
                      {s.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyHandle(s.user)}
                      title={T('copyHandle')}
                      aria-label={`${T('copyHandle')} @${s.user}`}
                      translate="no"
                      className="notranslate t-tag font-mono text-gray-500 border border-neutral-200 rounded px-1.5 py-0.5 hover:border-black hover:text-black transition-colors"
                    >
                      @{s.user} ⧉
                    </button>
                  </div>
                </div>

                <p className="text-black t-card mt-1.5">{L(s.title)}</p>

                <div className="flex flex-wrap items-center gap-1 mt-1.5">
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
                  <p translate="no" className="notranslate t-tag text-gray-500 min-w-0 truncate">
                    <span className={`font-black ${done ? 'text-black' : 'text-[#dc2626]'}`}>{fmtNum(s.raised)}</span>
                    {' / '}{fmtNum(s.goal)} {s.unit}
                    <span className="text-gray-300"> · {countText(s.gifters, T('backersUnit'))}</span>
                  </p>
                  <p translate="no" className="notranslate shrink-0 t-tag font-black text-black">{pct(s)}%</p>
                </div>
                <p className="t-tag text-gray-400 mt-0.5">
                  {T('cheersUnit')} <span translate="no" className="notranslate">{s.cheer}</span>
                </p>

                {!done ? (
                  <>
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRecId(recOpen ? null : s.id);
                          setRecAmount('');
                        }}
                        aria-expanded={recOpen}
                        className={`bg-white border t-btn px-2 py-2 rounded-lg transition-all active:scale-95 ${
                          recOpen ? 'border-[#dc2626] text-[#dc2626]' : 'border-black text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {T('recordBtn')}
                      </button>
                      <button
                        type="button"
                        onClick={() => cheer(s)}
                        className="bg-black text-white t-btn px-2 py-2 rounded-lg transition-all hover:bg-[#dc2626] active:scale-95"
                      >
                        {T('cheerBtn')} {CHEER_COST}
                      </button>
                    </div>

                    {recOpen && (
                      <div className="mt-1.5 bg-neutral-50 border border-neutral-200 rounded-xl p-2.5">
                        <p className="t-card text-black">{T('recordTitle')}</p>
                        <p className="t-tag text-neutral-500 mt-0.5">{T('giftHint')}</p>
                        <p translate="no" className="notranslate t-card font-black text-black mt-0.5">@{s.user}</p>
                        <div className="flex flex-wrap items-center gap-1 mt-1.5">
                          {[...new Set([10, 50, left])].filter(v => v > 0 && v <= left).map(v => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setRecAmount(String(v))}
                              className={`t-tag px-2 py-1 rounded-md border transition-colors ${
                                recAmount === String(v) ? 'bg-black text-white border-black' : 'bg-white border-neutral-300 text-neutral-600'
                              }`}
                            >
                              {v === left ? `+${T('recordFull')}` : `+${v}`}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <input
                            value={recAmount}
                            onChange={e => setRecAmount(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                            inputMode="numeric"
                            placeholder={T('recordAmountPh')}
                            aria-label={T('recordAmountPh')}
                            className="flex-1 min-w-0 bg-white border border-neutral-300 rounded-lg px-2 py-1.5 t-tag text-black placeholder-neutral-400 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                          />
                          <button
                            type="button"
                            onClick={() => recordGift(s, recAmount)}
                            className="shrink-0 bg-[#dc2626] hover:bg-black text-white t-btn px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
                          >
                            {T('recordConfirm')}
                          </button>
                        </div>
                        <p className="t-tag text-neutral-400 mt-1">{T('recordDesc')}</p>
                      </div>
                    )}

                    <p className="text-gray-400 t-tag mt-1.5 text-right">
                      {T('leftLabel')} <span translate="no" className="notranslate">{fmtNum(left)} {s.unit}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-neutral-500 t-tag mt-2 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-2">
                    {T('closedBadge')} · {T('goalLabel')} <span translate="no" className="notranslate">{fmtNum(s.goal)} {s.unit}</span>
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-2 bg-neutral-50 border-l-[3px] border-[#dc2626] rounded-lg px-3 py-2.5">
          <p className="t-tag text-gray-500 text-left">{T('boardFoot')}</p>
        </div>

        {/* ── 7. 선물 명예의 전당 ───────────────────────────────── */}
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
                  {fmtNum(row.value)}
                  <span className="text-gray-400">{hallUnitText}</span>
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
        <PrivacyLink className="mt-1 mb-2" />
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
