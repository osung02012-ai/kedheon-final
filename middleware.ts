import { NextRequest, NextResponse } from 'next/server';

/**
 * 앱별 서브도메인 라우팅.
 * Pi 개발자 콘솔은 앱의 Public URL을 오리진(경로 없는 https://호스트)으로만 받는다.
 * 그래서 Civil은 civil.kedheon.com, FactFilter는 factfilter.kedheon.com,
 * Hangang은 hangang.kedheon.com 에서 각 앱 화면을 루트(/)로 열어 준다. kedheon.com 본도메인은 그대로 동작한다.
 */
const HOST_PREFIX: Record<string, string> = {
  'civil.kedheon.com': '/civil',
  'factfilter.kedheon.com': '/factfilter',
  'hangang.kedheon.com': '/hangang'
};

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase().split(':')[0];
  const prefix = HOST_PREFIX[host];
  if (!prefix) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // 정적 자산, API 라우트, 이미 앱 경로인 요청, 도메인 검증 파일은 그대로 통과시킨다.
  //  - /api/* 는 서브도메인에서도 그대로 살아 있어야 Pi 결제 서버 승인/완료가 동작한다.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith(prefix) ||
    pathname === '/validation-key.txt' ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = pathname === '/' ? prefix : `${prefix}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)']
};
