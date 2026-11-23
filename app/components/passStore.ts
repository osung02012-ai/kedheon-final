'use client';

/**
 * Kedheon.pi Pass 클라이언트 상태 — 앱마다 하나의 작은 외부 저장소
 *
 *  - 헤더 배지 · 패스 시트 · 패스 카드가 같은 값을 본다(각자 fetch하지 않는다).
 *  - 로그인(Pi accessToken)이 생기면 POST /api/pass/touch로 계정·회원번호·만료일을 받아 온다.
 *    (pass_touch는 멱등이라 재방문마다 불러도 번호가 늘거나 만료일이 밀리지 않는다.)
 *  - 서버가 available:false(마이그레이션 전·패스 꺼짐)를 주면 화면은 패스 UI를 숨긴다.
 *  - 결제 완료 응답처럼 서버가 이미 최신 상태를 준 경우 applyPass()로 덮어쓴다.
 */

import { useSyncExternalStore } from 'react';
import { counterState, type PassAppId, type PassCounterState, type PassSummary } from '../lib/passPlan';

export interface PassSnapshot {
  phase: 'idle' | 'loading' | 'ready' | 'hidden';
  enabled: boolean;
  available: boolean;
  authenticated: boolean;
  app: PassAppId;
  pass: PassSummary | null;
  counter: PassCounterState;
  paymentsReady: boolean;
  error: string | null;
}

const INITIAL: PassSnapshot = {
  phase: 'idle',
  enabled: true,
  available: false,
  authenticated: false,
  app: 'kedheon',
  pass: null,
  counter: counterState(null),
  paymentsReady: false,
  error: null
};

let snapshot: PassSnapshot = INITIAL;
const listeners = new Set<() => void>();
let token: string | null = null;
let inflight: Promise<void> | null = null;
let lastLoadedAt = 0;

function emit(next: Partial<PassSnapshot>) {
  snapshot = { ...snapshot, ...next };
  for (const fn of listeners) fn();
}

export function subscribePass(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getPassSnapshot(): PassSnapshot {
  return snapshot;
}

/** 서버 응답(파일 공통 형태)을 그대로 반영한다. */
export function applyPass(payload: {
  enabled?: boolean;
  available?: boolean;
  app?: PassAppId;
  pass?: PassSummary | null;
  counter?: PassCounterState;
  paymentsReady?: boolean;
  error?: string | null;
  authenticated?: boolean;
}) {
  const enabled = payload.enabled !== false;
  const available = payload.available !== false && enabled;
  emit({
    phase: available ? 'ready' : 'hidden',
    enabled,
    available,
    authenticated: payload.authenticated ?? snapshot.authenticated,
    app: payload.app ?? snapshot.app,
    pass: payload.pass ?? null,
    counter: payload.counter ?? snapshot.counter,
    paymentsReady: payload.paymentsReady ?? snapshot.paymentsReady,
    error: payload.error ?? null
  });
}

interface PassResponse {
  ok?: boolean;
  enabled?: boolean;
  available?: boolean;
  app?: PassAppId;
  pass?: PassSummary | null;
  counter?: PassCounterState;
  paymentsReady?: boolean;
  error?: string | null;
  authenticated?: boolean;
}

/** 로그인 토큰으로 패스 상태를 동기화한다(계정·번호·30일 무료 부여 포함). */
export async function loadPass(options: { force?: boolean } = {}): Promise<void> {
  const force = options.force === true;
  if (!force && inflight) return inflight;
  if (!force && Date.now() - lastLoadedAt < 20_000 && snapshot.phase !== 'idle') return;

  const run = async () => {
    if (snapshot.phase === 'idle') emit({ phase: 'loading' });
    try {
      if (!token) {
        const res = await fetch('/api/pass/counter', { cache: 'no-store' });
        const data = (await res.json().catch(() => null)) as PassResponse | null;
        applyPass({
          enabled: data?.enabled,
          available: data?.available,
          counter: data?.counter,
          error: data?.error ?? null,
          authenticated: false
        });
        lastLoadedAt = Date.now();
        return;
      }
      const res = await fetch('/api/pass/touch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: '{}',
        cache: 'no-store'
      });
      const data = (await res.json().catch(() => null)) as PassResponse | null;
      if (!res.ok && !data) {
        emit({ phase: 'hidden', available: false, error: 'pass request failed' });
        return;
      }
      applyPass({
        enabled: data?.enabled,
        available: data?.available,
        app: data?.app,
        pass: data?.pass ?? null,
        counter: data?.counter,
        paymentsReady: data?.paymentsReady,
        error: data?.error ?? null,
        authenticated: data?.authenticated ?? true
      });
      lastLoadedAt = Date.now();
    } catch {
      emit({ phase: snapshot.phase === 'idle' ? 'hidden' : snapshot.phase, error: 'network error' });
    }
  };

  inflight = run().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** Pi 로그인 결과에 토큰이 생기면 호출 — 토큰이 바뀌면 즉시 다시 읽는다. */
export function setPassToken(next: string | null) {
  if (next === token) return;
  token = next;
  lastLoadedAt = 0;
  if (!next) {
    applyPass({ pass: null, authenticated: false });
    void loadPass({ force: true });
    return;
  }
  void loadPass({ force: true });
}

/** 시트가 열려 있을 때만 부르는 가벼운 카운터 갱신(20초 간격) */
export async function refreshCounter(): Promise<void> {
  try {
    const res = await fetch('/api/pass/counter', { cache: 'no-store' });
    const data = (await res.json().catch(() => null)) as PassResponse | null;
    if (!data?.counter) return;
    emit({ counter: data.counter });
  } catch {
    /* 네트워크 실패는 다음 폴링에서 회복 */
  }
}

export function usePass(): PassSnapshot {
  return useSyncExternalStore(subscribePass, getPassSnapshot, () => INITIAL);
}

/** 현재 토큰(다른 컴포넌트가 결제 직후 강제 갱신할 때) */
export function currentPassToken(): string | null {
  return token;
}
