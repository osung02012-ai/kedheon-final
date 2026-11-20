import { NextResponse } from 'next/server';
import { bearerToken, readJson, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { sbSelect, sbUpsert, supabaseConfigured } from '../../../lib/supabaseAdmin';

/**
 * /api/fact/vote — FactFilter 팩트체크 참여 투표
 *
 *  GET  : 공개 집계. item_id 별 총 투표 수와 판정별 수를 돌려준다(로그인 없이 읽기).
 *         Authorization 헤더가 있으면 내 투표(mine)도 함께 준다.
 *  POST : { itemId, verdict } — Pi accessToken으로 확인한 uid만 저장한다.
 *         (uid, item_id)가 유니크라 다시 투표하면 판정이 바뀐다(덮어쓰기).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** 허용 판정: 지지(endorse) · 반대(dispute) · 보류(unsure) */
const VERDICTS = new Set(['endorse', 'dispute', 'unsure']);
const ITEM_RE = /^[A-Za-z0-9_.:-]{1,80}$/;

interface VoteRow {
  item_id: string;
  verdict: string;
  uid?: string;
}

interface ItemCount {
  total: number;
  verdicts: Record<string, number>;
}

function aggregate(rows: VoteRow[]): Record<string, ItemCount> {
  const counts: Record<string, ItemCount> = {};
  for (const row of rows) {
    const item = (counts[row.item_id] ||= { total: 0, verdicts: {} });
    item.total += 1;
    item.verdicts[row.verdict] = (item.verdicts[row.verdict] || 0) + 1;
  }
  return counts;
}

async function loadCounts(itemId?: string): Promise<{ ok: boolean; counts: Record<string, ItemCount>; status: number; error: string | null }> {
  const filter = itemId ? `&item_id=eq.${encodeURIComponent(itemId)}` : '';
  const rows = await sbSelect<VoteRow>('fact_votes', `select=item_id,verdict${filter}&limit=20000`);
  if (!rows.ok) return { ok: false, counts: {}, status: rows.status, error: rows.error };
  return { ok: true, counts: aggregate(rows.data ?? []), status: rows.status, error: null };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const itemId = (url.searchParams.get('itemId') || '').trim();
  if (itemId && !ITEM_RE.test(itemId)) {
    return NextResponse.json({ ok: false, error: 'invalid itemId' }, { status: 400 });
  }

  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, db: 'unconfigured', counts: {}, mine: {} });
  }

  const result = await loadCounts(itemId || undefined);
  if (!result.ok) {
    return NextResponse.json({ ok: false, db: 'error', dbStatus: result.status, error: result.error }, { status: 200 });
  }

  // 로그인 상태면 내 투표를 함께 준다(실패해도 공개 집계는 그대로).
  let mine: Record<string, string> = {};
  let uid: string | null = null;
  const token = bearerToken(req);
  if (token) {
    const verified = await verifyPiAccessToken(token);
    if (verified.ok) {
      uid = verified.user.uid;
      const rows = await sbSelect<VoteRow>(
        'fact_votes',
        `select=item_id,verdict&uid=eq.${encodeURIComponent(uid)}${itemId ? `&item_id=eq.${encodeURIComponent(itemId)}` : ''}&limit=5000`
      );
      if (rows.ok && Array.isArray(rows.data)) {
        mine = Object.fromEntries(rows.data.map(r => [r.item_id, r.verdict]));
      }
    }
  }

  return NextResponse.json({ ok: true, db: 'ready', uid, counts: result.counts, mine });
}

export async function POST(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ ok: false, error: 'Authorization: Bearer <accessToken> required' }, { status: 401 });

  const body = await readJson(req);
  const itemId = typeof body.itemId === 'string' ? body.itemId.trim() : '';
  const verdict = typeof body.verdict === 'string' ? body.verdict.trim().toLowerCase() : '';

  if (!ITEM_RE.test(itemId)) return NextResponse.json({ ok: false, error: 'invalid itemId' }, { status: 400 });
  if (!VERDICTS.has(verdict)) {
    return NextResponse.json({ ok: false, error: `verdict must be one of ${[...VERDICTS].join(', ')}` }, { status: 400 });
  }

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });

  const { uid, username } = verified.user;

  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, recorded: false, db: 'unconfigured', uid, itemId, verdict });
  }

  await sbUpsert('pi_users', { uid, username, last_seen_at: new Date().toISOString() }, 'uid');

  const saved = await sbUpsert<VoteRow>(
    'fact_votes',
    { uid, item_id: itemId, verdict },
    'uid,item_id'
  );
  if (!saved.ok) {
    return NextResponse.json(
      { ok: false, recorded: false, db: 'error', dbStatus: saved.status, error: saved.error },
      { status: 200 }
    );
  }

  const counts = await loadCounts(itemId);
  const item = counts.counts[itemId] || { total: 0, verdicts: {} };

  return NextResponse.json({
    ok: true,
    recorded: true,
    db: 'ready',
    uid,
    itemId,
    verdict,
    count: item.total,
    verdicts: item.verdicts
  });
}
