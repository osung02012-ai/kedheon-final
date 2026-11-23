import { NextResponse } from 'next/server';
import { bearerToken, readJson, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { appIdFromRequest } from '../../../lib/piAppContext';
import { loadCounter, lookupAccount, passEnabled, passPayload } from '../../../lib/passServer';

/**
 * POST /api/pass/touch — 로그인한 사람의 패스 계정을 확보한다 (앱별 첫 로그인 경로)
 *
 *  - Pi accessToken을 /v2/me 로 확인한 uid만 쓴다(본문 uid 불신).
 *  - pass_touch가 (1) 앱별 uid 링크 (2) 전역 username 계정 (3) 회원번호 원자 발급
 *    (4) Genesis 첫 30일 무료 부여를 한 트랜잭션으로 처리한다.
 *  - 몇 번을 호출해도 번호는 하나뿐이고 만료일은 늘지 않는다(재로그인 안전).
 *  - 다른 앱에서 같은 username으로 로그인하면 같은 회원번호·같은 만료일이 돌아온다.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const app = appIdFromRequest(req);
  if (!passEnabled()) {
    return NextResponse.json({ ok: true, enabled: false, available: false, app, pass: null });
  }

  const token = bearerToken(req);
  const body = await readJson(req);
  const accessToken = token || (typeof body.accessToken === 'string' ? body.accessToken.trim() : '');
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: 'accessToken is required' }, { status: 401 });
  }

  const verified = await verifyPiAccessToken(accessToken);
  if (!verified.ok) {
    return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });
  }

  const [lookup, counter] = await Promise.all([
    lookupAccount(app, verified.user.uid, verified.user.username, true),
    loadCounter()
  ]);

  if (!lookup.ok) {
    return NextResponse.json(passPayload(app, null, counter.counter, lookup.error, lookup.available));
  }

  return new NextResponse(
    JSON.stringify({
      ok: true,
      authenticated: true,
      uid: verified.user.uid,
      username: verified.user.username,
      ...passPayload(app, lookup.account, counter.counter)
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
  );
}
