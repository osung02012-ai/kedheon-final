import { NextResponse } from 'next/server';
import { hasPiApiKey, isValidPaymentId, readPaymentBody, requestAppId, sandboxPayload } from '../lib';
import { incompletePayment } from '../../../lib/piPayment';

/**
 * POST /api/pi/incomplete
 * Pi.authenticate()가 넘겨주는 미완료 결제(onIncompletePaymentFound)를 서버에서 정리한다.
 *  - 요청 호스트로 앱을 판정하고 그 앱의 서버 키로 Pi Platform에 incomplete를 보낸다.
 *  - 서버 키 없음 → 준비 상태 JSON만 반환(화면 흐름 유지)
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const app = requestAppId(req);
  return NextResponse.json({
    ok: true,
    action: 'incomplete',
    endpoint: '/api/pi/incomplete',
    app,
    mode: hasPiApiKey(app) ? 'live' : 'sandbox-ready',
    body: { paymentId: 'string' }
  });
}

export async function POST(req: Request) {
  const app = requestAppId(req);
  const body = await readPaymentBody(req);
  const paymentId = body.paymentId;

  if (!isValidPaymentId(paymentId)) {
    return NextResponse.json({ ok: false, action: 'incomplete', app, error: 'paymentId is required' }, { status: 400 });
  }

  if (!hasPiApiKey(app)) {
    return NextResponse.json(sandboxPayload('incomplete', { app, paymentId, cleared: false }), { status: 200 });
  }

  const result = await incompletePayment(app, paymentId);

  return NextResponse.json(
    {
      ok: result.ok,
      mode: 'live',
      action: 'incomplete',
      app,
      paymentId,
      piStatus: result.status,
      error: result.ok ? null : result.error
    },
    { status: result.ok ? 200 : 502 }
  );
}
