/**
 * Supabase(PostgREST) 서버 전용 클라이언트 — Kedheon · FactFilter · Hangang 실DB 저장용
 *
 *  - Vercel ↔ Supabase 통합(`kedheon-db`, 서울 리전)이 자동 주입한 환경변수 이름을 그대로 쓴다.
 *      · URL     : SUPABASE_URL  (없으면 NEXT_PUBLIC_SUPABASE_URL)
 *      · 서버 키 : SUPABASE_SERVICE_ROLE_KEY  (없으면 SUPABASE_SECRET_KEY)
 *  - 서비스 키는 절대 브라우저·응답·로그로 나가지 않는다. 모든 호출은 서버 라우트에서만 일어난다.
 *  - 키가 아직 없으면(로컬 빌드·미연결) 예외를 던지지 않고 `configured: false` 결과를 돌려준다.
 *    그때 화면은 기존 localStorage 동작을 그대로 유지한다.
 *  - 별도 SDK(@supabase/supabase-js) 없이 fetch만 쓴다: 번들·의존성 증가 없이 PostgREST 규격만 사용.
 */

const URL_ENVS = ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'] as const;
const KEY_ENVS = ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY'] as const;

/** 응답에 이름만 알려 줄 때 쓰는 목록(값은 절대 담지 않는다) */
export const SUPABASE_ENV_NAMES = { url: URL_ENVS, key: KEY_ENVS };

function firstEnv(names: readonly string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return '';
}

export function supabaseUrl(): string {
  return firstEnv(URL_ENVS).replace(/\/+$/, '');
}

/** 서버 전용 키. 라우트 밖으로 절대 내보내지 않는다. */
function serviceKey(): string {
  return firstEnv(KEY_ENVS);
}

export function supabaseConfigured(): boolean {
  return supabaseUrl().length > 0 && serviceKey().length > 0;
}

export interface SbResult<T> {
  ok: boolean;
  /** DB에 붙지 못한 경우(환경변수 없음) */
  configured: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

const TIMEOUT_MS = 10000;

function failed<T>(configured: boolean, status: number, error: string): SbResult<T> {
  return { ok: false, configured, status, data: null, error };
}

/**
 * PostgREST 호출. `path`는 `pi_users?select=...` 처럼 테이블+쿼리스트링.
 * `prefer`는 PostgREST Prefer 헤더(예: resolution=merge-duplicates, return=representation).
 */
export async function sbFetch<T>(
  path: string,
  init: { method?: string; body?: unknown; prefer?: string; count?: boolean } = {}
): Promise<SbResult<T>> {
  if (!supabaseConfigured()) return failed<T>(false, 0, 'supabase not configured');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      apikey: serviceKey(),
      Authorization: `Bearer ${serviceKey()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Prefer: init.prefer ?? 'return=representation'
    };
    if (init.count) headers.Prefer = `${headers.Prefer},count=exact`;

    const res = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
      method: init.method ?? 'GET',
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: controller.signal,
      cache: 'no-store'
    });

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const message =
        data && typeof data === 'object' && 'message' in data
          ? String((data as { message?: unknown }).message)
          : `supabase ${res.status}`;
      return failed<T>(true, res.status, message);
    }
    return { ok: true, configured: true, status: res.status, data: data as T, error: null };
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    return failed<T>(true, 0, aborted ? 'supabase timeout' : err instanceof Error ? err.message : 'supabase network error');
  } finally {
    clearTimeout(timer);
  }
}

/** SELECT. `query`는 `select=uid&limit=10` 형태(앞의 ? 제외). */
export async function sbSelect<T>(table: string, query = 'select=*'): Promise<SbResult<T[]>> {
  return sbFetch<T[]>(`${table}?${query}`);
}

/** INSERT/UPSERT. `onConflict`를 주면 merge-duplicates로 upsert 한다. */
export async function sbUpsert<T>(
  table: string,
  rows: Record<string, unknown> | Record<string, unknown>[],
  onConflict?: string,
  returning = true
): Promise<SbResult<T[]>> {
  const query = onConflict ? `on_conflict=${encodeURIComponent(onConflict)}` : '';
  const prefer = `${onConflict ? 'resolution=merge-duplicates,' : ''}return=${returning ? 'representation' : 'minimal'}`;
  return sbFetch<T[]>(`${table}${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: Array.isArray(rows) ? rows : [rows],
    prefer
  });
}

/** UPDATE. `query`는 `uid=eq.<uid>` 형태. */
export async function sbUpdate<T>(table: string, query: string, patch: Record<string, unknown>): Promise<SbResult<T[]>> {
  return sbFetch<T[]>(`${table}?${query}`, {
    method: 'PATCH',
    body: patch,
    prefer: 'return=representation'
  });
}

/** DELETE. `query`는 `uid=eq.<uid>&spot_id=eq.<id>` 형태. */
export async function sbDelete<T>(table: string, query: string): Promise<SbResult<T[]>> {
  return sbFetch<T[]>(`${table}?${query}`, { method: 'DELETE', prefer: 'return=representation' });
}

/**
 * RPC(Postgres 함수) 호출 — `/rest/v1/rpc/{fn}`.
 *  - 패스 회원번호 발급(pass_touch)·이용권 부여(pass_redeem)는 행 잠금이 필요한 트랜잭션이라
 *    테이블 CRUD로는 안전하지 않다. 서버(service key)만 실행할 수 있게 RLS·권한을 막아 둔다.
 *  - 함수가 아직 없으면(마이그레이션 전) 404/PGRST202로 실패하고, 호출부는 available:false로 처리한다.
 */
export async function sbRpc<T>(
  fn: string,
  args: Record<string, unknown> = {}
): Promise<SbResult<T>> {
  return sbFetch<T>(`rpc/${fn}`, { method: 'POST', body: args });
}

/** 숫자 합계. PostgREST 집계(`select=delta.sum()`)를 쓰고, 막히면 행 합산으로 대체한다. */
export async function sbSum(table: string, column: string, query: string): Promise<{ ok: boolean; sum: number }> {
  const agg = await sbFetch<Record<string, unknown>[]>(`${table}?${query}&select=${column}.sum()`);
  if (agg.ok && Array.isArray(agg.data)) {
    const first = agg.data[0] as Record<string, unknown> | undefined;
    const value = first ? first[`sum`] ?? first[column] : 0;
    const n = Number(value);
    if (Number.isFinite(n)) return { ok: true, sum: n };
  }
  const rows = await sbSelect<Record<string, unknown>>(table, `${query}&select=${column}&limit=100000`);
  if (!rows.ok || !Array.isArray(rows.data)) return { ok: false, sum: 0 };
  const sum = rows.data.reduce((acc, row) => acc + (Number(row[column]) || 0), 0);
  return { ok: true, sum };
}

/** PostgREST 필터용 문자열 값(작은따옴표·쉼표·괄호·별표·역슬래시 방어). */
export function sbValue(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
