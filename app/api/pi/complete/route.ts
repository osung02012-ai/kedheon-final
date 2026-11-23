import { NextResponse } from 'next/server';
import { hasPiApiKey, isValidPaymentId, isValidTxid, readPaymentBody, requestAppId, sandboxPayload } from '../lib';
import { completePayment, amountMatches, fetchPayment, isCancelled, paymentMetadataOf } from '../../../lib/piPayment';
import { bearerToken, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { loadCounter, lookupAccount, passEnabled, passPayload, redeemPass } from '../../../lib/passServer';
import { sbSelect } from '../../../lib/supabaseAdmin';
import { PASS_PRODUCT, summarizeAccount } from '../../../lib/passPlan';

/**
 * POST /api/pi/complete — 결제 완료 + 이용권 부여 (3앱 공통)
 *
 *  1. Bearer accessToken → uid (본문 uid 불신)
 *  2. GET /payments/{id} — 소유자·취소 여부 재확인
 *  3. POST /payments/{id}/complete — 이 호출이 성공해야 파이가 우리 앱 지갑으로 이동한다
 *  4. 응답 status.transaction_verified === true 일 때만 pass_redeem으로 +30일 부여
 *     (같은 paymentId로 다시 불러도 만료일이 늘지 않는다 — payment_id UNIQUE + 멱등 함수)
 *  5. 부여 직후의 만료일·배지·창립 잔여 자리를 그대로 돌려준다(화면 즉시 갱신).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const app = requestAppId(req);
  return NextResponse.json({
    ok: true,
    action: 'complete',
    endpoint: '/api/pi/complete',
    app,
    mode: hasPiApiKey(app) ? 'live' : 'sandbox-ready',
    body: { paymentId: 'string', txid: 'string' }
  });
}

export async function POST(req: Request) {
  const app = requestAppId(req);
  const body = await readPaymentBody(req);
  const paymentId = body.paymentId;
  const txid = body.txid;

  if (!isValidPaymentId(paymentId) || !isValidTxid(txid)) {
    return NextResponse.json({ ok: false, action: 'complete', app, error: 'paymentId and txid are required' }, { status: 400 });
  }

  const token = bearerToken(req);
  if (!token) {
    return NextResponse.json({ ok: false, action: 'complete', app, error: 'Authorization: Bearer <accessToken> required' }, { status: 401 });
  }
  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) {
    return NextResponse.json({ ok: false, action: 'complete', app, error: verified.error }, { status: verified.status });
  }
  const { uid, username } = verified.user;

  if (!hasPiApiKey(app)) {
    return NextResponse.json(sandboxPayload('complete', { app, paymentId, txid, completed: false }), { status: 200 });
  }

  const lookup = await fetchPayment(app, paymentId);
  if (!lookup.ok || !lookup.payment) {
    return NextResponse.json(
      { ok: false, action: 'complete', app, paymentId, error: lookup.error || 'payment not found', piStatus: lookup.status },
      { status: 502 }
    );
  }
  const payment = lookup.payment;

  if (payment.user_uid !== uid) {
    return NextResponse.json({ ok: false, action: 'complete', app, paymentId, error: 'payment does not belong to this user' }, { status: 403 });
  }
  if (isCancelled(payment)) {
    return NextResponse.json({ ok: false, action: 'complete', app, paymentId, error: 'payment was cancelled' }, { status: 409 });
  }

  const meta = paymentMetadataOf(payment);
  const isPass = meta.product === PASS_PRODUCT.id;
  const quoteId = typeof meta.quoteId === 'string' ? meta.quoteId.trim() : null;

  // 이미 부여된 결제 — Pi에 complete를 다시 보내지 않고 현재 상태만 돌려준다.
  const doneRows = await sbSelect<{ status: string }>('pass_orders', `select=status&payment_id=eq.${encodeURIComponent(paymentId)}&limit=1`);
  const alreadyCompleted = doneRows.ok && Array.isArray(doneRows.data) && doneRows.data[0]?.status === 'completed';

  let transactionVerified: boolean | null = null;

  if (!alreadyCompleted) {
    const completed = await completePayment(app, paymentId, txid);
    if (!completed.ok) {
      return NextResponse.json(
        { ok: false, action: 'complete', app, paymentId, piStatus: completed.status, error: completed.error },
        { status: 502 }
      );
    }
    const completedData = completed.data as { status?: { transaction_verified?: boolean } } | null;
    transactionVerified = completedData?.status?.transaction_verified ?? null;
  } else {
    transactionVerified = true;
  }

  if (!isPass) {
    return NextResponse.json({
      ok: true,
      mode: 'live',
      action: 'complete',
      app,
      paymentId,
      txid,
      transactionVerified,
      product: null
    });
  }

  if (!passEnabled()) {
    return NextResponse.json({ ok: false, action: 'complete', app, paymentId, error: 'pass is not available' }, { status: 404 });
  }

  const accountLookup = await lookupAccount(app, uid, username, false);
  const counter = await loadCounter();
  const currentPass = passPayload(app, accountLookup.account, counter.counter);
  const pass = accountLookup.account;

  if (!pass) {
    return NextResponse.json({ ...currentPass, ok: false, action: 'complete', error: 'pass account not found' });
  }

  // 견적 재검증 — approve를 거치지 않은 complete도 스스로 막는다.
  if (!alreadyCompleted && quoteId) {
    const quote = await sbSelect<{ amount_pi: number | string; account_id: string; app_id: string; used_payment_id: string | null }>(
      'pass_quotes',
      `select=amount_pi,account_id,app_id,used_payment_id&id=eq.${encodeURIComponent(quoteId)}&limit=1`
    );
    const row = quote.ok && Array.isArray(quote.data) ? quote.data[0] : null;
    const valid =
      row &&
      row.app_id === app &&
      row.account_id === pass.id &&
      (!row.used_payment_id || row.used_payment_id === paymentId) &&
      amountMatches(payment.amount, Number(row.amount_pi));
    if (!valid) {
      return NextResponse.json({ ok: false, action: 'complete', app, paymentId, error: 'quote validation failed' }, { status: 400 });
    }
  }

  if (transactionVerified !== true) {
    // 파이 전송이 아직 검증되지 않았다 — 부여하지 않고 상태만 알린다(재시도 가능).
    return NextResponse.json(
      {
        ...currentPass,
        ok: false,
        action: 'complete',
        app,
        paymentId,
        transactionVerified,
        error: 'transaction not verified yet'
      },
      { status: 202 }
    );
  }

  const redeem = await redeemPass({
    accountId: pass.id,
    app,
    paymentId,
    txid,
    amountPi: payment.amount,
    quoteId,
    network: (payment.network || 'mainnet').toLowerCase()
  });

  if (!redeem.ok) {
    return NextResponse.json(
      { ...currentPass, ok: false, action: 'complete', app, paymentId, error: redeem.error ?? 'grant failed' },
      { status: 502 }
    );
  }

  const updated = passPayload(app, redeem.account ?? pass, (await loadCounter()).counter);
  const summary = summarizeAccount(redeem.account ?? pass);
  return NextResponse.json({
    ...updated,
    ok: true,
    mode: 'live',
    action: 'complete',
    app,
    paymentId,
    txid,
    transactionVerified,
    daysAdded: PASS_PRODUCT.days,
    passExpiresAt: summary.passExpiresAt,
    badge: summary.badge,
    granted: !alreadyCompleted
  });
}
