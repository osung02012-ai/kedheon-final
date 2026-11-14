import { NextResponse } from 'next/server';
import {
  hasPiApiKey,
  isValidPaymentId,
  isValidTxid,
  piRequest,
  readPaymentBody,
  sandboxPayload
} from '../lib';

/**
 * POST /api/pi/complete
 * onReadyForServerCompletion(paymentId, txid) → 서버가 Pi Platform API complete를 보낸다.
 * 이 호출이 성공해야 파이가 실제로 우리 지갑으로 이동한다.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    action: 'complete',
    endpoint: '/api/pi/complete',
    mode: hasPiApiKey() ? 'live' : 'sandbox-ready',
    missingEnv: hasPiApiKey() ? null : 'PI_API_KEY',
    body: { paymentId: 'string', txid: 'string' }
  });
}

export async function POST(req: Request) {
  const body = await readPaymentBody(req);
  const paymentId = body.paymentId;
  const txid = body.txid;

  if (!isValidPaymentId(paymentId) || !isValidTxid(txid)) {
    return NextResponse.json(
      {
        ok: false,
        mode: hasPiApiKey() ? 'live' : 'sandbox-ready',
        action: 'complete',
        error: 'paymentId and txid are required'
      },
      { status: 400 }
    );
  }

  if (!hasPiApiKey()) {
    return NextResponse.json(sandboxPayload('complete', { paymentId, txid, completed: true }), { status: 200 });
  }

  const result = await piRequest(`/payments/${paymentId}/complete`, { txid });
  const payment = result.data as { status?: { transaction_verified?: boolean } } | null;

  return NextResponse.json(
    {
      ok: result.ok,
      mode: 'live',
      action: 'complete',
      paymentId,
      txid,
      piStatus: result.status,
      transactionVerified: payment?.status?.transaction_verified ?? null,
      payment: result.data,
      error: result.ok ? null : result.error
    },
    { status: result.ok ? 200 : 502 }
  );
}
