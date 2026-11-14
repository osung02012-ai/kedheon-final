import { NextResponse } from 'next/server';
import {
  hasPiApiKey,
  isValidPaymentId,
  piRequest,
  readPaymentBody,
  sandboxPayload
} from '../lib';

/**
 * POST /api/pi/incomplete
 * Pi.authenticate()가 넘겨주는 미완료 결제(onIncompletePaymentFound)를 서버에서 정리한다.
 *  - PI_API_KEY 있음  → Pi Platform API incomplete 전송 (해당 결제를 취소·정리)
 *  - PI_API_KEY 없음  → 준비 상태 JSON만 반환
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    action: 'incomplete',
    endpoint: '/api/pi/incomplete',
    mode: hasPiApiKey() ? 'live' : 'sandbox-ready',
    missingEnv: hasPiApiKey() ? null : 'PI_API_KEY',
    body: { paymentId: 'string' }
  });
}

export async function POST(req: Request) {
  const body = await readPaymentBody(req);
  const paymentId = body.paymentId;

  if (!isValidPaymentId(paymentId)) {
    return NextResponse.json(
      { ok: false, mode: hasPiApiKey() ? 'live' : 'sandbox-ready', action: 'incomplete', error: 'paymentId is required' },
      { status: 400 }
    );
  }

  if (!hasPiApiKey()) {
    return NextResponse.json(sandboxPayload('incomplete', { paymentId, cleared: true }), { status: 200 });
  }

  const result = await piRequest(`/payments/${paymentId}/incomplete`, {});

  return NextResponse.json(
    {
      ok: result.ok,
      mode: 'live',
      action: 'incomplete',
      paymentId,
      piStatus: result.status,
      payment: result.data,
      error: result.ok ? null : result.error
    },
    { status: result.ok ? 200 : 502 }
  );
}
