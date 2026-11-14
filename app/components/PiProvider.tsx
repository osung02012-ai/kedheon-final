'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Script from 'next/script';

/**
 * Pi SDK 2.0 커넥터
 *  - Pi Browser 안에서만 실제 Pi KYC 인증(authenticate)을 시도한다.
 *  - 일반 웹 브라우저(크롬·사파리)에서는 아무 팝업/에러 없이 웹 체험 모드로 동작한다.
 *  - SDK 스크립트: https://sdk.minepi.com/pi-sdk.js (공식)
 */

type PiStatus = 'detecting' | 'web' | 'sdk-ready' | 'connecting' | 'connected' | 'unavailable';

interface PiContextValue {
  status: PiStatus;
  username: string | null;
  inPiBrowser: boolean;
  connect: () => void;
}

const PiContext = createContext<PiContextValue>({
  status: 'detecting',
  username: null,
  inPiBrowser: false,
  connect: () => {}
});

export const usePi = () => useContext(PiContext);

let piInited = false;

/** SDK가 요구하는 콜백 자리. 결제 기능은 아직 쓰지 않으므로 기록만 남긴다. */
const onIncompletePaymentFound = (payment: unknown) => {
  console.log('[Pi] incomplete payment found', payment);
};

export default function PiProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PiStatus>('detecting');
  const [username, setUsername] = useState<string | null>(null);
  const [inPiBrowser, setInPiBrowser] = useState(false);
  const busy = useRef(false);

  const authenticate = useCallback(async () => {
    if (busy.current) return;
    if (typeof window === 'undefined') return;
    const Pi = (window as unknown as { Pi?: any }).Pi;
    if (!Pi || typeof Pi.authenticate !== 'function') return;

    busy.current = true;
    setStatus('connecting');
    try {
      if (!piInited) {
        Pi.init({ version: '2.0', sandbox: false });
        piInited = true;
      }
      const result = await Pi.authenticate(['username'], onIncompletePaymentFound);
      const name: string | null = result?.user?.username || null;
      setUsername(name);
      setStatus(name ? 'connected' : 'sdk-ready');
    } catch (err) {
      // 사용자가 취소했거나, 앱이 아직 콘솔에서 도메인 승인 전인 경우 — 화면을 막지 않는다.
      console.warn('[Pi] authenticate skipped:', err);
      setStatus('sdk-ready');
    } finally {
      busy.current = false;
    }
  }, []);

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
      if ((window as unknown as { Pi?: unknown }).Pi) {
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
    <PiContext.Provider value={{ status, username, inPiBrowser, connect }}>
      <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="afterInteractive" />
      {children}
    </PiContext.Provider>
  );
}
