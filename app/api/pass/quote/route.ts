import { NextResponse } from 'next/server';
import { bearerToken, readJson, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { appIdFromRequest, paymentsReadyFor } from '../../../lib/piAppContext';
import { loadCounter, lookupAccount, passEnabled, passPayload } from '../../../lib/passServer';
import { PASS_PRODUCT, priceForTier, summarizeAccount } from '../../../lib/passPlan';
import { sbFetch } from '../../../lib/supabaseAdmin';
import { rateLimit } from '../../../lib/rateLimit';

/**
 * POST /api/pass/quote — 가격을 서버가 확정한다 (클라 금액 위조 차단의 기준점)
 *
 *  - 등급(회원번호)으로 갱신가를 정한다: Genesis 0.5 · Early 0.7 · Standard 1 Pi.
 *  - pass_quotes에 15분짜리 견적 1행을 남기고 id를 돌려준다.
 *  - 클라이언트는 이 금액으로 Pi.createPayment를 만들고 metadata에 quoteId를 넣는다.
 *    approve 단계는 **Pi가 보관한 metadata의 quoteId**로 이 행을 찾아 금액·소유자·만료를 검증한다.
 *  - 앱 서버 키가 없거나 sandbox 모드면 결제를 만들 수 없으므로 견적을 발급하지 않는다
 *    (승인 불가능한 결제창을 띄워 사용자를 기다리게 하지 않는다).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const app = appIdFromRequest(req);
  if (!passEnabled()) {
    return NextResponse.json({ ok: false, enabled: false, available: false, app, error: 'pass disabled' }, { status: 404 });
  }

  const token = bearerToken(req);
  const body = await readJson(req);
  const accessToken = token || (typeof body.accessToken === 'string' ? body.accessToken.trim() : '');
  if (!accessToken) return NextResponse.json({ ok: false, error: 'accessToken is required' }, { status: 401 });

  const verified = await verifyPiAccessToken(accessToken);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });

  const limited = rateLimit(`quote:${verified.user.uid}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: 'too many quote requests', retryAfter: limited.retryAfterSeconds },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } }
    );
  }

  if (!paymentsReadyFor(app)) {
    return NextResponse.json(
      {
        ok: false,
        app,
        paymentsReady: false,
        error: 'Pi server API key for this app is not configured yet. Payment is not opened.',
        needEnv: ['PI_API_KEY_KEDHEON', 'PI_API_KEY_FACTFILTER', 'PI_API_KEY_HANGANG']
      },
      { status: 503 }
    );
  }

  // 계정이 없으면 로그인 경로와 같은 터치로 확보한다(번호 발급 포함, 안전).
  const lookup = await lookupAccount(app, verified.user.uid, verified.user.username, true);
  const counter = await loadCounter();
  if (!lookup.ok || !lookup.account) {
    return NextResponse.json(passPayload(app, lookup.account, counter.counter, lookup.error ?? 'account not found', lookup.available));
  }

  const summary = summarizeAccount(lookup.account);
  const amountPi = priceForTier(summary.tier);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const inserted = await sbFetch<{ id: string; amount_pi: number | string; expires_at: string }[]>('pass_quotes', {
    method: 'POST',
    body: {
      account_id: lookup.account.id,
      app_id: app,
      product_id: PASS_PRODUCT.id,
      tier: summary.tier,
      amount_pi: amountPi,
      expires_at: expiresAt
    },
    prefer: 'return=representation'
  });

  if (!inserted.ok) {
    return NextResponse.json(
      { ok: false, app, error: inserted.error ?? 'quote failed', dbStatus: inserted.status },
      { status: 200 }
    );
  }

  const row = Array.isArray(inserted.data) ? inserted.data[0] : null;
  if (!row?.id) {
    return NextResponse.json({ ok: false, app, error: 'quote not saved' }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    app,
    quoteId: row.id,
    amountPi,
    tier: summary.tier,
    badge: summary.badge,
    productId: PASS_PRODUCT.id,
    days: PASS_PRODUCT.days,
    expiresAt: row.expires_at ?? expiresAt,
    pass: summary,
    counter: counter.counter,
    paymentsReady: true
  });
}

/** GET은 상태 점검용 — 결제 준비 여부만 알려 준다(값 없음). */
export async function GET(req: Request) {
  const app = appIdFromRequest(req);
  return NextResponse.json({
    ok: true,
    app,
    enabled: passEnabled(),
    paymentsReady: paymentsReadyFor(app),
    accepts: 'POST { } with Authorization: Bearer <accessToken>'
  });
}
