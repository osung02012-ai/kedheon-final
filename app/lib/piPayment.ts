/**
 * Pi 결제 레코드 검증 — approve / complete / incomplete가 같은 규칙을 쓴다.
 *
 *  - 결제의 소유자·금액·취소 여부는 **Pi Platform이 가진 원본**으로만 확인한다.
 *    클라이언트가 보낸 uid·amount·metadata는 신뢰하지 않는다.
 *  - Pi 결제 메타데이터는 createPayment 때 앱이 넣은 값이라, 상품(pass_30d)·견적 id는
 *    여기서 읽는다(클라이언트가 승인 단계에서 다른 값을 주장해도 반영되지 않는다).
 */

import { piRequest } from '../api/pi/lib';
import type { PassAppId } from './passPlan';

export interface PiPaymentStatus {
  developer_approved?: boolean;
  transaction_verified?: boolean;
  user_cancelled?: boolean;
  developer_completed?: boolean;
  cancelled?: boolean;
}

export interface PiPaymentRecord {
  identifier: string;
  user_uid: string;
  amount: number;
  memo?: string;
  metadata?: Record<string, unknown> | null;
  network?: string;
  transaction?: { txid?: string; verified?: boolean; _link?: string } | null;
  status?: PiPaymentStatus;
  created_at?: string;
}

export interface PaymentLookup {
  ok: boolean;
  payment: PiPaymentRecord | null;
  status: number;
  error: string | null;
  /** 앱 서버 키가 없어 Pi Platform에 물어보지 못한 경우 */
  noKey: boolean;
}

function numberOrNull(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** GET /payments/{id} — 앱 키로 원본 결제를 읽는다. */
export async function fetchPayment(app: PassAppId, paymentId: string): Promise<PaymentLookup> {
  const res = await piRequest(`/payments/${paymentId}`, {}, { method: 'GET', app });
  if (!res.ok) {
    return {
      ok: false,
      payment: null,
      status: res.status,
      error: res.error ?? 'payment lookup failed',
      noKey: res.status === 0 && res.error === 'Pi server key not set'
    };
  }
  const raw = res.data as Record<string, unknown> | null;
  if (!raw || typeof raw !== 'object') {
    return { ok: false, payment: null, status: res.status, error: 'payment not found', noKey: false };
  }
  const amount = numberOrNull(raw.amount);
  const payment: PiPaymentRecord = {
    identifier: String(raw.identifier ?? paymentId),
    user_uid: typeof raw.user_uid === 'string' ? raw.user_uid : '',
    amount: amount ?? 0,
    memo: typeof raw.memo === 'string' ? raw.memo : undefined,
    metadata: (raw.metadata && typeof raw.metadata === 'object' ? (raw.metadata as Record<string, unknown>) : null) ?? null,
    network: typeof raw.network === 'string' ? raw.network : undefined,
    transaction:
      raw.transaction && typeof raw.transaction === 'object'
        ? (raw.transaction as PiPaymentRecord['transaction'])
        : null,
    status:
      raw.status && typeof raw.status === 'object' ? (raw.status as PiPaymentStatus) : undefined,
    created_at: typeof raw.created_at === 'string' ? raw.created_at : undefined
  };
  return { ok: true, payment, status: res.status, error: null, noKey: false };
}

export function paymentMetadataOf(payment: PiPaymentRecord | null): Record<string, unknown> {
  const meta = payment?.metadata;
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return {};
  return meta;
}

export function isCancelled(payment: PiPaymentRecord | null): boolean {
  return Boolean(payment?.status?.user_cancelled || payment?.status?.cancelled);
}

/** 금액 비교 — Pi 금액은 7자리 소수까지 온다. 부동소수 오차만 허용한다. */
export function amountMatches(paymentAmount: number, expected: number): boolean {
  if (!Number.isFinite(paymentAmount) || !Number.isFinite(expected)) return false;
  return Math.abs(paymentAmount - expected) <= 1e-6;
}

export async function approvePayment(app: PassAppId, paymentId: string) {
  return piRequest(`/payments/${paymentId}/approve`, {}, { app });
}

export async function completePayment(app: PassAppId, paymentId: string, txid: string) {
  return piRequest(`/payments/${paymentId}/complete`, { txid }, { app });
}

export async function incompletePayment(app: PassAppId, paymentId: string) {
  return piRequest(`/payments/${paymentId}/incomplete`, {}, { app });
}
