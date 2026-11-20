'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import PiAuthSheet from './PiAuthSheet';
import type { GateLang } from './pi-gate-i18n';

/**
 * Pi SDK 2.0 커넥터 + Pi 결제(pay) 파이프라인
 *  - Pi Browser 안에서만 실제 Pi KYC 인증(authenticate)과 결제(createPayment)를 시도한다.
 *  - 일반 웹 브라우저(크롬·사파리)에서는 아무 팝업/에러 없이 웹 체험 모드로 동작하고,
 *    pay()는 결제를 만들지 않고 안내 상태(mode: 'web')만 돌려준다.
 *  - 결제는 반드시 서버 경유로 승인·완료한다: /api/pi/approve → /api/pi/complete
 *    (서버 키 PI_API_KEY가 없으면 두 라우트가 sandbox-ready로 응답해 흐름이 끊기지 않는다.)
 *  - SDK 스크립트: https://sdk.minepi.com/pi-sdk.js (공식)
 *
 * 실행 권한 게이트(2026-11-15):
 *  - 읽기(페이지 열람·통계·안건·원장·관광 정보)는 누구나. 실행(투표·제안·청원·제보·결제)은
 *    Pi.authenticate로 KYC user가 붙은 상태에서만 통과한다.
 *  - 각 앱은 write 핸들러 첫 줄에서 requireAuth('액션명')을 부르고, 인증이 없으면 false를 받아
 *    로컬 상태를 건드리지 않고 전역 PiAuthSheet만 띄운다.
 */

export type PiStatus = 'detecting' | 'web' | 'sdk-ready' | 'connecting' | 'connected' | 'unavailable';

export type PiPaymentStatus = 'completed' | 'cancelled' | 'unavailable' | 'invalid' | 'error';

export interface PiPaymentResult {
  ok: boolean;
  status: PiPaymentStatus;
  /** 'pi-browser' = Pi 브라우저에서 시도, 'web' = 일반 브라우저(결제 미실행) */
  mode: 'pi-browser' | 'web';
  message: string;
  amount?: number;
  memo?: string;
  paymentId?: string;
  txid?: string;
  /** 서버가 PI_API_KEY 없이 sandbox-ready로 응답했는지 */
  sandboxReady?: boolean;
}

export interface PiContextValue {
  status: PiStatus;
  username: string | null;
  /** Pi가 발급한 사용자 uid (Pi.authenticate 결과). 서버 DB(pi_users)의 주 키와 같다. */
  uid: string | null;
  /** Pi accessToken — 서버(/api/pi/verify · /api/beom · /api/fact/vote · /api/hangang/bookmark)가 본인 확인에 쓴다. */
  accessToken: string | null;
  inPiBrowser: boolean;
  /** Pi.authenticate로 KYC 실명이 붙은 상태인가 (= 실행 권한 보유) */
  authenticated: boolean;
  connect: () => void;
  /**
   * 실행 권한 확인. 인증돼 있으면 true.
   * 인증이 없으면 false를 돌려주고 전역 안내 패널(읽기 전용)을 띄운다.
   * write 핸들러 첫 줄에서 `if (!requireAuth(label)) return;` 으로 쓴다.
   */
  requireAuth: (action?: string) => boolean;
  /** 안내 패널을 직접 연다 (읽기 전용 띠의 '인증 방법' 등) */
  openAuthSheet: () => void;
  /** 안내 패널 문구 언어 (10개국어) */
  gateLang: GateLang;
  setGateLang: (lang: GateLang) => void;
  /** Pi 결제 실행. Pi Browser 밖에서는 안내 상태만 반환한다. */
  pay: (amount: number, memo: string, metadata?: Record<string, unknown>) => Promise<PiPaymentResult>;
  /** 가장 최근 결제 결과 (UI 상태 표시용) */
  lastPayment: PiPaymentResult | null;
  /** 결제 진행 중 여부 */
  paying: boolean;
}

const PiContext = createContext<PiContextValue>({
  status: 'detecting',
  username: null,
  uid: null,
  accessToken: null,
  inPiBrowser: false,
  authenticated: false,
  connect: () => {},
  requireAuth: () => false,
  openAuthSheet: () => {},
  gateLang: 'KR',
  setGateLang: () => {},
  pay: async () => ({
    ok: false,
    status: 'unavailable',
    mode: 'web',
    message: 'Pi SDK is not ready.'
  }),
  lastPayment: null,
  paying: false
});

export const usePi = () => useContext(PiContext);

/** 테스트넷 결제를 쓰려면 Vercel 환경변수 NEXT_PUBLIC_PI_SANDBOX=true 로 설정한다. */
const PI_SANDBOX = (process.env.NEXT_PUBLIC_PI_SANDBOX || '').toLowerCase() === 'true';

type PiSdk = {
  init: (config: { version: string; sandbox?: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound?: (payment: unknown) => void
  ) => Promise<{ accessToken?: string; user?: { uid?: string; username?: string } }>;
  createPayment: (
    data: { amount: number; memo: string; metadata?: Record<string, unknown> },
    callbacks: {
      onReadyForServerApproval?: (paymentId: string) => void;
      onReadyForServerCompletion?: (paymentId: string, txid: string) => void;
      onCancel?: (paymentId: string) => void;
      onError?: (error: Error, payment?: unknown) => void;
    }
  ) => void;
};

const getPi = (): PiSdk | null => {
  if (typeof window === 'undefined') return null;
  const Pi = (window as unknown as { Pi?: PiSdk }).Pi;
  return Pi && typeof Pi.createPayment === 'function' ? Pi : null;
};

let piInited = false;

/** 서버 라우트 호출 공용 (approve · complete · incomplete) */
async function postPiServer(url: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; mode?: string; error?: string }
      | null;
    return { ok: res.ok, mode: data?.mode, error: data?.error, data };
  } catch (err) {
    return { ok: false, mode: undefined, error: err instanceof Error ? err.message : 'network error', data: null };
  }
}

export default function PiProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PiStatus>('detecting');
  const [username, setUsername] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [inPiBrowser, setInPiBrowser] = useState(false);
  const [lastPayment, setLastPayment] = useState<PiPaymentResult | null>(null);
  const [paying, setPaying] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [gateAction, setGateAction] = useState<string | null>(null);
  const [gateLang, setGateLangState] = useState<GateLang>('KR');
  const busy = useRef(false);
  const payingRef = useRef(false);

  /** 실행 권한: Pi.authenticate로 KYC user가 붙은 상태만 통과 */
  const authenticated = status === 'connected' && !!username;

  const requireAuth = useCallback(
    (action?: string) => {
      if (status === 'connected' && username) return true;
      setGateAction(action ?? null);
      setGateOpen(true);
      return false;
    },
    [status, username]
  );

  const openAuthSheet = useCallback(() => {
    setGateAction(null);
    setGateOpen(true);
  }, []);

  const setGateLang = useCallback((lang: GateLang) => {
    setGateLangState(lang);
  }, []);

  /** Pi.init 은 세션당 한 번. 인증·결제가 같은 설정을 공유한다. */
  const ensureInit = useCallback((Pi: PiSdk) => {
    if (piInited) return;
    try {
      Pi.init({ version: '2.0', sandbox: PI_SANDBOX });
      piInited = true;
    } catch (err) {
      console.warn('[Pi] init skipped:', err);
    }
  }, []);

  /** 미완료 결제는 서버에서 정리한다. PI_API_KEY가 없으면 서버가 sandbox-ready로 응답한다. */
  const clearIncomplete = useCallback(async (payment: unknown) => {
    const id = (payment as { identifier?: string } | null)?.identifier;
    if (typeof id !== 'string' || !id) return;
    await postPiServer('/api/pi/incomplete', { paymentId: id });
  }, []);

  const authenticate = useCallback(async () => {
    if (busy.current) return;
    if (typeof window === 'undefined') return;
    const Pi = getPi();
    if (!Pi || typeof Pi.authenticate !== 'function') return;

    busy.current = true;
    setStatus('connecting');
    try {
      ensureInit(Pi);
      const result = await Pi.authenticate(['username'], clearIncomplete);
      const name: string | null = result?.user?.username || null;
      const token: string | null = result?.accessToken || null;
      setUsername(name);
      setUid(result?.user?.uid || null);
      setAccessToken(token);
      setStatus(name ? 'connected' : 'sdk-ready');

      // 실DB 동기화: 서버가 Pi /v2/me 로 accessToken을 다시 검증하고 pi_users에 기록한다.
      // (실패해도 로그인·화면 동작은 그대로 — 각 앱은 localStorage로 계속 동작한다.)
      if (token) {
        void postPiServer('/api/pi/verify', { accessToken: token }).catch(() => undefined);
      }
    } catch (err) {
      // 사용자가 취소했거나, 앱이 아직 콘솔에서 도메인 승인 전인 경우 — 화면을 막지 않는다.
      console.warn('[Pi] authenticate skipped:', err);
      setStatus('sdk-ready');
    } finally {
      busy.current = false;
    }
  }, [ensureInit, clearIncomplete]);

  /**
   * pay(amount, memo, metadata?)
   *  - Pi Browser: window.Pi.createPayment → /api/pi/approve → /api/pi/complete
   *  - 일반 웹: 결제 없이 안내 상태 반환(화면 흐름은 그대로 유지)
   */
  const pay = useCallback(
    async (amount: number, memo: string, metadata?: Record<string, unknown>): Promise<PiPaymentResult> => {
      const rounded = Math.round(Number(amount) * 100) / 100;
      if (!Number.isFinite(rounded) || rounded <= 0) {
        const invalid: PiPaymentResult = {
          ok: false,
          status: 'invalid',
          mode: inPiBrowser ? 'pi-browser' : 'web',
          message: 'A positive Pi amount is required.'
        };
        setLastPayment(invalid);
        return invalid;
      }

      if (!inPiBrowser) {
        const web: PiPaymentResult = {
          ok: false,
          status: 'unavailable',
          mode: 'web',
          message: 'Pi payments work only inside the Pi Browser app.',
          amount: rounded,
          memo
        };
        setLastPayment(web);
        return web;
      }

      const Pi = getPi();
      if (!Pi) {
        const unavailable: PiPaymentResult = {
          ok: false,
          status: 'unavailable',
          mode: 'pi-browser',
          message: 'Pi SDK is still loading. Please try again in a moment.',
          amount: rounded,
          memo
        };
        setLastPayment(unavailable);
        return unavailable;
      }

      if (payingRef.current) {
        return {
          ok: false,
          status: 'error',
          mode: 'pi-browser',
          message: 'A payment is already in progress.',
          amount: rounded,
          memo
        };
      }

      ensureInit(Pi);
      payingRef.current = true;
      setPaying(true);

      const result = await new Promise<PiPaymentResult>((resolve) => {
        let settled = false;
        let sandboxReady = false;
        let currentId: string | undefined;

        const finish = (value: PiPaymentResult) => {
          if (settled) return;
          settled = true;
          const finalValue = { ...value, amount: rounded, memo, sandboxReady: value.sandboxReady ?? sandboxReady };
          setLastPayment(finalValue);
          setPaying(false);
          payingRef.current = false;
          resolve(finalValue);
        };

        try {
          Pi.createPayment(
            { amount: rounded, memo: memo.slice(0, 200), ...(metadata ? { metadata } : {}) },
            {
              onReadyForServerApproval: async (paymentId: string) => {
                currentId = paymentId;
                const res = await postPiServer('/api/pi/approve', { paymentId });
                if (res.mode === 'sandbox-ready') sandboxReady = true;
                if (!res.ok) {
                  finish({
                    ok: false,
                    status: 'error',
                    mode: 'pi-browser',
                    message: res.error || 'Server approval failed.',
                    paymentId
                  });
                }
              },
              onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                currentId = paymentId;
                const res = await postPiServer('/api/pi/complete', { paymentId, txid });
                if (res.mode === 'sandbox-ready') sandboxReady = true;
                finish({
                  ok: res.ok,
                  status: res.ok ? 'completed' : 'error',
                  mode: 'pi-browser',
                  message: res.ok ? 'Pi payment completed.' : res.error || 'Server completion failed.',
                  paymentId,
                  txid
                });
              },
              onCancel: (paymentId: string) => {
                finish({
                  ok: false,
                  status: 'cancelled',
                  mode: 'pi-browser',
                  message: 'Payment cancelled by the user.',
                  paymentId
                });
              },
              onError: (error: Error) => {
                finish({
                  ok: false,
                  status: 'error',
                  mode: 'pi-browser',
                  message: error?.message || 'Pi payment failed.',
                  paymentId: currentId
                });
              }
            }
          );
        } catch (err) {
          finish({
            ok: false,
            status: 'error',
            mode: 'pi-browser',
            message: err instanceof Error ? err.message : 'Pi payment failed.',
            paymentId: currentId
          });
        }
      });

      return result;
    },
    [inPiBrowser, ensureInit]
  );

  useEffect(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isPiBrowser = /PiBrowser/i.test(ua);
    setInPiBrowser(isPiBrowser);

    if (!isPiBrowser) {
      setStatus('web');
      return;
    }

    // Pi Browser: SDK가 붙는 즉시 init → authenticate
    let tries = 0;
    const timer = setInterval(() => {
      if (getPi()) {
        clearInterval(timer);
        setStatus('sdk-ready');
        authenticate();
      } else if (++tries > 40) {
        clearInterval(timer);
        setStatus('unavailable');
      }
    }, 250);
    return () => clearInterval(timer);
  }, [authenticate]);

  const connect = useCallback(() => {
    if (inPiBrowser) authenticate();
  }, [inPiBrowser, authenticate]);

  return (
    <PiContext.Provider
      value={{
        status,
        username,
        uid,
        accessToken,
        inPiBrowser,
        authenticated,
        connect,
        requireAuth,
        openAuthSheet,
        gateLang,
        setGateLang,
        pay,
        lastPayment,
        paying
      }}
    >
      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />
      {children}
      <PiAuthSheet
        open={gateOpen}
        lang={gateLang}
        action={gateAction}
        inPiBrowser={inPiBrowser}
        connecting={status === 'connecting'}
        onConnect={connect}
        onClose={() => setGateOpen(false)}
      />
    </PiContext.Provider>
  );
}
