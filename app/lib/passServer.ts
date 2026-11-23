/**
 * Kedheon.pi Pass 서버 로직 — 계정 찾기·터치·요약·가격 확정·이용권 부여의 공용 경로
 *
 *  - 전역 키는 username이다(Pi uid는 앱마다 다른 값). (app_id, uid)는 pass_app_links로 잇는다.
 *  - 회원번호 발급과 30일 부여는 Postgres 함수(pass_touch·pass_redeem)에서만 일어난다.
 *    행 잠금으로 직렬화되어 중복·결번이 없고, payment_id UNIQUE로 이중 지급이 막힌다.
 *  - 테이블·함수가 아직 없으면(마이그레이션 전) 예외를 던지지 않고 available:false로 끝낸다.
 *    화면은 그동안 패스 UI를 숨기고 기존 기능을 그대로 쓴다.
 */

import {
  counterState,
  summarizeAccount,
  type PassAccountRow,
  type PassAppId,
  type PassCounterState,
  type PassSummary
} from './passPlan';
import { sbRpc, sbSelect, supabaseConfigured } from './supabaseAdmin';
import { paymentsReadyFor } from './piAppContext';

/** PASS_ENABLED=false 로 두면 배포 상태에서 패스 UI·API가 꺼진다(기본은 켜짐). */
export function passEnabled(): boolean {
  if ((process.env.PASS_ENABLED || '').toLowerCase() === 'false') return false;
  return supabaseConfigured();
}

const ACCOUNT_COLUMNS = 'id,username,member_number,tier,genesis_number,pass_expires_at,pass_source';

export interface PassLookup {
  ok: boolean;
  available: boolean;
  account: PassAccountRow | null;
  error: string | null;
  status: number;
}

/** 테이블·함수가 없는 상태(마이그레이션 전)인지 */
function isMissingObject(status: number, error: string | null): boolean {
  if (status === 404) return true;
  const message = (error || '').toLowerCase();
  return (
    message.includes('could not find the function') ||
    message.includes('does not exist') ||
    message.includes('schema cache') ||
    message.includes('pgrst202') ||
    message.includes('42p01') ||
    message.includes('pgrst205')
  );
}

/**
 * 로그인한 사람의 패스 계정을 (app_id, uid) 링크로 찾는다. 읽기 전용.
 * touch=true면 pass_touch를 불러 번호 발급·30일 무료 부여까지 수행한다(로그인 경로).
 */
export async function lookupAccount(
  app: PassAppId,
  uid: string,
  username: string,
  touch = false
): Promise<PassLookup> {
  if (!passEnabled()) return { ok: true, available: false, account: null, error: null, status: 0 };

  if (touch) {
    const rpc = await sbRpc<PassAccountRow | PassAccountRow[]>('pass_touch', {
      p_app_id: app,
      p_uid: uid,
      p_username: username || 'pioneer',
      p_network: 'mainnet'
    });
    if (!rpc.ok) {
      return {
        ok: false,
        available: !isMissingObject(rpc.status, rpc.error),
        account: null,
        error: rpc.error,
        status: rpc.status
      };
    }
    const row = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
    return { ok: true, available: true, account: (row as PassAccountRow) ?? null, error: null, status: rpc.status };
  }

  const link = await sbSelect<{ account_id: string; pass_accounts: PassAccountRow | PassAccountRow[] | null }>(
    'pass_app_links',
    `select=account_id,pass_accounts(${ACCOUNT_COLUMNS})&app_id=eq.${encodeURIComponent(app)}&uid=eq.${encodeURIComponent(uid)}&limit=1`
  );
  if (!link.ok) {
    return {
      ok: false,
      available: !isMissingObject(link.status, link.error),
      account: null,
      error: link.error,
      status: link.status
    };
  }
  const first = Array.isArray(link.data) ? link.data[0] : null;
  const nested = first?.pass_accounts;
  const account = (Array.isArray(nested) ? nested[0] : nested) ?? null;
  return { ok: true, available: true, account, error: null, status: link.status };
}

/** 창립/얼리 잔여 자리 — pass_counter 한 행만 읽는다. */
export async function loadCounter(): Promise<{ ok: boolean; available: boolean; counter: PassCounterState; error: string | null }> {
  if (!passEnabled()) {
    return { ok: true, available: false, counter: counterState(null), error: null };
  }
  const row = await sbSelect<Record<string, unknown>>(
    'pass_counter',
    'select=last_number,genesis_limit,early_limit,updated_at&id=eq.1&limit=1'
  );
  if (!row.ok) {
    return {
      ok: false,
      available: !isMissingObject(row.status, row.error),
      counter: counterState(null),
      error: row.error
    };
  }
  const first = Array.isArray(row.data) ? row.data[0] : null;
  return { ok: true, available: true, counter: counterState(first), error: null };
}

export interface PassStatusPayload {
  enabled: boolean;
  available: boolean;
  app: PassAppId;
  account: PassAccountRow | null;
  pass: PassSummary | null;
  counter: PassCounterState;
  paymentsReady: boolean;
  priceNextPi: number;
  error?: string | null;
}

/** 화면·API 공통 응답 묶음 */
export function passPayload(
  app: PassAppId,
  account: PassAccountRow | null,
  counter: PassCounterState,
  error: string | null = null,
  available = true
): PassStatusPayload {
  return {
    enabled: passEnabled(),
    available: available && passEnabled(),
    app,
    account,
    pass: account ? summarizeAccount(account) : null,
    counter,
    paymentsReady: paymentsReadyFor(app),
    priceNextPi: account ? summarizeAccount(account).priceNextPi : 1,
    error
  };
}

/** 이용권 부여(멱등) — payment_id가 같으면 만료일이 변하지 않는다. */
export async function redeemPass(args: {
  accountId: string;
  app: PassAppId;
  paymentId: string;
  txid: string | null;
  amountPi: number;
  quoteId: string | null;
  network: string;
}): Promise<{ ok: boolean; account: PassAccountRow | null; error: string | null; status: number }> {
  const rpc = await sbRpc<PassAccountRow | PassAccountRow[]>('pass_redeem', {
    p_account_id: args.accountId,
    p_app_id: args.app,
    p_payment_id: args.paymentId,
    p_txid: args.txid,
    p_amount: args.amountPi,
    p_network: args.network,
    p_quote_id: args.quoteId
  });
  if (!rpc.ok) return { ok: false, account: null, error: rpc.error, status: rpc.status };
  const row = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
  return { ok: true, account: (row as PassAccountRow) ?? null, error: null, status: rpc.status };
}

/** 회원번호·등급이 이미 발급된 계정인가(견적 발급 전제) */
export function hasMemberNumber(account: PassAccountRow | null): boolean {
  return account?.member_number !== null && account?.member_number !== undefined;
}
