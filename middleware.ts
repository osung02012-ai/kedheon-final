import { NextRequest, NextResponse } from 'next/server';

/**
 * 앱별 서브도메인 라우팅.
 * Pi 개발자 콘솔은 앱의 Public URL을 오리진(경로 없는 https://호스트)으로만 받는다.
 * 그래서 Civil은 civil.kedheon.com, FactFilter는 factfilter.kedheon.com,
 * Hangang은 hangang.kedheon.com, XAEA12는 xaea12.kedheon.com, Vendor는
 * vendor.kedheon.com 에서 각 앱 화면을 루트(/)로 열어 준다.
 * kedheon.com 본도메인은 그대로 동작한다.
 */
const HOST_PREFIX: Record<string, string> = {
  'civil.kedheon.com': '/civil',
  'factfilter.kedheon.com': '/factfilter',
  'hangang.kedheon.com': '/hangang',
  'xaea12.kedheon.com': '/xaea12',
  'vendor.kedheon.com': '/vendor'
};

/**
 * 어느 호스트에서든 그대로 서빙해야 하는 공통 경로.
 *  - /privacy        : 개인정보 처리방침(6개 앱 공통 · Pi Next/메인넷 리스팅 요건)
 *  - /api/*          : Pi 결제 승인·완료 서버 라우트
 *  - /_next/*        : 빌드 자산
 *  - /validation-key, /robots.txt, /sitemap.xml : 도메인·검색 검증 파일
 * 이 경로들은 서브도메인에서 앱 접두어(/civil 등)를 붙이면 404가 되므로 절대 리라이트하지 않는다.
 */
const COMMON_PREFIXES = ['/_next', '/api', '/privacy'];
const COMMON_EXACT = new Set([
  '/validation-key.txt',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/manifest.webmanifest'
]);

/** public/ 정적 자산(qr-personal.png 등)은 파일 확장자로 구분해 리라이트하지 않는다. */
const STATIC_FILE = /\.[a-z0-9]{2,5}$/i;

/**
 * 요청이 실제로 어떤 호스트로 들어왔는지 판별한다.
 *  - 프록시(Vercel·PiNet·Cloudflare 등) 뒤에서는 `x-forwarded-host` 가 진짜 도메인이고
 *    `host` 는 내부 오리진인 경우가 있다. 그래서 x-forwarded-host 를 먼저 본다.
 *  - x-forwarded-host 는 `a.com, b.com` 처럼 쉼표로 여러 개가 올 수 있어 첫 값을 쓴다.
 *  - 포트·공백·대소문자를 정리한다.
 */
function candidateHosts(req: NextRequest): string[] {
  const raw = [req.headers.get('x-forwarded-host'), req.headers.get('host')];
  const hosts: string[] = [];
  for (const value of raw) {
    if (!value) continue;
    for (const part of value.split(',')) {
      const host = part.trim().toLowerCase().split(':')[0];
      if (host && !hosts.includes(host)) hosts.push(host);
    }
  }
  return hosts;
}

export function middleware(req: NextRequest) {
  // 매핑된 앱 서브도메인이 하나도 없으면(= kedheon.com 본도메인, *.pinet.com 프록시 경로,
  // 미리보기 도메인 등) 아무것도 리라이트하지 않고 그대로 서빙한다. 여기서 절대 막지 않는다.
  const hosts = candidateHosts(req);
  const host = hosts.find(h => HOST_PREFIX[h]);
  if (!host) return NextResponse.next();

  const prefix = HOST_PREFIX[host];
  const { pathname } = req.nextUrl;

  // 정적 자산, API 라우트, 공통 문서(/privacy), 이미 앱 경로인 요청, 도메인 검증 파일은 그대로 통과.
  //  - /api/* 는 서브도메인에서도 그대로 살아 있어야 Pi 결제 서버 승인/완료가 동작한다.
  if (
    COMMON_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith(prefix) ||
    STATIC_FILE.test(pathname) ||
    COMMON_EXACT.has(pathname)
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
