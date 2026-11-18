'use client';

import React, { useEffect, useMemo, useState } from 'react';

/**
 * 5개 앱 공통 — 즐겨찾기(★) + 앱 이용 후기 이벤트
 * ------------------------------------------------------------------
 * KEDHEON · CIVIL · FACTFILTER · HANGANG · XAEA12 다섯 페이지에 같은 컴포넌트를
 * 마운트한다. 화면 규격은 BNPi 기준(px 고정 타이포 · 1px 연회색 테두리 · 담백한
 * 화이트/블랙)을 그대로 쓰고, 큰 원색 박스나 이질 이모지는 넣지 않는다.
 *
 *  - 즐겨찾기: localStorage(`kedheon.eco.bookmarks.v1`)에 앱 키 배열로 저장.
 *    페이지를 옮겨 다녀도 같은 목록이 보이도록 storage 이벤트도 듣는다.
 *  - 후기: localStorage(`kedheon.eco.reviews.v1`)에 즉시 반영.
 *    서버 DB가 없는 현재 단계라 브라우저에만 남는다(화면에도 그렇게 적는다).
 *  - Pi Browser 북마크(App Directory → Bookmarked) 1줄 안내 포함.
 */

export type EcoAppKey = 'KEDHEON' | 'CIVIL' | 'FACTFILTER' | 'HANGANG' | 'XAEA12';

type EcoApp = {
  key: EcoAppKey;
  name: string;
  href: string;
  axis: { ko: string; en: string };
};

/** 주군이 정한 5대 축 — Kedheon 계정(근본) · Civil 투표 · FactFilter 진실 · Hangang 문화 · XAEA12 기여 */
export const ECO_APPS: EcoApp[] = [
  { key: 'KEDHEON', name: 'Kedheon', href: 'https://kedheon.com', axis: { ko: '계정 · 근본', en: 'Account · Root' } },
  { key: 'CIVIL', name: 'Civil', href: 'https://civil.kedheon.com', axis: { ko: '투표', en: 'Vote' } },
  { key: 'FACTFILTER', name: 'FactFilter', href: 'https://factfilter.kedheon.com', axis: { ko: '진실', en: 'Truth' } },
  { key: 'HANGANG', name: 'Hangang', href: 'https://hangang.kedheon.com', axis: { ko: '문화', en: 'Culture' } },
  { key: 'XAEA12', name: 'XAEA12', href: 'https://xaea12.kedheon.com', axis: { ko: '기여', en: 'Contribution' } },
];

const BOOKMARK_KEY = 'kedheon.eco.bookmarks.v1';
const REVIEW_KEY = 'kedheon.eco.reviews.v1';

type Review = {
  id: string;
  app: EcoAppKey;
  stars: number;
  text: string;
  at: number;
};

const isEcoKey = (v: unknown): v is EcoAppKey =>
  typeof v === 'string' && ECO_APPS.some(a => a.key === v);

function readBookmarks(): EcoAppKey[] {
  try {
    const raw = window.localStorage.getItem(BOOKMARK_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEcoKey) : [];
  } catch {
    return [];
  }
}

function readReviews(): Review[] {
  try {
    const raw = window.localStorage.getItem(REVIEW_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r): r is Review => {
        if (!r || typeof r !== 'object') return false;
        const o = r as Partial<Review>;
        return typeof o.id === 'string' && isEcoKey(o.app) && typeof o.stars === 'number' && typeof o.text === 'string';
      })
      .slice(0, 60);
  } catch {
    return [];
  }
}

const appOf = (key: EcoAppKey) => ECO_APPS.find(a => a.key === key) ?? ECO_APPS[0];

function fmtDate(at: number, ko: boolean) {
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return '';
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return ko ? `${mm}.${dd}` : `${mm}.${dd}`;
}

export default function EcosystemBookmarkAndReview({
  current,
  lang,
}: {
  /** 지금 보고 있는 앱 — 기본 선택값과 '현재' 표시에 쓴다. */
  current: EcoAppKey;
  /** 각 앱의 Lang 코드. 'KR'/'KO' 만 한국어로 보고 나머지는 영문으로 표기한다. */
  lang?: string;
}) {
  const ko = lang === 'KR' || lang === 'KO';

  const [bookmarks, setBookmarks] = useState<EcoAppKey[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [app, setApp] = useState<EcoAppKey>(current);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');
  const [posted, setPosted] = useState(false);
  const [hint, setHint] = useState('');

  // 첫 페인트는 서버 HTML과 같게 두고, 마운트 뒤에 저장값을 읽는다(hydration 불일치 방지).
  useEffect(() => {
    setBookmarks(readBookmarks());
    setReviews(readReviews());
  }, []);

  // 다른 앱 페이지에서 별을 켜고 돌아왔을 때도 같은 목록을 보여 준다.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === BOOKMARK_KEY) setBookmarks(readBookmarks());
      if (e.key === REVIEW_KEY) setReviews(readReviews());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    setApp(current);
    setPosted(false);
  }, [current]);

  const starred = useMemo(
    () => ECO_APPS.filter(a => bookmarks.includes(a.key)),
    [bookmarks]
  );

  const toggleBookmark = (key: EcoAppKey) => {
    setBookmarks(prev => {
      const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      try {
        window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      } catch {
        /* 저장 공간이 막힌 브라우저 — 화면 상태만 유지한다 */
      }
      return next;
    });
  };

  const submitReview = () => {
    const body = text.trim();
    if (body.length < 2) {
      setHint(ko ? '후기를 두 글자 이상 적어 주세요.' : 'Please write at least two characters.');
      return;
    }
    const entry: Review = {
      id: `${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 5)}`,
      app,
      stars,
      text: body.slice(0, 120),
      at: Date.now(),
    };
    const next = [entry, ...reviews].slice(0, 60);
    setReviews(next);
    setText('');
    setHint('');
    setPosted(true);
    try {
      window.localStorage.setItem(REVIEW_KEY, JSON.stringify(next));
    } catch {
      /* 위와 같다 */
    }
  };

  const T = {
    eyebrow: ko ? '★ BOOKMARK · REVIEW' : '★ BOOKMARK · REVIEW',
    title: ko ? '즐겨찾기 & 이용 후기' : 'Bookmark & Review',
    desc: ko
      ? '다섯 앱을 한 곳에서 즐겨찾기하고, 써 보신 소감을 한 줄로 남겨 주세요.'
      : 'Star the five apps in one place, and leave a one-line note about your experience.',
    starredLabel: ko ? '즐겨찾기 모아보기' : 'Starred apps',
    starredEmpty: ko
      ? '아직 즐겨찾기한 앱이 없습니다. 아래 ★ 를 눌러 모아 두시면 여기서 바로 이동하실 수 있습니다.'
      : 'No starred apps yet. Tap ★ below and they will show up here for one-tap access.',
    currentTag: ko ? '현재' : 'Here',
    starOn: ko ? '★ 즐겨찾기됨' : '★ Starred',
    starOff: ko ? '☆ 즐겨찾기' : '☆ Star',
    piLine: ko
      ? 'Pi Browser 상단 ★ 북마크를 켜 두시면 App Directory(Bookmarked)에서 바로 다시 들어오실 수 있습니다.'
      : 'Keep the ★ bookmark on at the top of Pi Browser and you can come straight back from App Directory (Bookmarked).',
    appLabel: ko ? '대상 앱' : 'App',
    starsLabel: ko ? '별점' : 'Rating',
    textPlaceholder: ko ? '한 줄 후기 (짧게 적어 주세요)' : 'One-line review (keep it short)',
    submit: ko ? '후기 등록' : 'Post review',
    eventNote: ko
      ? '후기를 남기시면 이용 후기 이벤트 참여로 기록됩니다. 발자국 포인트는 인앱 전용이며 Pi·현금 환전은 되지 않습니다.'
      : 'Your review counts as event participation. Footprint Points stay in-app and are not exchangeable for Pi or cash.',
    done: ko
      ? '이용 후기 이벤트 참여 완료 · 발자국 포인트(인앱 전용, Pi/현금 환전 불가) 기록 대상'
      : 'Review event participation complete · counted toward Footprint Points (in-app only, not exchangeable for Pi or cash)',
    listLabel: ko ? '등록된 후기' : 'Reviews',
    listEmpty: ko
      ? '아직 등록된 후기가 없습니다. 첫 후기를 남겨 주세요.'
      : 'No reviews yet. Be the first to leave one.',
    localNote: ko
      ? '이 브라우저에만 저장됩니다(로그인·서버 전송 없음).'
      : 'Saved in this browser only (no sign-in, nothing sent to a server).',
  };

  return (
    <section
      id="bookmark-review"
      aria-labelledby="bookmark-review-title"
      className="mt-3 bg-white border border-[#E5E7EB] rounded-2xl shadow-[var(--card-shadow)] px-3 py-3 md:px-5 md:py-4 text-left"
    >
      {/* ── 제목 ─────────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between gap-2 border-b border-neutral-200 pb-2">
        <div className="min-w-0">
          <p translate="no" className="notranslate t-tag uppercase text-[#dc2626]">{T.eyebrow}</p>
          <h2 id="bookmark-review-title" className="t-section text-neutral-900 mt-0.5">{T.title}</h2>
        </div>
        <span translate="no" className="notranslate shrink-0 t-tag text-gray-400 font-mono">
          ★ {bookmarks.length}/5
        </span>
      </div>
      <p className="t-sub text-neutral-500 mt-1.5">{T.desc}</p>

      {/* ── 즐겨찾기 모아보기 (빠른 이동) ────────────────────── */}
      <div className="mt-2.5">
        <p className="t-tag uppercase text-gray-400 mb-1">{T.starredLabel}</p>
        {starred.length === 0 ? (
          <p className="t-tag text-neutral-500 leading-relaxed">{T.starredEmpty}</p>
        ) : (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {starred.map(a => {
              const here = a.key === current;
              return here ? (
                <span
                  key={a.key}
                  className="notranslate shrink-0 whitespace-nowrap t-tag bg-black text-white rounded-lg px-2 py-1.5"
                  translate="no"
                >
                  ★ {a.name}
                </span>
              ) : (
                <a
                  key={a.key}
                  href={a.href}
                  className="notranslate shrink-0 whitespace-nowrap t-tag bg-neutral-100 text-neutral-700 rounded-lg px-2 py-1.5 hover:bg-neutral-200 transition-colors"
                  translate="no"
                >
                  ★ {a.name}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5개 앱 ★ 토글 ────────────────────────────────────── */}
      <ul className="mt-2 border-y border-neutral-200 divide-y divide-neutral-100">
        {ECO_APPS.map(a => {
          const on = bookmarks.includes(a.key);
          const here = a.key === current;
          return (
            <li key={a.key} className="flex items-center justify-between gap-2 py-1.5">
              <a
                href={here ? undefined : a.href}
                aria-current={here ? 'page' : undefined}
                className={`min-w-0 flex items-baseline gap-1.5 ${here ? 'cursor-default' : 'hover:opacity-70'}`}
              >
                <span translate="no" className="notranslate t-card text-black truncate">{a.name}</span>
                <span className={`t-tag shrink-0 ${here ? 'text-[#dc2626]' : 'text-gray-400'}`}>
                  {here ? T.currentTag : ko ? a.axis.ko : a.axis.en}
                </span>
              </a>
              <button
                type="button"
                aria-pressed={on}
                aria-label={`${ko ? a.name + ' 즐겨찾기' : 'Star ' + a.name}`}
                onClick={() => toggleBookmark(a.key)}
                className={`shrink-0 t-tag rounded-lg border px-2 py-1 transition-colors active:scale-95 ${
                  on
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-500 border-[#E5E7EB] hover:border-neutral-400 hover:text-black'
                }`}
              >
                {on ? T.starOn : T.starOff}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Pi Browser 북마크 1줄 안내 */}
      <p className="t-tag text-neutral-500 mt-2 leading-relaxed">{T.piLine}</p>

      {/* ── 후기 작성 ────────────────────────────────────────── */}
      <div className="mt-3 border-t border-neutral-200 pt-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <label className="block">
            <span className="block t-tag uppercase text-gray-400 mb-1">{T.appLabel}</span>
            <select
              value={app}
              onChange={e => setApp(e.target.value as EcoAppKey)}
              aria-label={T.appLabel}
              className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-2 t-tag text-black shadow-xs outline-none cursor-pointer focus:border-black focus:ring-2 focus:ring-black/10"
            >
              {ECO_APPS.map(a => (
                <option key={a.key} value={a.key} translate="no" className="notranslate">{a.name}</option>
              ))}
            </select>
          </label>
          <div>
            <span className="block t-tag uppercase text-gray-400 mb-1">{T.starsLabel}</span>
            <div className="flex items-center gap-1" role="group" aria-label={T.starsLabel}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} / 5`}
                  aria-pressed={stars === n}
                  onClick={() => setStars(n)}
                  className={`shrink-0 w-8 h-8 rounded-lg border t-btn leading-none transition-colors active:scale-95 ${
                    n <= stars
                      ? 'border-[#E5E7EB] bg-neutral-100 text-[#dc2626]'
                      : 'border-[#E5E7EB] bg-white text-gray-300 hover:text-neutral-500'
                  }`}
                >
                  ★
                </button>
              ))}
              <span translate="no" className="notranslate t-tag text-gray-400 ml-1">{stars}/5</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mt-1.5">
          <input
            value={text}
            onChange={e => { setText(e.target.value); if (hint) setHint(''); }}
            onKeyDown={e => { if (e.key === 'Enter') submitReview(); }}
            maxLength={120}
            placeholder={T.textPlaceholder}
            aria-label={T.textPlaceholder}
            className="min-w-0 flex-1 bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-2 t-body text-black placeholder-neutral-400 outline-none transition-colors focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10"
          />
          <button
            type="button"
            onClick={submitReview}
            className="shrink-0 bg-black hover:bg-[#dc2626] text-white t-btn px-4 py-2.5 rounded-lg transition-all active:scale-95"
          >
            {T.submit}
          </button>
        </div>

        {hint && <p className="t-tag text-[#dc2626] mt-1.5">{hint}</p>}

        {posted && (
          <div className="mt-2 bg-neutral-50 border-l-[3px] border-[#dc2626] rounded-lg px-2.5 py-2">
            <p className="t-tag text-black leading-relaxed">{T.done}</p>
          </div>
        )}

        <p className="t-tag text-neutral-500 mt-2 leading-relaxed">{T.eventNote}</p>
      </div>

      {/* ── 후기 목록 ────────────────────────────────────────── */}
      <div className="mt-3 border-t border-neutral-200 pt-2.5">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <p className="t-tag uppercase text-gray-400">{T.listLabel}</p>
          <span translate="no" className="notranslate t-tag text-gray-400 font-mono">{reviews.length}</span>
        </div>

        {reviews.length === 0 ? (
          <p className="t-tag text-gray-400 py-1">{T.listEmpty}</p>
        ) : (
          <ul className="space-y-1">
            {reviews.map(r => (
              <li key={r.id} className="flex items-start justify-between gap-2 bg-neutral-50 rounded-lg px-2.5 py-1.5">
                <div className="min-w-0 text-left">
                  <p className="t-tag text-neutral-500">
                    <span translate="no" className="notranslate text-black">{appOf(r.app).name}</span>
                    <span translate="no" className="notranslate text-[#dc2626] ml-1">
                      {'★'.repeat(Math.max(1, Math.min(5, r.stars)))}
                    </span>
                  </p>
                  <p className="t-body text-neutral-700 break-words">{r.text}</p>
                </div>
                <span translate="no" className="notranslate shrink-0 t-tag text-gray-400 font-mono">{fmtDate(r.at, ko)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="t-tag text-gray-400 mt-2">{T.localNote}</p>
      </div>
    </section>
  );
}
