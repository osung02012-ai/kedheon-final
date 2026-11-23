import { NextResponse } from 'next/server';
import { loadCounter, passEnabled } from '../../../lib/passServer';
import { counterState } from '../../../lib/passPlan';

/**
 * GET /api/pass/counter — 창립/얼리 남은 자리 (공개, 인증 없음)
 *  - pass_counter 한 행만 읽는다(집계 쿼리 없음). 부여 직후에는 touch·complete 응답의
 *    counter 값으로 화면이 즉시 갱신되므로 폴링은 시트가 열려 있을 때만 한다.
 *  - no-store: 카운터는 실시간 값이다.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!passEnabled()) {
    return NextResponse.json(
      { ok: true, enabled: false, available: false, counter: counterState(null) },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
  const result = await loadCounter();
  return NextResponse.json(
    {
      ok: true,
      enabled: true,
      available: result.available,
      counter: result.counter,
      error: result.error
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
