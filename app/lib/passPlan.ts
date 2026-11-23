/**
 * Kedheon.pi Pass (30일) — 상품·가격·배지 규칙의 유일한 출처
 *
 *  - 화면(PassBadge·PassSheet·PassCard)과 서버 API(/api/pass/*, /api/pi/approve)가
 *    모두 이 파일의 상수를 읽는다. 클라이언트가 보낸 금액은 신뢰하지 않는다.
 *  - 가격은 "갱신가"다. Genesis(창립) 첫 30일은 무료로 부여되므로 결제 화면에는 뜨지 않는다.
 *  - 회원번호 하나로 등급이 자동 판별된다:
 *      1 ~ 3,141       → Genesis  (배지 `Genesis #0042`, 첫 달 0 Pi, 이후 0.5 Pi)
 *      3,142 ~ 31,415  → Early    (배지 `Early #03142`, 0.7 Pi)
 *      31,416 ~        → Standard (배지 `MEMBER`, 번호 미노출, 1 Pi)
 *  - 앱별 Pi uid는 서로 다른 값이라 전역 키는 username이다. 이 파일은 그 규칙만 다룬다.
 */

export const PASS_PRODUCT = {
  id: 'pass_30d',
  name: 'Kedheon.pi Pass (30일)',
  days: 30
} as const;

/** 갱신 가격(Pi). 첫 30일은 Genesis만 무료. */
export const PASS_PRICE_PI = {
  genesis: 0.5,
  early: 0.7,
  standard: 1
} as const;

export const GENESIS_LIMIT = 3141;
export const EARLY_LIMIT = 31415;

/** Genesis 첫 30일 무료 부여 (주군 승인 설계 D1 권장안) */
export const FREE_FIRST_MONTH = true;

/** 무료 사용자의 Hangang 저장 상한 (패스는 무제한) */
export const FREE_BOOKMARK_LIMIT = 3;

/** 패스가 적용되는 주력 3종 — 앱 id는 Pi 콘솔 등록 단위와 같다. */
export const PASS_APPS = ['kedheon', 'factfilter', 'hangang'] as const;
export type PassAppId = (typeof PASS_APPS)[number];

export type PassTier = 'pending' | 'genesis' | 'early' | 'standard';

export interface PassAccountRow {
  id: string;
  username: string | null;
  member_number: number | string | null;
  tier: PassTier | null;
  genesis_number: number | string | null;
  pass_expires_at: string | null;
  pass_source: string | null;
}

export interface PassSummary {
  /** 패스 사용 가능 여부(만료 전) */
  active: boolean;
  tier: PassTier;
  memberNumber: number | null;
  genesisNumber: number | null;
  /** 화면에 그대로 쓰는 배지 문자열. 표준 등급은 번호를 노출하지 않는다. */
  badge: string;
  passExpiresAt: string | null;
  /** 남은 일수(올림). 만료면 0. */
  daysLeft: number;
  /** 이 등급이 다음에 갱신할 때 낼 금액 */
  priceNextPi: number;
  /** 가입(번호 발급) 순번이 창립/얼리 안에 있는 후보인가 */
  genesisCandidate: boolean;
}

export function tierOf(memberNumber: number | null): PassTier {
  if (memberNumber === null || !Number.isFinite(memberNumber) || memberNumber <= 0) return 'pending';
  if (memberNumber <= GENESIS_LIMIT) return 'genesis';
  if (memberNumber <= EARLY_LIMIT) return 'early';
  return 'standard';
}

/** 배지 표기: Genesis 4자리, Early 5자리, Standard는 번호 미노출 */
export function badgeOf(memberNumber: number | null): string {
  const tier = tierOf(memberNumber);
  if (tier === 'genesis') return `Genesis #${String(memberNumber).padStart(4, '0')}`;
  if (tier === 'early') return `Early #${String(memberNumber).padStart(5, '0')}`;
  if (tier === 'standard') return 'MEMBER';
  return '';
}

export function priceForTier(tier: PassTier): number {
  if (tier === 'genesis') return PASS_PRICE_PI.genesis;
  if (tier === 'early') return PASS_PRICE_PI.early;
  return PASS_PRICE_PI.standard;
}

/** 30일 이용권이 지금 살아 있는가 */
export function isPassActive(expiresAt: string | null | undefined, now = Date.now()): boolean {
  if (!expiresAt) return false;
  const t = Date.parse(expiresAt);
  return Number.isFinite(t) && t > now;
}

export function daysLeft(expiresAt: string | null | undefined, now = Date.now()): number {
  if (!expiresAt) return 0;
  const t = Date.parse(expiresAt);
  if (!Number.isFinite(t) || t <= now) return 0;
  return Math.ceil((t - now) / (24 * 60 * 60 * 1000));
}

/** DB 행 → 화면·API 공통 요약 */
export function summarizeAccount(row: PassAccountRow | null | undefined, now = Date.now()): PassSummary {
  const memberNumber = row?.member_number === null || row?.member_number === undefined ? null : Number(row.member_number);
  const safeNumber = memberNumber !== null && Number.isFinite(memberNumber) ? memberNumber : null;
  const tier = tierOf(safeNumber);
  const expires = row?.pass_expires_at ?? null;
  const genesisNumber =
    row?.genesis_number === null || row?.genesis_number === undefined ? null : Number(row.genesis_number);
  return {
    active: isPassActive(expires, now),
    tier,
    memberNumber: safeNumber,
    genesisNumber: genesisNumber !== null && Number.isFinite(genesisNumber) ? genesisNumber : null,
    badge: badgeOf(safeNumber),
    passExpiresAt: expires,
    daysLeft: daysLeft(expires, now),
    priceNextPi: priceForTier(tier),
    genesisCandidate: safeNumber !== null && safeNumber <= GENESIS_LIMIT
  };
}

export interface PassCounterState {
  limit: number;
  taken: number;
  remaining: number;
  earlyLimit: number;
  earlyRemaining: number;
  updatedAt: string | null;
}

/** 카운터 한 행 → 잔여 자리 (집계 쿼리 없음, O(1)) */
export function counterState(row: {
  last_number?: number | string | null;
  genesis_limit?: number | string | null;
  early_limit?: number | string | null;
  updated_at?: string | null;
} | null | undefined): PassCounterState {
  const last = Math.max(0, Number(row?.last_number ?? 0) || 0);
  const limit = Number(row?.genesis_limit ?? 0) || GENESIS_LIMIT;
  const earlyLimit = Number(row?.early_limit ?? 0) || EARLY_LIMIT;
  return {
    limit,
    taken: Math.min(last, limit),
    remaining: Math.max(0, limit - Math.min(last, limit)),
    earlyLimit,
    earlyRemaining: Math.max(0, earlyLimit - Math.max(last, limit)),
    updatedAt: row?.updated_at ?? null
  };
}

/** 만료일 표기 — 서버·클라이언트 모두 UTC ISO를 쓰고 화면에서만 YYYY-MM-DD로 자른다. */
export function formatPassDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return '';
  return new Date(t).toISOString().slice(0, 10);
}

/** 30일 연장 계산 — 현재 만료일과 지금 중 늦은 쪽 + 30일 */
export function extendFrom(currentExpiresAt: string | null | undefined, days = PASS_PRODUCT.days, now = Date.now()): string {
  const base = currentExpiresAt ? Date.parse(currentExpiresAt) : NaN;
  const from = Number.isFinite(base) && base > now ? base : now;
  return new Date(from + days * 24 * 60 * 60 * 1000).toISOString();
}
