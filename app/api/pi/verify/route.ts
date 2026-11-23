import { NextResponse } from 'next/server';
import { bearerToken, readJson, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { appIdFromRequest } from '../../../lib/piAppContext';
import { sbSelect, sbUpsert, supabaseConfigured } from '../../../lib/supabaseAdmin';
import { loadCounter, lookupAccount, passPayload } from '../../../lib/passServer';

/**
 * POST /api/pi/verify
 *  - body: { accessToken }  (Pi Browser의 Pi.authenticate 결과 accessToken)
 *  - 서버가 Pi Platform API /v2/me 로 실제 uid·username을 확인한다.
 *  - 성공 시 pi_users에 upsert(최초 방문 기록 + last_seen_at 갱신)하고
 *    현재 beom_total과 최근 beom_logs 10건을 돌려준다.
 *  - 로그인 응답에 Kedheon.pi Pass 상태(회원번호·등급·만료일·창립 잔여 자리)를 함께 담는다.
 *    pass_touch가 (app_id, uid) 링크·전역 username 계정·번호 발급·Genesis 첫 30일 무료를 처리한다.
 *  - DB가 아직 연결되지 않았으면(환경변수 없음) 검증 결과만 돌려주고 화면은 localStorage로 동작한다.
 *
 * GET /api/pi/verify — 비밀값 없는 상태 점검(DB 연결 여부)
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PiUserRow {
  uid: string;
  username: string;
  beom_total: number | null;
  first_seen_at: string | null;
  last_seen_at: string | null;
}

interface BeomLogRow {
  app: string;
  action: string;
  delta: number;
  created_at: string;
}

export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      endpoint: '/api/pi/verify',
      db: 'unconfigured',
      note: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set in this environment.',
      accepts: 'POST { accessToken }'
    });
  }
  const probe = await sbSelect<PiUserRow>('pi_users', 'select=uid&limit=1');
  return NextResponse.json({
    ok: true,
    endpoint: '/api/pi/verify',
    db: probe.ok ? 'ready' : 'error',
    dbStatus: probe.status,
    dbError: probe.ok ? null : probe.error,
    accepts: 'POST { accessToken }'
  });
}

export async function POST(req: Request) {
  const body = await readJson(req);
  const token = bearerToken(req) || (typeof body.accessToken === 'string' ? body.accessToken.trim() : '');
  if (!token) {
    return NextResponse.json({ ok: false, verified: false, error: 'accessToken is required' }, { status: 400 });
  }

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) {
    return NextResponse.json(
      { ok: false, verified: false, error: verified.error },
      { status: verified.status === 401 ? 401 : 502 }
    );
  }

  const { uid, username } = verified.user;

  if (!supabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      verified: true,
      db: 'unconfigured',
      uid,
      username,
      beomTotal: 0,
      logs: []
    });
  }

  const now = new Date().toISOString();
  const app = appIdFromRequest(req);
  const upsert = await sbUpsert<PiUserRow>('pi_users', { uid, username, last_seen_at: now }, 'uid');

  if (!upsert.ok) {
    // 검증 자체는 성공했으므로 200으로 알리고, 화면은 localStorage로 계속 동작한다.
    return NextResponse.json({
      ok: true,
      verified: true,
      db: 'error',
      dbStatus: upsert.status,
      dbError: upsert.error,
      uid,
      username,
      beomTotal: 0,
      logs: []
    });
  }

  const row = Array.isArray(upsert.data) && upsert.data.length > 0 ? upsert.data[0] : null;
  const logs = await sbSelect<BeomLogRow>(
    'beom_logs',
    `select=app,action,delta,created_at&uid=eq.${encodeURIComponent(uid)}&order=created_at.desc&limit=10`
  );

  // 패스 계정 확보(번호 발급 + Genesis 첫 30일 무료). 실패해도 로그인은 그대로 성공한다.
  const [passLookup, counter] = await Promise.all([
    lookupAccount(app, uid, username, true),
    loadCounter()
  ]);
  const pass = passPayload(app, passLookup.account, counter.counter, passLookup.error, passLookup.available);

  return NextResponse.json({
    ok: true,
    verified: true,
    db: 'ready',
    app,
    uid,
    username,
    firstSeenAt: row?.first_seen_at ?? null,
    lastSeenAt: row?.last_seen_at ?? now,
    beomTotal: Number(row?.beom_total ?? 0) || 0,
    logs: logs.ok && Array.isArray(logs.data) ? logs.data : [],
    pass: pass.pass,
    passEnabled: pass.enabled,
    passAvailable: pass.available,
    counter: pass.counter,
    priceNextPi: pass.priceNextPi,
    paymentsReady: pass.paymentsReady
  });
}
