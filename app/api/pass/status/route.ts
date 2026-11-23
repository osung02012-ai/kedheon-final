import { NextResponse } from 'next/server';
import { bearerToken, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { appIdFromRequest } from '../../../lib/piAppContext';
import { loadCounter, lookupAccount, passEnabled, passPayload } from '../../../lib/passServer';

/**
 * GET /api/pass/status — 헤더 배지·패스 카드용 경량 조회
 *  - Bearer accessToken으로 uid를 확인하고 (app_id, uid) 링크에서 계정을 찾는다(읽기 전용).
 *  - 계정이 없으면(아직 이 앱에서 로그인 기록 없음) pass:null을 돌려준다 — 화면은 "PASS 시작".
 *  - 카운터는 같은 응답에 함께 담아 배지·시트가 한 번에 그려지게 한다.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const app = appIdFromRequest(req);
  if (!passEnabled()) {
    return NextResponse.json({ ok: true, enabled: false, available: false, app, pass: null }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const token = bearerToken(req);
  if (!token) {
    const counter = await loadCounter();
    return NextResponse.json(
      { ok: true, enabled: true, available: counter.available, app, authenticated: false, pass: null, counter: counter.counter },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) {
    return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });
  }

  const [lookup, counter] = await Promise.all([
    lookupAccount(app, verified.user.uid, verified.user.username, false),
    loadCounter()
  ]);

  if (!lookup.ok) {
    return NextResponse.json(
      passPayload(app, null, counter.counter, lookup.error, lookup.available),
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const payload = passPayload(app, lookup.account, counter.counter);
  return NextResponse.json(
    { ok: true, authenticated: true, ...payload },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
