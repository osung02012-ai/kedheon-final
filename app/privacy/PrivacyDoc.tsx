'use client';

import { useEffect, useState } from 'react';

/**
 * 개인정보 처리방침 — Kedheon.pi 연계 앱 공통 (한국어 / English)
 *
 * Pi Next 해커톤·메인넷 리스팅 요건 1단계 문서.
 *  - 디자인은 6개 앱과 동일한 BNPi 기준: 화이트/블랙 + 레드(#DC2626),
 *    px 고정 타이포(t-hero·t-section·t-card·t-body·t-tag)만 사용한다.
 *  - Pi Browser 글자 배율 보정은 globals.css 의 --pi-scale 이 이미 처리한다.
 *  - 서브도메인(factfilter.kedheon.com 등)에서도 /privacy 는 미들웨어가
 *    리라이트하지 않고 그대로 서빙하므로 어느 앱에서 눌러도 같은 문서가 열린다.
 */

type Lang = 'ko' | 'en';

type Block =
  | { type: 'p'; text: string }
  | { type: 'li'; text: string }
  | { type: 'note'; text: string };

type Section = { title: string; blocks: Block[] };

const UPDATED = '2026-11-23';

const KO_SECTIONS: Section[] = [
  {
    title: '1. 적용 범위',
    blocks: [
      {
        type: 'p',
        text: '이 방침은 Kedheon이 운영하는 Kedheon.pi 연계 앱 전체에 공통 적용됩니다.',
      },
      {
        type: 'li',
        text: 'Kedheon — kedheon.com',
      },
      {
        type: 'li',
        text: 'Civil — civil.kedheon.com',
      },
      {
        type: 'li',
        text: 'FactFilter — factfilter.kedheon.com',
      },
      {
        type: 'li',
        text: 'Hangang — hangang.kedheon.com',
      },
      {
        type: 'li',
        text: 'XAEA12 — xaea12.kedheon.com',
      },
      {
        type: 'li',
        text: 'Vendor — vendor.kedheon.com',
      },
      {
        type: 'p',
        text: 'Pi Browser와 Pi Network 자체의 정보 처리에는 Pi Network의 개인정보 방침이 적용됩니다.',
      },
    ],
  },
  {
    title: '2. 수집하는 정보',
    blocks: [
      {
        type: 'li',
        text: 'Pi Network 인증 정보 — Pi SDK 인증 시 Pi Network가 앱에 전달하는 공개 식별자(uid)와 사용자 이름(username). KYC 결과나 실명은 앱에 전달되지 않습니다.',
      },
      {
        type: 'li',
        text: '결제 정보 — Pi 결제 진행 시 결제 식별자(트랜잭션 ID), 결제 금액·통화·상태. 실제 결제는 Pi Network가 처리하며 앱은 카드·계좌 정보를 받지 않습니다.',
      },
      {
        type: 'li',
        text: 'Kedheon.pi Pass 정보 — Pi 사용자 이름(username), 앱별 Pi uid, 회원번호·등급(창립·얼리·멤버·배지), 이용권 만료일과 부여 경로, 견적·결제 식별자(paymentId)·트랜잭션 ID(txid)·금액·상태·결제한 앱. 이 값은 이용권 부여·갱신·만료 판정과 중복 결제 방지, 분쟁 대응에만 씁니다. KYC 결과나 실명을 당사가 별도로 받거나 다시 검증하지 않습니다.',
      },
      {
        type: 'li',
        text: '접속 통계 — 페이지 방문 수, 유입 경로, 국가·기기·브라우저 종류 등 개인을 식별하지 않는 집계값(Vercel Web Analytics, 쿠키 미사용).',
      },
      {
        type: 'li',
        text: '브라우저 로컬 저장소(localStorage) — 선택한 언어, 화면 상태, 비로그인 상태의 BEOM 포인트·투표·북마크. Pi로 로그인한 경우 BEOM 포인트·팩트체크 투표·한강 북마크는 Pi uid 기준으로 당사 서버 DB(서울 리전 Supabase)에 저장되며, 비로그인 상태의 값만 사용자의 브라우저(localStorage)에 저장됩니다.',
      },
      {
        type: 'li',
        text: '이용자가 직접 입력한 내용 — 제보·청원·게시글·문의와 그 작성 시각.',
      },
      {
        type: 'note',
        text: '수집하지 않는 정보: 실명, 주민등록번호, 여권번호, 비밀번호, Pi 24단어 비밀구절(passphrase), 지갑 개인키, 신용카드 번호. 앱은 Pi 지갑의 서명 권한이나 자산 이동 권한을 요구하지 않으며, 위치 정보도 이용자가 직접 선택하지 않는 한 수집하지 않습니다.',
      },
    ],
  },
  {
    title: '3. 이용 목적',
    blocks: [
      { type: 'li', text: '앱 기능 제공 — 로그인 상태 유지, KYC 국가 기준 투표·제보, 포인트(BEOM) 집계, 결제 확인.' },
      { type: 'li', text: '어뷰징 방지 — 중복 투표·다중 계정·비정상 요청 차단, 원장 무결성 유지.' },
      { type: 'li', text: '유틸리티 집계 — 국가별 참여 수, 방문 추이 등 개인을 식별하지 않는 통계 산출.' },
      { type: 'li', text: '문의 응대와 서비스 공지.' },
      {
        type: 'p',
        text: '위 목적 외로 이용하지 않으며, 개인 프로파일링이나 맞춤 광고에 사용하지 않습니다.',
      },
    ],
  },
  {
    title: '4. 보관 기간과 파기',
    blocks: [
      {
        type: 'li',
        text: '서버에 저장되는 정보는 수집 목적을 달성하면 또는 이용자가 삭제를 요청하면 지체 없이 파기합니다.',
      },
      {
        type: 'li',
        text: '원장에 기록된 제보·투표는 무결성 유지를 위해 개인 식별자와 분리한 집계값만 보관합니다.',
      },
      {
        type: 'li',
        text: '브라우저 localStorage 값은 브라우저 저장소를 지우거나 앱 데이터를 초기화하면 즉시 사라집니다. 서버에 저장된 BEOM 포인트·투표·북마크 기록은 로그아웃 후에도 유지되며, 문의처로 삭제를 요청하면 지체 없이 파기합니다.',
      },
      {
        type: 'li',
        text: '접속 통계는 개별 식별이 불가능한 집계 형태로만 보관하고, 전자적 파일은 복구할 수 없는 방법으로 삭제합니다.',
      },
      {
        type: 'li',
        text: '이용권 정보는 만료 후에도 부여·환불·분쟁 대응이 가능한 기간 동안 보관하며, 회계·전자상거래 법령상 보존 의무가 있는 결제 기록은 해당 기간 동안 최소한으로 분리 보관합니다. 이용자가 삭제를 요청하면 보존 의무가 있는 기록을 제외하고 파기합니다.',
      },
    ],
  },
  {
    title: '5. 제3자 제공 및 처리 위탁',
    blocks: [
      {
        type: 'p',
        text: '앱은 이용자의 개인정보를 판매하거나 제3자에게 제공하지 않습니다.',
      },
      {
        type: 'li',
        text: 'Pi Network — Pi 인증과 결제 처리.',
      },
      {
        type: 'li',
        text: 'Supabase(서울 리전) — BEOM 포인트·투표·북마크 등 앱 데이터의 저장과 Pi 인증 연동. 데이터는 서울 리전에 보관합니다.',
      },
      {
        type: 'li',
        text: 'Vercel Inc. — 웹 호스팅과 쿠키 없는 익명 접속 통계.',
      },
      {
        type: 'li',
        text: 'GitHub — 소스 저장소 운영(이용자 개인정보 미포함).',
      },
      {
        type: 'p',
        text: '법령에 따라 수사기관 등이 적법한 절차로 요구하는 경우에는 그 범위에서만 제공할 수 있습니다.',
      },
    ],
  },
  {
    title: '6. 이용자의 권리',
    blocks: [
      {
        type: 'p',
        text: '이용자는 언제든지 자신의 정보에 대해 열람·정정·삭제·처리 정지를 요청할 수 있습니다. 아래 문의처로 보내주시면 확인 후 30일 이내에 처리합니다.',
      },
      {
        type: 'p',
        text: '브라우저 설정에서 localStorage를 지우거나 Pi Browser의 앱 데이터를 초기화하면 기기에 저장된 기록을 직접 삭제할 수 있습니다. 서버에 저장된 기록의 삭제는 아래 문의처로 요청해 주시면 확인 후 30일 이내에 처리합니다.',
      },
    ],
  },
  {
    title: '7. 쿠키 및 유사 기술',
    blocks: [
      {
        type: 'p',
        text: '앱은 광고·추적 쿠키를 사용하지 않습니다. 접속 통계는 쿠키 없는 익명 집계이며, localStorage는 화면 상태 유지에만 사용합니다. 로그인 상태에서 남긴 BEOM 포인트·투표·북마크는 쿠키가 아니라 서버 DB에 저장됩니다.',
      },
    ],
  },
  {
    title: '8. 아동의 개인정보',
    blocks: [
      {
        type: 'p',
        text: '앱은 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 의도적으로 수집하지 않습니다.',
      },
    ],
  },
  {
    title: '9. 방침의 변경',
    blocks: [
      {
        type: 'p',
        text: '방침이 바뀌면 시행일 7일 전부터 이 페이지에 게시합니다. 중요한 변경은 앱 화면 공지로 함께 알립니다.',
      },
    ],
  },
  {
    title: '10. 문의처',
    blocks: [
      { type: 'li', text: '운영 — Kedheon' },
      { type: 'li', text: '이메일 — osung02012@gmail.com' },
      { type: 'li', text: '앱 — kedheon.com 및 위 서브도메인 전체' },
    ],
  },
];

const EN_SECTIONS: Section[] = [
  {
    title: '1. Scope',
    blocks: [
      {
        type: 'p',
        text: 'This policy applies to all Kedheon.pi linked apps operated by Kedheon.',
      },
      { type: 'li', text: 'Kedheon — kedheon.com' },
      { type: 'li', text: 'Civil — civil.kedheon.com' },
      { type: 'li', text: 'FactFilter — factfilter.kedheon.com' },
      { type: 'li', text: 'Hangang — hangang.kedheon.com' },
      { type: 'li', text: 'XAEA12 — xaea12.kedheon.com' },
      { type: 'li', text: 'Vendor — vendor.kedheon.com' },
      {
        type: 'p',
        text: 'Data processed by Pi Browser and Pi Network itself is governed by the Pi Network privacy policy.',
      },
    ],
  },
  {
    title: '2. Information we collect',
    blocks: [
      {
        type: 'li',
        text: 'Pi Network authentication — the public identifier (uid) and username that Pi Network passes to the app when you sign in. KYC results and legal names are never passed to the app.',
      },
      {
        type: 'li',
        text: 'Payment data — when you pay with Pi, a payment identifier (transaction ID) together with the amount, currency and status. Payments are processed by Pi Network; the app never receives card or bank details.',
      },
      {
        type: 'li',
        text: 'Kedheon.pi Pass data — your Pi username, the per-app Pi uid, member number and tier (Genesis, Early, Member, badge), pass expiry and how it was granted, plus quote and payment identifiers (paymentId), transaction ID (txid), amount, status and the app that paid. We use these only to grant, renew and expire your pass, prevent duplicate payments and handle disputes. We do not receive or re-verify KYC results or legal names.',
      },
      {
        type: 'li',
        text: 'Usage statistics — page views, referral sources, country, device and browser type, in anonymous aggregate form (Vercel Web Analytics, no cookies).',
      },
      {
        type: 'li',
        text: 'Browser local storage (localStorage) — your language choice, screen state, and BEOM points, votes and bookmarks while you are signed out. For signed-in Pi users, BEOM points, FactFilter votes and Hangang bookmarks are stored in our server database (Supabase, Seoul region) keyed by your Pi uid; only unauthenticated state stays in your browser’s localStorage.',
      },
      {
        type: 'li',
        text: 'Content you enter — reports, petitions, posts, inquiries and the time they were submitted.',
      },
      {
        type: 'note',
        text: 'What we never collect: legal name, resident registration number, passport number, password, your 24-word Pi passphrase, wallet private keys, or card numbers. The app never asks for signing authority over your Pi wallet or permission to move your assets, and it does not collect location data unless you select it yourself.',
      },
    ],
  },
  {
    title: '3. Why we use it',
    blocks: [
      { type: 'li', text: 'To provide the apps — keeping you signed in, country-based voting and reporting, BEOM point aggregation, payment confirmation.' },
      { type: 'li', text: 'To prevent abuse — blocking duplicate votes, multi-account activity and abnormal requests, and keeping the ledgers intact.' },
      { type: 'li', text: 'To measure utility — participation counts by country and visit trends, in a form that does not identify anyone.' },
      { type: 'li', text: 'To answer your inquiries and post service notices.' },
      {
        type: 'p',
        text: 'We do not use your information for any other purpose, and never for profiling or targeted advertising.',
      },
    ],
  },
  {
    title: '4. Retention and deletion',
    blocks: [
      {
        type: 'li',
        text: 'Information stored on our servers is deleted without delay once its purpose is served or when you ask us to delete it.',
      },
      {
        type: 'li',
        text: 'Reports and votes recorded in the ledgers are kept only as aggregates separated from personal identifiers, so that the ledgers stay verifiable.',
      },
      {
        type: 'li',
        text: 'Values in localStorage disappear as soon as you clear your browser storage or reset the app data. Records stored on our servers — BEOM points, votes and bookmarks — persist across sign-out and are deleted without delay once you request deletion through the contact address below.',
      },
      {
        type: 'li',
        text: 'Usage statistics are kept only in aggregate form that cannot identify an individual, and electronic files are erased in a way that cannot be recovered.',
      },
      {
        type: 'li',
        text: 'Pass records are kept while they are needed for granting, refunds and dispute handling, and payment records subject to accounting or e-commerce retention duties are kept separately for the minimum required period. If you request deletion, we delete everything except records we must retain by law.',
      },
    ],
  },
  {
    title: '5. Sharing with third parties',
    blocks: [
      {
        type: 'p',
        text: 'We do not sell or share your personal information with third parties.',
      },
      { type: 'li', text: 'Pi Network — authentication and payment processing.' },
      {
        type: 'li',
        text: 'Supabase (Seoul region) — storage of app data such as BEOM points, votes and bookmarks, and Pi sign-in integration. Data is kept in the Seoul region.',
      },
      { type: 'li', text: 'Vercel Inc. — web hosting and cookie-free anonymous analytics.' },
      { type: 'li', text: 'GitHub — source repository hosting (contains no user personal data).' },
      {
        type: 'p',
        text: 'We may disclose information only to the extent required by law through lawful procedures such as a request from an investigative authority.',
      },
    ],
  },
  {
    title: '6. Your rights',
    blocks: [
      {
        type: 'p',
        text: 'You may ask at any time to access, correct, delete or stop the processing of your information. Contact us at the address below and we will respond within 30 days.',
      },
      {
        type: 'p',
        text: 'You can also delete the records kept on your device yourself by clearing localStorage in your browser settings or resetting the app data in Pi Browser. To delete records stored on our servers, contact us at the address below and we will handle it within 30 days.',
      },
    ],
  },
  {
    title: '7. Cookies and similar technologies',
    blocks: [
      {
        type: 'p',
        text: 'The apps use no advertising or tracking cookies. Usage statistics are cookie-free and anonymous, and localStorage is used only to keep your screen state. When you are signed in, BEOM points, votes and bookmarks are stored in our server database, not in cookies.',
      },
    ],
  },
  {
    title: '8. Children',
    blocks: [
      {
        type: 'p',
        text: 'The apps are not directed to children under 14 and do not knowingly collect children’s personal information.',
      },
    ],
  },
  {
    title: '9. Changes to this policy',
    blocks: [
      {
        type: 'p',
        text: 'If this policy changes, we will post the new version on this page at least 7 days before it takes effect. Significant changes are also announced in the apps.',
      },
    ],
  },
  {
    title: '10. Contact',
    blocks: [
      { type: 'li', text: 'Operator — Kedheon' },
      { type: 'li', text: 'Email — osung02012@gmail.com' },
      { type: 'li', text: 'Apps — kedheon.com and the subdomains listed above' },
    ],
  },
];

export default function PrivacyDoc() {
  const [lang, setLang] = useState<Lang>('ko');

  // 다른 앱들과 같이 문서 언어를 선택 언어에 맞춘다(브라우저 자동번역 오작동 방지).
  useEffect(() => {
    document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
  }, [lang]);

  const sections = lang === 'ko' ? KO_SECTIONS : EN_SECTIONS;
  const ko = lang === 'ko';

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-black font-sans w-full pb-10 selection:bg-red-50 overflow-x-hidden break-keep">
      {/* ── 상단 바 ─────────────────────────────────────────── */}
      <nav className="w-full max-w-3xl sticky top-0 bg-white/95 backdrop-blur-md z-[500] border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-black bg-black flex items-center justify-center shrink-0">
              <span className="text-white t-tag" translate="no">K</span>
            </div>
            <div className="leading-tight min-w-0">
              <span className="notranslate t-brand text-black italic uppercase truncate block" translate="no">Kedheon</span>
              <span className="block text-gray-400 t-tag font-mono uppercase whitespace-nowrap" translate="no">Privacy Policy</span>
            </div>
          </div>
          <a
            href="/"
            className="shrink-0 t-tag px-2.5 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            ← {ko ? '홈으로 돌아가기' : 'Back to home'}
          </a>
        </div>
      </nav>

      <main className="w-full max-w-3xl px-4 py-4">
        {/* ── 제목 + 언어 전환 ───────────────────────────────── */}
        <section className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-[var(--card-shadow)] overflow-hidden px-4 py-3 sm:px-6 sm:py-5">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 text-left">
              <p className="t-tag font-mono text-[#dc2626] uppercase" translate="no">
                Kedheon.pi linked apps
              </p>
              <h1 className="t-hero text-black mt-0.5">
                {ko ? '개인정보 처리방침' : 'Privacy Policy'}
              </h1>
              <p className="text-gray-500 t-sub mt-1">
                {ko
                  ? 'Kedheon · Civil · FactFilter · Hangang · XAEA12 · Vendor 공통'
                  : 'Common to Kedheon · Civil · FactFilter · Hangang · XAEA12 · Vendor'}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-1 bg-neutral-100 rounded-lg p-0.5" role="group" aria-label="Language">
              <button
                type="button"
                onClick={() => setLang('ko')}
                className={`t-tag px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  ko ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
                }`}
              >
                한국어
              </button>
              <button
                type="button"
                translate="no"
                onClick={() => setLang('en')}
                className={`notranslate t-tag px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  !ko ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="t-tag px-2 py-0.5 rounded border border-neutral-200 text-neutral-600">
              {ko ? '시행일' : 'Effective'} <span translate="no" className="notranslate font-mono">{UPDATED}</span>
            </span>
            <span className="t-tag px-2 py-0.5 rounded border border-neutral-200 text-neutral-600">
              {ko ? '최종 개정' : 'Last revised'} <span translate="no" className="notranslate font-mono">{UPDATED}</span>
            </span>
          </div>
        </section>

        {/* ── 요약 ─────────────────────────────────────────── */}
        <section className="mt-3 bg-neutral-50 rounded-2xl border-l-[3px] border-[#dc2626] px-4 py-3 text-left">
          <p className="t-card text-black">
            {ko ? '한 줄 요약' : 'In one line'}
          </p>
          <p className="text-neutral-600 t-body mt-1">
            {ko
              ? '앱은 Pi 인증의 공개 아이디와 결제 트랜잭션 ID, 익명 접속 통계를 다룹니다. Pi로 로그인하면 BEOM 포인트·팩트체크 투표·한강 북마크가 Pi uid 기준으로 당사 서버 DB(서울 리전 Supabase)에 저장됩니다. 실명·비밀번호·Pi 24단어 비밀구절은 받지 않고, 개인정보를 팔거나 제3자에게 넘기지 않습니다.'
              : 'The apps handle your public Pi ID, payment transaction IDs and anonymous usage statistics. When you sign in with Pi, your BEOM points, FactFilter votes and Hangang bookmarks are stored in our server database (Supabase, Seoul region) keyed by your Pi uid. We never receive your legal name, password or 24-word Pi passphrase, and we do not sell or share your data.'}
          </p>
        </section>

        {/* ── 본문 ─────────────────────────────────────────── */}
        <div className="mt-3 space-y-3">
          {sections.map(section => (
            <section
              key={section.title}
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[var(--card-shadow)] px-4 py-3.5 sm:px-5 text-left"
            >
              <h2 className="t-section text-black">{section.title}</h2>
              <div className="mt-2 space-y-1.5">
                {section.blocks.map((block, i) => {
                  if (block.type === 'li') {
                    return (
                      <p key={i} className="text-neutral-700 t-body flex gap-1.5">
                        <span className="text-[#dc2626] shrink-0">·</span>
                        <span className="min-w-0">{block.text}</span>
                      </p>
                    );
                  }
                  if (block.type === 'note') {
                    return (
                      <p
                        key={i}
                        className="t-body text-neutral-800 bg-red-50/70 border border-[#dc2626]/25 rounded-xl px-3 py-2 mt-2"
                      >
                        {block.text}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="text-neutral-600 t-body">
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ── 문의 안내 ─────────────────────────────────────── */}
        <section className="mt-3 bg-black rounded-2xl px-4 py-4 text-left">
          <h2 className="text-white t-section border-l-4 border-white pl-3">
            {ko ? '문의' : 'Contact'}
          </h2>
          <p className="text-white/70 t-sub mt-2">
            {ko
              ? '개인정보 열람·정정·삭제 요청이나 문의는 아래 주소로 보내주세요.'
              : 'Send access, correction or deletion requests and any questions to the address below.'}
          </p>
          <a
            href="mailto:osung02012@gmail.com"
            className="inline-block mt-2 t-btn bg-[#dc2626] text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            osung02012@gmail.com
          </a>
        </section>

        <p className="text-center text-gray-400 t-tag mt-5 mb-2">
          <span translate="no" className="notranslate">Kedheon</span> · <span translate="no" className="notranslate">kedheon.com</span> · {ko ? '개인정보 처리방침' : 'Privacy Policy'} · {UPDATED}
        </p>

        <div className="flex justify-center mt-2">
          <a
            href="/"
            className="t-tag px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            ← {ko ? '홈으로 돌아가기' : 'Back to home'}
          </a>
        </div>
      </main>
    </div>
  );
}
