/**
 * Pi 앱 컨텍스트 — 요청이 어느 앱(Kedheon / FactFilter / Hangang)으로 들어왔는지 판정하고
 * 그 앱의 Pi 서버 키를 고른다.
 *
 *  - Pi 개발자 콘솔에는 주력 3종이 **앱 3개로 따로 등록**되어 있다. 서버 키도 앱마다 다르다.
 *    한 키로 세 앱을 처리하던 기존 구조로는 FactFilter·Hangang 결제가 승인되지 않는다.
 *  - 앱 판정은 호스트에서만 한다(x-forwarded-host → host, middleware와 같은 규칙).
 *    요청 본문의 app 값은 신뢰하지 않는다 — 클라이언트가 다른 앱 키로 결제를 태울 수 있다.
 *  - 키 이름(Pi 콘솔 안내 기준):
 *      Kedheon    PI_API_KEY_KEDHEON    (없으면 PI_NETWORK_API_KEY, PI_API_KEY)
 *      FactFilter PI_API_KEY_FACTFILTER (없으면 PI_NETWORK_API_KEY, PI_API_KEY)
 *      Hangang    PI_API_KEY_HANGANG    (없으면 PI_NETWORK_API_KEY, PI_API_KEY)
 *    fallback은 기존 한 키 설정과의 호환용이며, 3앱 실결제에는 앱별 키 3개가 필요하다.
 */

import type { PassAppId } from './passPlan';

/** 호스트 → 앱. 더 구체적인 호스트를 먼저 본다. */
const HOST_RULES: Array<{ match: string; app: PassAppId }> = [
  { match: 'factfilter.', app: 'factfilter' },
  { match: 'factfiltersfm', app: 'factfilter' },
  { match: 'hangang.', app: 'hangang' },
  { match: 'hangangyet', app: 'hangang' }
];

export const APP_KEY_ENVS: Record<PassAppId, readonly string[]> = {
  kedheon: ['PI_API_KEY_KEDHEON'],
  factfilter: ['PI_API_KEY_FACTFILTER'],
  hangang: ['PI_API_KEY_HANGANG']
};

/** 모든 앱이 공통으로 인정하는 예전 이름(한 키 설정과의 호환) */
export const SHARED_KEY_ENVS = ['PI_NETWORK_API_KEY', 'PI_API_KEY'] as const;

/** 요청 헤더에서 호스트 후보(신뢰 순)를 만든다 */
export function requestHosts(req: Request): string[] {
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

/** 호스트 판정 — 매핑에 없으면 kedheon(본도메인·미리보기·pinet 기본값) */
export function appIdFromHosts(hosts: string[]): PassAppId {
  for (const host of hosts) {
    for (const rule of HOST_RULES) {
      if (host.includes(rule.match)) return rule.app;
    }
  }
  return 'kedheon';
}

export function appIdFromRequest(req: Request): PassAppId {
  return appIdFromHosts(requestHosts(req));
}

function firstEnv(names: readonly string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return '';
}

/** 앱 전용 키 → 공용(예전) 키 순으로 고른다. 값은 응답에 담지 않는다. */
export function piApiKeyFor(app: PassAppId): string {
  const own = firstEnv(APP_KEY_ENVS[app]);
  return own || firstEnv(SHARED_KEY_ENVS);
}

export function hasPiApiKeyFor(app: PassAppId): boolean {
  return piApiKeyFor(app).length > 0;
}

/** 앱 전용 키가 실제로 설정돼 있는가(공용 fallback 제외) — 진단용 */
export function hasDedicatedKey(app: PassAppId): boolean {
  return firstEnv(APP_KEY_ENVS[app]).length > 0;
}

/**
 * 지금 이 앱에서 **실결제**를 만들고 승인·완료할 수 있는가.
 *  - 앱 서버 키가 있어야 approve/complete가 Pi Platform에 닿는다.
 *  - SDK가 sandbox 모드(NEXT_PUBLIC_PI_SANDBOX=true)면 테스트넷 결제이므로,
 *    운영에서 이용권을 팔지 않는다(PASS_ALLOW_TESTNET=true로 명시해야 허용).
 */
export function paymentsReadyFor(app: PassAppId): boolean {
  if (!hasPiApiKeyFor(app)) return false;
  const sandbox = (process.env.NEXT_PUBLIC_PI_SANDBOX || '').toLowerCase() === 'true';
  const allowTestnet = (process.env.PASS_ALLOW_TESTNET || '').toLowerCase() === 'true';
  return !sandbox || allowTestnet;
}

/** 진단 응답용 — 이름과 설정 여부만, 값은 절대 담지 않는다. */
export function keyStatus(app: PassAppId) {
  return {
    app,
    envs: [...APP_KEY_ENVS[app], ...SHARED_KEY_ENVS],
    dedicatedKeySet: hasDedicatedKey(app),
    anyKeySet: hasPiApiKeyFor(app),
    paymentsReady: paymentsReadyFor(app)
  };
}
