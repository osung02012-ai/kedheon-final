import { NextResponse } from 'next/server';
import { bearerToken, readJson, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { appIdFromRequest } from '../../../lib/piAppContext';
import { lookupAccount, passEnabled } from '../../../lib/passServer';
import { sbFetch, sbSelect, supabaseConfigured } from '../../../lib/supabaseAdmin';
import { summarizeAccount } from '../../../lib/passPlan';
import { rateLimit } from '../../../lib/rateLimit';

/**
 * /api/fact/request — FactFilter 우선 검증 요청 큐
 *
 *  POST { query, country, note? } — Pi accessToken으로 확인한 uid의 요청을 큐에 넣는다.
 *    · 패스 사용자: priority = 1 (큐 상단·먼저 검증)
 *    · 무료 사용자: priority = 0 (접수는 그대로, 순번은 뒤)
 *    결제 없이도 접수된다 — 패스는 순서를 바꿀 뿐, 검증 요청 자체를 막지 않는다.
 *  GET — 대기열 규모와 내 요청 수(개인정보 최소화: 내용은 돌려주지 않는다).
 *
 *  주의: FactFilter의 현행 검증은 해시 기반 목업이다. 이 큐는 "접수·우선순위"만 담당하고,
 *  유료 심층 리포트처럼 보이는 문구는 쓰지 않는다(감사 G7).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const QUERY_MAX = 500;
const NOTE_MAX = 600;

export async function GET(req: Request) {
  if (!supabaseConfigured()) return NextResponse.json({ ok: true, db: 'unconfigured', queued: 0, mine: 0 });

  const token = bearerToken(req);
  const queue = await sbSelect<{ id: string; priority: number }>('fact_requests', 'select=id,priority&status=eq.queued&limit=2000');
  if (!queue.ok) {
    return NextResponse.json({ ok: true, db: 'error', queued: 0, mine: 0, error: queue.error });
  }
  const rows = queue.data ?? [];
  let mine = 0;
  if (token) {
    const verified = await verifyPiAccessToken(token);
    if (verified.ok) {
      const mineRows = await sbSelect<{ id: string }>(
        'fact_requests',
        `select=id&uid=eq.${encodeURIComponent(verified.user.uid)}&status=eq.queued&limit=500`
      );
      mine = mineRows.ok && Array.isArray(mineRows.data) ? mineRows.data.length : 0;
    }
  }
  return NextResponse.json({
    ok: true,
    db: 'ready',
    queued: rows.length,
    priorityQueued: rows.filter(r => Number(r.priority) > 0).length,
    mine
  });
}

export async function POST(req: Request) {
  const app = appIdFromRequest(req);
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ ok: false, error: 'accessToken required' }, { status: 401 });

  const body = await readJson(req);
  const query = typeof body.query === 'string' ? body.query.trim().slice(0, QUERY_MAX) : '';
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, NOTE_MAX) : '';
  const country = typeof body.country === 'string' ? body.country.trim().toUpperCase().slice(0, 8) : 'GLOBAL';
  if (query.length < 4) {
    return NextResponse.json({ ok: false, error: 'query too short' }, { status: 400 });
  }

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });
  const { uid, username } = verified.user;

  const limited = rateLimit(`factreq:${uid}`, 3, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, error: 'too many requests' }, { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } });
  }

  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, db: 'unconfigured', queued: false, priority: 0 });
  }

  let priority = 0;
  if (passEnabled()) {
    const lookup = await lookupAccount(app, uid, username, false);
    const summary = summarizeAccount(lookup.account);
    priority = lookup.available && summary.active ? 1 : 0;
  }

  const inserted = await sbFetch<{ id: string; priority: number; created_at: string }[]>('fact_requests', {
    method: 'POST',
    body: {
      uid,
      username,
      app_id: 'factfilter',
      country: country || 'GLOBAL',
      query,
      note,
      priority,
      status: 'queued'
    },
    prefer: 'return=representation'
  });

  if (!inserted.ok) {
    return NextResponse.json({ ok: false, db: 'error', error: inserted.error }, { status: 200 });
  }

  const row = Array.isArray(inserted.data) ? inserted.data[0] : null;

  // 내 앞에 쌓인 대기 수(패스=우선 큐, 무료=일반 큐) — 순번 안내용
  const ahead = await sbSelect<{ id: string }>(
    'fact_requests',
    priority > 0
      ? 'select=id&status=eq.queued&priority=gt.0&limit=500'
      : 'select=id&status=eq.queued&priority=eq.0&limit=500'
  );

  return NextResponse.json({
    ok: true,
    db: 'ready',
    recorded: true,
    id: row?.id ?? null,
    priority,
    queue: ahead.ok && Array.isArray(ahead.data) ? ahead.data.length : null,
    createdAt: row?.created_at ?? new Date().toISOString()
  });
}
