import { NextResponse } from 'next/server';
import {
  hasPiApiKey,
  isValidPaymentId,
  piRequest,
  readPaymentBody,
  sandboxPayload
} from '../lib';

/**
 * POST /api/pi/approve
 * Pi SDK가 결제를 만들면 프론트엔드의 onReadyForServerApproval(paymentId)가 이 라우트를 호출한다.
 *  - PI_API_KEY 있음  → Pi Platform API approve 전송 (mode: "live")
 *  - PI_API_KEY 없음  → 결제를 만들지 않고 준비 상태 JSON 반환 (mode: "sandbox-ready")
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    action: 'approve',
    endpoint: '/api/pi/approve',
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
      { ok: false, mode: hasPiApiKey() ? 'live' : 'sandbox-ready', action: 'approve', error: 'paymentId is required' },
      { status: 400 }
    );
  }

  if (!hasPiApiKey()) {
    return NextResponse.json(sandboxPayload('approve', { paymentId, approved: true }), { status: 200 });
  }

  const result = await piRequest(`/payments/${paymentId}/approve`, {});

  return NextResponse.json(
    {
      ok: result.ok,
      mode: 'live',
      action: 'approve',
      paymentId,
      piStatus: result.status,
      payment: result.data,
      error: result.ok ? null : result.error
    },
    { status: result.ok ? 200 : 502 }
  );
}
