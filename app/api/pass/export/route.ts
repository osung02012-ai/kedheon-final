import { NextRequest, NextResponse } from 'next/server';
import { bearerToken, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { appIdFromRequest } from '../../../lib/piAppContext';
import { lookupAccount, passEnabled } from '../../../lib/passServer';
import { sbSelect } from '../../../lib/supabaseAdmin';
import { summarizeAccount } from '../../../lib/passPlan';
import { rateLimit } from '../../../lib/rateLimit';

/**
 * GET /api/pass/export — 패스 사용자의 활동 기록 CSV
 *
 *  - BEOM 원장(beom_logs) · 팩트체크 투표(fact_votes) · 저장한 권역(hangang_bookmarks)을
 *    한 파일로 내보낸다. 세 앱의 uid가 서로 다르므로 pass_app_links의 uid 목록으로 모은다.
 *  - 패스가 살아 있는 사람만(만료 전). 분당 3회.
 *  - 값은 그대로, 형식은 `source,app,key,value,created_at`.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

interface LinkRow {
  app_id: string;
  uid: string;
}

export async function GET(req: NextRequest) {
  if (!passEnabled()) return NextResponse.json({ ok: false, error: 'pass disabled' }, { status: 404 });

  const token = bearerToken(req);
  if (!token) return NextResponse.json({ ok: false, error: 'accessToken required' }, { status: 401 });

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });

  const limited = rateLimit(`export:${verified.user.uid}`, 3, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, error: 'too many exports' }, { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } });
  }

  const app = appIdFromRequest(req);
  const lookup = await lookupAccount(app, verified.user.uid, verified.user.username, false);
  if (!lookup.available) return NextResponse.json({ ok: false, error: 'pass unavailable' }, { status: 404 });
  const account = lookup.account;
  const summary = summarizeAccount(account);
  if (!account || !summary.active) {
    return NextResponse.json({ ok: false, error: 'pass required', pass: summary }, { status: 403 });
  }

  const links = await sbSelect<LinkRow>('pass_app_links', `select=app_id,uid&account_id=eq.${encodeURIComponent(account.id)}`);
  const uids = links.ok && Array.isArray(links.data) ? links.data.map(l => l.uid).filter(Boolean) : [verified.user.uid];
  const filter = `uid=in.(${uids.map(u => `"${u.replace(/"/g, '')}"`).join(',')})`;

  const [beom, votes, bookmarks] = await Promise.all([
    sbSelect<{ app: string; action: string; delta: number; created_at: string }>(
      'beom_logs',
      `select=app,action,delta,created_at&${filter}&order=created_at.desc&limit=5000`
    ),
    sbSelect<{ item_id: string; verdict: string; created_at?: string }>(
      'fact_votes',
      `select=item_id,verdict&${filter}&limit=5000`
    ),
    sbSelect<{ spot_id: string; created_at: string }>(
      'hangang_bookmarks',
      `select=spot_id,created_at&${filter}&order=created_at.desc&limit=2000`
    )
  ]);

  const lines: string[] = ['source,app,key,value,created_at'];
  for (const row of beom.data ?? []) {
    lines.push(['beom', row.app, row.action, row.delta, row.created_at].map(csvCell).join(','));
  }
  for (const row of votes.data ?? []) {
    lines.push(['fact_vote', 'factfilter', row.item_id, row.verdict, row.created_at ?? ''].map(csvCell).join(','));
  }
  for (const row of bookmarks.data ?? []) {
    lines.push(['hangang_bookmark', 'hangang', row.spot_id, 'saved', row.created_at].map(csvCell).join(','));
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse('\uFEFF' + lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="kedheon-pass-${stamp}.csv"`,
      'Cache-Control': 'no-store'
    }
  });
}
