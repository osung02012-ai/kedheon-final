/**
 * Pi 사용자 서버 검증 (Kedheon · FactFilter · Hangang 공통)
 *
 *  - 클라이언트가 Pi.authenticate()로 받은 accessToken을 서버가 Pi Platform API
 *    `GET https://api.minepi.com/v2/me` 에 Bearer로 그대로 보내 실제 `uid`·`username`을 받는다.
 *  - 이렇게 확인한 uid만 DB의 주 키로 쓴다. 본문으로 받은 uid/username은 신뢰하지 않는다.
 *  - Pi 서버 키(PI_NETWORK_API_KEY)는 필요 없다. 사용자 accessToken만 있으면 된다.
 *  - 토큰이 없거나 만료/위조면 401, Pi 쪽 장애·타임아웃이면 502로 구분해 돌려준다.
 */

export const PI_API_BASE = 'https://api.minepi.com/v2';

export interface PiVerifiedUser {
  uid: string;
  username: string;
}

export type PiVerifyResult =
  | { ok: true; user: PiVerifiedUser }
  | { ok: false; status: number; error: string };

/** Authorization: Bearer <token> 헤더에서 토큰을 꺼낸다. */
export function bearerToken(req: Request): string {
  const raw = req.headers.get('authorization') || '';
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return match ? match[1].trim() : '';
}

export async function verifyPiAccessToken(token: string): Promise<PiVerifyResult> {
  if (!token || token.length < 8) return { ok: false, status: 401, error: 'accessToken is required' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${PI_API_BASE}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store'
    });

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (res.status === 401 || res.status === 403) {
      return { ok: false, status: 401, error: 'Pi accessToken rejected' };
    }
    if (!res.ok) {
      return { ok: false, status: 502, error: `Pi API ${res.status}` };
    }

    const user = data as { uid?: unknown; username?: unknown } | null;
    const uid = typeof user?.uid === 'string' ? user.uid.trim() : '';
    const username = typeof user?.username === 'string' ? user.username.trim() : '';
    if (!uid) return { ok: false, status: 502, error: 'Pi API returned no uid' };

    return { ok: true, user: { uid, username: username || 'pioneer' } };
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    return { ok: false, status: 502, error: aborted ? 'Pi API timeout' : 'Pi API network error' };
  } finally {
    clearTimeout(timer);
  }
}

/** 요청 본문(JSON)을 안전하게 읽는다. */
export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const raw = await req.text();
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    return {};
  } catch {
    return {};
  }
}

/** 한글(Asia/Seoul) 기준 오늘 0시를 ISO로 돌려준다 — 출석 중복 방지에 쓴다. */
export function startOfSeoulDay(now = new Date()): string {
  const seoul = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = seoul.getUTCFullYear();
  const m = seoul.getUTCMonth();
  const d = seoul.getUTCDate();
  return new Date(Date.UTC(y, m, d) - 9 * 60 * 60 * 1000).toISOString();
}
