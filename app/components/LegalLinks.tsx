import React from 'react';

/**
 * 앱 하단 법적 문서 링크 — 6개 앱 공통(KEDHEON·CIVIL·FACTFILTER·HANGANG·XAEA12·VENDOR)
 *
 * Pi 메인넷 리스팅 요건으로 모든 앱에서 `/privacy` 와 `/terms` 로 연결한다.
 *  - 하단 고정 독(AppDock)은 그대로 두고, 그 위 본문 맨 끝에 한 줄로만 붙인다.
 *    (독의 항목 순서·규격·실명 마스킹은 건드리지 않는다.)
 *  - 서브도메인에서도 middleware.ts 가 `/privacy`·`/terms` 를 리라이트하지 않으므로
 *    같은 문서가 열린다.
 *  - 일반 <a> 로 이동해 미들웨어 리라이트 경로와 무관하게 항상 새 문서를 받는다.
 *  - 과거 이름은 PrivacyLink 였고, /terms 가 생기면서 두 링크를 함께 내보낸다.
 */
export default function LegalLinks({ className = 'mt-4 mb-2' }: { className?: string }) {
  const linkClass =
    't-tag text-neutral-500 hover:text-[#dc2626] underline underline-offset-2 decoration-neutral-300 hover:decoration-[#dc2626] transition-colors px-1 py-1 whitespace-nowrap';
  return (
    <div className={`w-full flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 ${className}`}>
      <a href="/privacy" className={linkClass}>
        개인정보 처리방침 / Privacy Policy
      </a>
      <span aria-hidden="true" className="t-tag text-neutral-300">·</span>
      <a href="/terms" className={linkClass}>
        이용약관 / Terms of Service
      </a>
    </div>
  );
}
