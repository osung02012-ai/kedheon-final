'use client';

import React, { useEffect, useState } from 'react';
import { usePi } from './PiProvider';
import PassSheet from './PassSheet';
import { passT, type PassLang } from './pass-i18n';
import { loadPass, setPassToken, usePass } from './passStore';

/**
 * PassBadge — 상단 헤더의 Kedheon.pi Pass 배지 (PiBadge 왼쪽)
 *
 *  상태 4가지:
 *    1) 패스 없음(비로그인·미발급)  → 회색 `π PASS 시작`
 *    2) 사용 중                      → 검정 `Genesis #0042 · D-23` (빨강 점)
 *    3) 만료                        → `Genesis #0042 · 만료`
 *    4) 서버가 패스를 끈 상태        → 아무것도 그리지 않는다(기존 헤더 폭 유지)
 *
 *  로그인 토큰이 생기면 pass_touch로 계정·회원번호·만료일을 받아 온다.
 *  배지는 3앱 헤더에 모두 있으므로 이 컴포넌트 하나로 동기화가 끝난다.
 */

export default function PassBadge({
  lang,
  app,
  className = ''
}: {
  lang: PassLang;
  app: 'kedheon' | 'factfilter' | 'hangang';
  className?: string;
}) {
  const { accessToken } = usePi();
  const snap = usePass();
  const [open, setOpen] = useState(false);

  // 토큰이 바뀌면(로그인/로그아웃) 서버 상태를 다시 읽는다.
  useEffect(() => {
    setPassToken(accessToken);
  }, [accessToken]);

  // 첫 방문: 토큰이 없어도 카운터는 읽어 둔다(시트에서 바로 보여 주기 위해).
  useEffect(() => {
    void loadPass();
  }, []);

  if (snap.phase === 'hidden' || !snap.available) return null;

  const pass = snap.pass;
  const active = Boolean(pass?.active);
  const t = (key: Parameters<typeof passT>[1], vars?: Record<string, string | number>) => passT(lang, key, vars);

  const label = !pass
    ? t('badgeStart')
    : active
      ? `${pass.badge} · D-${pass.daysLeft}`
      : pass.badge;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('title')}
        className={`shrink-0 flex items-center gap-1 rounded-lg px-1.5 py-1 t-tag transition-colors cursor-pointer ${
          active ? 'bg-black text-white hover:bg-neutral-800' : 'bg-neutral-100 text-black hover:bg-neutral-200'
        } ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#DC2626]' : 'bg-gray-300'}`} />
        <span translate="no" className="notranslate text-[#7d4698] leading-none">π</span>
        <span translate="no" className="notranslate truncate leading-none max-w-[86px] md:max-w-[150px]">
          {snap.phase === 'loading' ? '···' : label}
        </span>
      </button>

      <PassSheet open={open} onClose={() => setOpen(false)} lang={lang} app={app} showExport={app === 'kedheon'} />
    </>
  );
}
