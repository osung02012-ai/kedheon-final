import { NextResponse } from 'next/server';
import { isValidPaymentId, piApiKey, readPaymentBody, requestAppId, sandboxPayload, hasPiApiKey } from '../lib';
import { approvePayment, amountMatches, fetchPayment, isCancelled, paymentMetadataOf } from '../../../lib/piPayment';
import { bearerToken, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { lookupAccount, passEnabled } from '../../../lib/passServer';
import { sbSelect, sbUpsert } from '../../../lib/supabaseAdmin';
import { PASS_PRODUCT, type PassAccountRow } from '../../../lib/passPlan';

/**
 * POST /api/pi/approve — 결제 서버 승인 (3앱 공통)
 *
 * 승인 전에 서버가 반드시 확인한다:
 *  a. 요청 호스트로 앱을 판정하고 **그 앱의 Pi 서버 키**로 Pi Platform에 물어본다.
 *  b. Authorization Bearer accessToken → /v2/me 로 uid 확인 (본문 uid 불신)
 *  c. Pi가 보관한 결제 원본 GET /payments/{id} → payment.user_uid === 확인된 uid
 *  d. 결제가 취소되지 않았고, testnet 결제는 운영에서 거부
 *  e. 상품이 pass_30d이면 metadata.quoteId로 견적 행을 찾아 소유자·미사용·미만료·금액 일치 검증
 *  f. 여기까지 통과한 결제만 Pi Platform approve로 보낸다.
 *
 * 이전 코드는 paymentId 형식만 보고 승인해, 남의 결제나 금액을 바꾼 결제도 승인될 수 있었다(G4).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface QuoteRow {
  id: string;
  account_id: string;
  app_id: string;
  product_id: string;
  tier: string;
  amount_pi: number | string;
  expires_at: string;
  used_payment_id: string | null;
}

export async function GET(req: Request) {
  const app = requestAppId(req);
  return NextResponse.json({
    ok: true,
    action: 'approve',
    endpoint: '/api/pi/approve',
    app,
    mode: hasPiApiKey(app) ? 'live' : 'sandbox-ready',
    missingEnv: hasPiApiKey(app) ? null : `PI_API_KEY_${app.toUpperCase()}`,
    body: { paymentId: 'string' }
  });
}

export async function POST(req: Request) {
  const app = requestAppId(req);
  const body = await readPaymentBody(req);
  const paymentId = body.paymentId;

  if (!isValidPaymentId(paymentId)) {
    return NextResponse.json({ ok: false, action: 'approve', app, error: 'paymentId is required' }, { status: 400 });
  }

  // b. 사용자 신원 — 클라이언트 본문이 아니라 Pi accessToken으로 확인한다.
  const token = bearerToken(req);
  if (!token) {
    return NextResponse.json({ ok: false, action: 'approve', app, error: 'Authorization: Bearer <accessToken> required' }, { status: 401 });
  }
  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) {
    return NextResponse.json({ ok: false, action: 'approve', app, error: verified.error }, { status: verified.status });
  }
  const { uid, username } = verified.user;

  // 서버 키가 아직 없으면 승인을 보낼 곳이 없다 — 준비 상태만 알린다(결제창은 열리지 않음).
  if (!hasPiApiKey(app) || !piApiKey(app)) {
    return NextResponse.json(sandboxPayload('approve', { app, paymentId, approved: false }), { status: 200 });
  }

  // c. Pi가 가진 결제 원본으로 소유자 확인
  const lookup = await fetchPayment(app, paymentId);
  if (!lookup.ok || !lookup.payment) {
    return NextResponse.json(
      { ok: false, action: 'approve', app, paymentId, error: lookup.error || 'payment not found', piStatus: lookup.status },
      { status: 502 }
    );
  }
  const payment = lookup.payment;

  if (!payment.user_uid || payment.user_uid !== uid) {
    return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'payment does not belong to this user' }, { status: 403 });
  }
  if (isCancelled(payment)) {
    return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'payment was cancelled' }, { status: 409 });
  }
  const testnet = (payment.network || '').toLowerCase() === 'testnet';
  const allowTestnet = (process.env.PASS_ALLOW_TESTNET || '').toLowerCase() === 'true';
  if (testnet && !allowTestnet) {
    return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'testnet payment is not accepted for paid products' }, { status: 400 });
  }

  const meta = paymentMetadataOf(payment);
  const isPass = meta.product === PASS_PRODUCT.id;

  let quoteId: string | null = null;
  let account: PassAccountRow | null = null;

  if (isPass) {
    if (!passEnabled()) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'pass is not available' }, { status: 404 });
    }
    quoteId = typeof meta.quoteId === 'string' ? meta.quoteId.trim() : '';
    if (!quoteId) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'quoteId missing in payment metadata' }, { status: 400 });
    }

    const quoteRes = await sbSelect<QuoteRow>(
      'pass_quotes',
      `select=id,account_id,app_id,product_id,tier,amount_pi,expires_at,used_payment_id&id=eq.${encodeURIComponent(quoteId)}&limit=1`
    );
    if (!quoteRes.ok) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: quoteRes.error }, { status: 502 });
    }
    const quote = Array.isArray(quoteRes.data) ? quoteRes.data[0] : null;
    if (!quote) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'quote not found' }, { status: 400 });
    }
    if (quote.product_id !== PASS_PRODUCT.id) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'quote product mismatch' }, { status: 400 });
    }
    if (quote.app_id !== app) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'quote app mismatch' }, { status: 400 });
    }
    if (quote.used_payment_id && quote.used_payment_id !== paymentId) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'quote already used' }, { status: 409 });
    }
    if (Date.parse(quote.expires_at) <= Date.now()) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'quote expired' }, { status: 409 });
    }
    if (!amountMatches(payment.amount, Number(quote.amount_pi))) {
      return NextResponse.json(
        {
          ok: false,
          action: 'approve',
          app,
          paymentId,
          error: 'amount does not match the quote',
          expected: Number(quote.amount_pi),
          received: payment.amount
        },
        { status: 400 }
      );
    }

    // 견적 소유자 = 이 uid의 앱별 계정
    const lookupAccountResult = await lookupAccount(app, uid, username, false);
    account = lookupAccountResult.account;
    if (!account || account.id !== quote.account_id) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: 'quote does not belong to this user' }, { status: 403 });
    }

    // 원장에 승인 기록(같은 paymentId면 멱등). 이미 완료된 결제의 재호출은 그대로 통과시킨다.
    const existing = await sbSelect<{ status: string }>(
      'pass_orders',
      `select=status&payment_id=eq.${encodeURIComponent(paymentId)}&limit=1`
    );
    if (existing.ok && Array.isArray(existing.data) && existing.data[0]?.status === 'completed') {
      return NextResponse.json({ ok: true, action: 'approve', app, paymentId, alreadyCompleted: true, mode: 'live' });
    }
    const recorded = await sbUpsert(
      'pass_orders',
      {
        account_id: account.id,
        app_id: app,
        product_id: PASS_PRODUCT.id,
        payment_type: 'one_time_30d',
        amount_pi: Number(quote.amount_pi),
        tier_at_purchase: quote.tier,
        days_added: PASS_PRODUCT.days,
        payment_id: paymentId,
        network: testnet ? 'testnet' : 'mainnet',
        status: 'approved',
        quote_id: quote.id
      },
      'payment_id'
    );
    if (!recorded.ok) {
      return NextResponse.json({ ok: false, action: 'approve', app, paymentId, error: recorded.error ?? 'ledger write failed' }, { status: 502 });
    }
  }

  const approved = await approvePayment(app, paymentId);
  return NextResponse.json(
    {
      ok: approved.ok,
      mode: 'live',
      action: 'approve',
      app,
      paymentId,
      product: isPass ? PASS_PRODUCT.id : (typeof meta.product === 'string' ? meta.product : null),
      quoteId,
      piStatus: approved.status,
      error: approved.ok ? null : approved.error
    },
    { status: approved.ok ? 200 : 502 }
  );
}
