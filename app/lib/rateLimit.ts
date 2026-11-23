/**
 * 가벼운 레이트리밋(서버 인스턴스 메모리).
 *  - 견적·검증 요청·내보내기처럼 남용 비용이 큰 엔드포인트의 1차 방어선이다.
 *  - 서버리스 인스턴스마다 따로 세므로 완전한 보장은 아니지만, 한 사람이 짧은 시간에
 *    수십 번 호출하는 형태(연타·스크립트)는 막는다. 실제 지급은 payment_id UNIQUE와
 *    멱등 함수가 최종 방어한다.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  if (buckets.size > MAX_KEYS) buckets.clear();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}
