'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePi } from './PiProvider';

/**
 * 상단 상태 배지 + Pi 연결 안내 패널
 *  - Pi Browser + KYC 인증 완료: 🟢 π KYC @username
 *  - 일반 웹 브라우저: ⚪ π Pi 연결 → 누르면 Pi Browser 안내(에러·팝업 없이 웹 체험 유지)
 *  - 안내 패널은 portal로 body에 붙여, sticky·blur 네비게이션 안에서도 화면 기준으로 뜬다.
 */
export default function PiBadge({ en = false, className = '' }: { en?: boolean; className?: string }) {
  const { status, username, inPiBrowser, connect } = usePi();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  const connected = status === 'connected' && !!username;

  const dot = connected
    ? 'bg-green-500'
    : status === 'connecting'
      ? 'bg-amber-400 animate-pulse'
      : status === 'unavailable'
        ? 'bg-[#dc2626]'
        : 'bg-gray-300';

  const label = connected
    ? `KYC @${username}`
    : status === 'connecting'
      ? (en ? 'linking' : 'Pi 연결 중')
      : (en ? 'Pi connect' : 'Pi 연결');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://kedheon.com${window.location.pathname}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const sheet = (
    <div
      className="fixed inset-0 z-[3000] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl border-2 border-black p-4 md:p-5 space-y-3 text-left shadow-2xl font-black"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-black text-sm md:text-base font-black">
              {connected
                ? (en ? 'Pi KYC identity connected' : 'Pi KYC 실명 인증 연결됨')
                : (en ? 'Connect your Pi account' : 'Pi 계정 연결')}
            </h3>
            <p className="text-gray-400 text-[11px] md:text-xs font-bold mt-0.5 break-all">
              {connected
                ? `@${username}`
                : inPiBrowser
                  ? (en ? 'Pi Browser detected — authenticate with Pi to earn your vote.' : 'Pi Browser가 감지되었습니다. Pi 인증으로 1인 1표 권한을 받으세요.')
                  : (en ? 'Pi identity connects only inside the Pi Browser app.' : 'Pi 인증은 Pi Browser 앱 안에서만 연결됩니다.')}
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="close"
            className="shrink-0 w-8 h-8 rounded-full border border-black/10 text-black text-sm font-black hover:bg-gray-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {connected ? (
          <div className="bg-gray-50 border border-black/10 rounded-xl p-3 space-y-1">
            <p className="text-[11px] md:text-xs font-black text-black">
              🟢 {en ? 'KYC verified' : 'KYC 인증됨'} <span translate="no" className="notranslate text-[#7d4698]">@{username}</span>
            </p>
            <p className="text-[11px] md:text-xs text-gray-500 font-bold leading-relaxed">
              {en
                ? 'Votes and media reports are tied to this verified identity — one person, one vote.'
                : '투표와 언론 제보가 이 실명 계정에 귀속됩니다. 1인 1표 원칙이 적용됩니다.'}
            </p>
          </div>
        ) : inPiBrowser ? (
          <button
            onClick={() => connect()}
            className="w-full bg-[#dc2626] hover:bg-black text-white font-black py-3 rounded-xl text-xs md:text-sm transition-all active:scale-95 cursor-pointer"
          >
            {status === 'connecting' ? (en ? 'Connecting…' : 'Pi 인증 진행 중…') : (en ? 'Authenticate with Pi' : 'Pi로 KYC 인증하기')}
          </button>
        ) : (
          <>
            <ol className="text-[11px] md:text-xs text-gray-600 font-bold space-y-1 list-decimal list-inside">
              <li>{en ? 'Open the Pi Browser app on your phone.' : '폰에서 Pi Browser 앱을 엽니다.'}</li>
              <li>{en ? 'Enter the address below.' : '아래 주소를 입력합니다.'}</li>
              <li>{en ? 'Sign in with Pi and allow the KYC connection.' : 'Pi 로그인 후 KYC 연결을 승인합니다.'}</li>
            </ol>
            <div className="bg-gray-50 border border-black/10 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <code translate="no" className="notranslate text-[11px] md:text-xs font-mono text-black break-all">kedheon.com{window.location.pathname}</code>
              <button
                onClick={copyLink}
                className="shrink-0 px-2 py-1 rounded-lg border border-black text-[11px] font-black bg-white text-black hover:bg-black hover:text-white transition-all"
              >
                {copied ? (en ? 'copied' : '복사됨') : (en ? 'copy' : '복사')}
              </button>
            </div>
            <p className="text-[10px] md:text-[11px] text-gray-400 font-bold leading-relaxed">
              {en
                ? 'Everything else works right here in your browser — KYC linking is optional.'
                : 'KYC 연결 전에도 이 화면의 기능은 그대로 사용할 수 있습니다. 웹 체험 모드입니다.'}
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!connected && inPiBrowser) connect();
          setOpen(true);
        }}
        aria-label={connected ? `Pi KYC ${username}` : 'Pi connect'}
        className={`shrink-0 flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-lg px-1.5 py-1 text-[10px] md:text-[11px] font-black text-black hover:border-black transition-colors cursor-pointer ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-[#7d4698] leading-none">π</span>
        <span translate="no" className={`notranslate truncate leading-none ${connected ? 'max-w-[70px] md:max-w-[130px]' : ''}`}>
          {label}
        </span>
      </button>

      {mounted && open ? createPortal(sheet, document.body) : null}
    </>
  );
}
