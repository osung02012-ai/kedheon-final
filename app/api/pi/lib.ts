/**
 * Pi Platform 서버 API 공용 헬퍼 (Kedheon · Civil · FactFilter · Hangang 공통)
 *
 *  - Pi SDK 2.0의 서버 승인/완료 규격: 결제가 생성되면 클라이언트가 아니라
 *    우리 서버가 Pi Platform API(https://api.minepi.com/v2)에 approve → complete를 보낸다.
 *  - 서버 키는 **앱마다 다르다**(piAppContext.ts). 결제 라우트는 요청 호스트로 앱을 판정한 뒤
 *    그 앱의 키로 Pi Platform을 호출해야 한다. 앱 전용 키가 없으면 예전 공용 이름
 *    (PI_NETWORK_API_KEY / PI_API_KEY)으로 대체한다.
 *  - 키가 없으면(아직 Vercel 환경변수 미등록) 빌드/런타임을 깨뜨리지 않고
 *    'sandbox-ready' 상태 JSON만 돌려준다. 키를 넣는 순간 같은 코드가 실결제로 전환된다.
 */

import { appIdFromRequest, piApiKeyFor } from '../../lib/piAppContext';
import type { PassAppId } from '../../lib/passPlan';

export const PI_API_BASE = 'https://api.minepi.com/v2';

/** @deprecated 앱 판정이 필요한 곳은 piAppContext를 쓴다. 호환용으로 남긴다. */
export const PI_API_KEY_ENVS = ['PI_API_KEY_KEDHEON', 'PI_API_KEY_FACTFILTER', 'PI_API_KEY_HANGANG', 'PI_NETWORK_API_KEY', 'PI_API_KEY'] as const;

export type PiMode = 'live' | 'sandbox-ready';

export interface PiApiResult {
  ok: boolean;
  status: number;
  data: unknown;
  error?: string;
}

/** 요청이 들어온 앱(Kedheon·FactFilter·Hangang) */
export function requestAppId(req: Request): PassAppId {
  return appIdFromRequest(req);
}

/** 앱의 Pi 서버 키 (값은 절대 응답에 담지 않는다) */
export function piApiKey(app: PassAppId = 'kedheon'): string {
  return piApiKeyFor(app);
}

export function hasPiApiKey(app: PassAppId = 'kedheon'): boolean {
  return piApiKey(app).length > 0;
}

/** Pi 서버 API 키 미등록 상태의 안전한 JSON. 결제를 만들지 않고 준비 상태만 알린다. */
export function sandboxPayload(action: string, extra: Record<string, unknown> = {}) {
  return {
    ok: true,
    mode: 'sandbox-ready' as PiMode,
    missingEnv: 'PI_API_KEY_<APP> (PI_NETWORK_API_KEY fallback)',
    action,
    note: 'Pi server API key not set for this app. Server approval/completion is prepared but not sent to Pi Platform.',
    checkedAt: new Date().toISOString(),
    ...extra
  };
}

/** 결제 ID 위생 검사 — 공백/슬래시/제어문자로 URL을 건드리지 못하게 한다. */
export function isValidPaymentId(id: unknown): id is string {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{6,120}$/.test(id);
}

export function isValidTxid(id: unknown): id is string {
  return typeof id === 'string' && /^[A-Za-z0-9+/=_-]{6,200}$/.test(id);
}

/**
 * 서버→서버 호출. 12초 타임아웃, 실패해도 예외 대신 구조화된 결과를 돌려준다.
 * `method`는 Pi Platform이 GET을 요구하는 결제 조회에 쓴다.
 */
export async function piRequest(
  path: string,
  body: Record<string, unknown> = {},
  options: { method?: 'GET' | 'POST'; app?: PassAppId } = {}
): Promise<PiApiResult> {
  const method = options.method ?? 'POST';
  const key = piApiKey(options.app ?? 'kedheon');
  if (!key) return { ok: false, status: 0, data: null, error: 'Pi server key not set' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(`${PI_API_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Key ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      ...(method === 'GET' ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
      cache: 'no-store'
    });

    const text = await res.text();
    let data: unknown = text;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        /* Pi가 HTML 오류 페이지를 준 경우 원문 유지 */
      }
    } else {
      data = null;
    }

    if (!res.ok) {
      return { ok: false, status: res.status, data, error: `Pi API ${res.status}` };
    }
    return { ok: true, status: res.status, data };
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    return {
      ok: false,
      status: 0,
      data: null,
      error: aborted ? 'Pi API timeout' : err instanceof Error ? err.message : 'Pi API network error'
    };
  } finally {
    clearTimeout(timer);
  }
}

/** 요청 본문에서 paymentId를 꺼낸다. (JSON·form 모두 허용) */
export async function readPaymentBody(req: Request): Promise<Record<string, unknown>> {
  try {
    const raw = await req.text();
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}
