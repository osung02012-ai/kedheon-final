import { NextResponse } from 'next/server';
import { rateLimit } from '../../../lib/rateLimit';
import { sbRpc, supabaseConfigured } from '../../../lib/supabaseAdmin';

/**
 * /api/wolnambbong/board — 월남뽕 명예의 전당 · 왕좌 좌석(선착순) · 랭킹보드
 *
 *  GET  ?device=<기기ID>
 *    → { ok, available, seats[{grade,taken,capacity}], top[10], players, pioneers, me }
 *      seats   : 등급 1~7 좌석 정원/발급 수(피라미드: 31415·15707·6283·3141·1570·628·314)
 *      top     : TOP 10 (최고 등급 → 최고 보유머니 → 승수 순)
 *      pioneers: π 파이오니어 배지를 연결한 인원
 *      me      : 내 기록·순위·등급별 고유 번호(기기ID로만 조회)
 *
 *  POST { action, ... }
 *    · profile { device, nickname, grade, money, wins, plays } → 기록 갱신(값은 내려가지 않음)
 *    · seat    { device, grade, nickname, pi }                 → 그 등급 좌석 고유 번호 발급
 *    · pi      { device, username, verified }                  → π 파이오니어 배지 연결
 *    · invite  { device, ref }                                 → 초대(개척자) 1회 집계
 *
 *  - 테이블·함수가 없으면(마이그레이션 전) available:false 로 끝나고, 화면은 로컬 모드로 동작한다.
 *  - service_role 키는 서버에서만 쓰고 응답·로그로 내보내지 않는다.
 *  - 환금성 없음: 좌석·기록은 명예 표시일 뿐, 돈·코인·현금으로 바꿀 수 없다.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

/** 기기ID — 브라우저가 만든 무작위 영숫자(개인정보 아님). 형식이 틀리면 null. */
function cleanDevice(v: unknown): string | null {
  const s = String(v ?? '').trim().toLowerCase();
  return /^[a-z0-9]{8,40}$/.test(s) ? s : null;
}

function cleanNick(v: unknown): string {
  const s = String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, 8);
  return s || 'Player';
}

function num(v: unknown, max: number): number {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}

function isMissingObject(status: number, error: string | null): boolean {
  if (status === 404) return true;
  const m = (error || '').toLowerCase();
  return (
    m.includes('could not find the function') ||
    m.includes('does not exist') ||
    m.includes('schema cache') ||
    m.includes('pgrst202') ||
    m.includes('pgrst205')
  );
}

const EMPTY = {
  ok: true,
  available: false,
  seats: [],
  top: [],
  players: 0,
  pioneers: 0,
  me: null
};

export async function GET(req: Request) {
  if (!supabaseConfigured()) return json(EMPTY);
  const device = cleanDevice(new URL(req.url).searchParams.get('device'));
  const r = await sbRpc<Record<string, unknown>>('wnb_board', { p_device: device, p_top: 10 });
  if (!r.ok) {
    return json({ ...EMPTY, ok: false, available: !isMissingObject(r.status, r.error), error: r.error });
  }
  const d = (r.data || {}) as Record<string, unknown>;
  return json({
    ok: true,
    available: true,
    seats: Array.isArray(d.seats) ? d.seats : [],
    top: Array.isArray(d.top) ? d.top : [],
    players: Number(d.players) || 0,
    pioneers: Number(d.pioneers) || 0,
    me: d.me ?? null
  });
}

export async function POST(req: Request) {
  const limiter = rateLimit('wnb-board:' + (req.headers.get('x-forwarded-for') || 'local'), 90, 60_000);
  if (!limiter.ok) return json({ ok: false, error: 'too_many_requests' }, 429);

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }

  if (!supabaseConfigured()) return json({ ok: false, available: false, error: 'db_unconfigured' });

  const device = cleanDevice(body.device);
  if (!device) return json({ ok: false, available: true, error: 'bad_device' }, 400);

  const action = String(body.action || '');

  if (action === 'profile') {
    const r = await sbRpc<Record<string, unknown>>('wnb_player_touch', {
      p_device: device,
      p_nickname: cleanNick(body.nickname),
      p_grade: num(body.grade, 7),
      p_money: num(body.money, 1_000_000_000),
      p_wins: num(body.wins, 10_000_000),
      p_plays: num(body.plays, 10_000_000)
    });
    if (!r.ok) return json({ ok: false, available: !isMissingObject(r.status, r.error), error: r.error });
    /* wnb_player_touch 는 기록만 돌려준다(순위·좌석 없음). 화면이 '내 순위 -' 가 되지 않도록
       보드에서 그 기기의 me(순위·좌석 포함)를 다시 읽어 합쳐 준다. */
    const b = await sbRpc<Record<string, unknown>>('wnb_board', { p_device: device, p_top: 1 });
    const me = b.ok && b.data && typeof b.data === 'object'
      ? ((b.data as Record<string, unknown>).me as Record<string, unknown> | null)
      : null;
    return json({ ok: true, available: true, me: me ? { ...(r.data || {}), ...me } : r.data });
  }

  if (action === 'seat') {
    const grade = num(body.grade, 7);
    if (grade < 1) return json({ ok: false, available: true, error: 'bad_grade' }, 400);
    const r = await sbRpc<Record<string, unknown>>('wnb_seat_claim', {
      p_device: device,
      p_grade: grade,
      p_nickname: cleanNick(body.nickname),
      p_pi: String(body.pi ?? '').slice(0, 32) || null
    });
    if (!r.ok) return json({ ok: false, available: !isMissingObject(r.status, r.error), error: r.error });
    return json({ ok: true, available: true, claim: r.data });
  }

  if (action === 'pi') {
    const username = String(body.username ?? '').trim().slice(0, 32);
    if (!username) return json({ ok: false, available: true, error: 'bad_username' }, 400);
    const r = await sbRpc<Record<string, unknown>>('wnb_pi_link', {
      p_device: device,
      p_username: username,
      p_verified: body.verified === true
    });
    if (!r.ok) return json({ ok: false, available: !isMissingObject(r.status, r.error), error: r.error });
    return json({ ok: true, available: true, pi: r.data });
  }

  if (action === 'invite') {
    const ref = cleanDevice(body.ref);
    if (!ref || ref === device) return json({ ok: true, available: true, credited: false });
    const r = await sbRpc<Record<string, unknown>>('wnb_invite_credit', {
      p_inviter: ref,
      p_invited: device
    });
    if (!r.ok) return json({ ok: false, available: !isMissingObject(r.status, r.error), error: r.error });
    return json({ ok: true, available: true, invite: r.data });
  }

  return json({ ok: false, error: 'unknown_action' }, 400);
}
