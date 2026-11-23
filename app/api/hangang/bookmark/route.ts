import { NextResponse } from 'next/server';
import { bearerToken, readJson, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { appIdFromRequest } from '../../../lib/piAppContext';
import { sbDelete, sbSelect, sbUpsert, supabaseConfigured } from '../../../lib/supabaseAdmin';
import { lookupAccount, passEnabled } from '../../../lib/passServer';
import { summarizeAccount, FREE_BOOKMARK_LIMIT } from '../../../lib/passPlan';

/**
 * /api/hangang/bookmark — Hangang 장소·패스 북마크
 *
 *  GET    : 내가 저장한 spot_id 목록 + 저장 상한 정보
 *  POST   : { spotId } 토글 — 없으면 저장, 있으면 해제. 결과 목록을 그대로 돌려준다.
 *  DELETE : ?spotId=... (또는 body { spotId }) 해제
 *  - Pi accessToken으로 확인한 uid만 저장한다. (uid, spot_id) 유니크.
 *  - 무료 사용자는 3곳까지, Kedheon.pi Pass 사용자는 무제한(서버 판정).
 *    이미 3곳을 넘게 저장한 사용자(과거 데이터)는 기존 목록을 그대로 보되 새 저장만 막힌다.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SPOT_RE = /^[A-Za-z0-9_.:-]{1,64}$/;

/** 이 uid가 살아 있는 패스를 가지고 있는가 */
async function hasActivePass(app: ReturnType<typeof appIdFromRequest>, uid: string, username: string): Promise<boolean> {
  if (!passEnabled()) return false;
  const lookup = await lookupAccount(app, uid, username, false);
  if (!lookup.available) return false;
  return summarizeAccount(lookup.account).active;
}

interface BookmarkRow {
  spot_id: string;
  created_at: string;
}

async function listSpots(uid: string): Promise<{ ok: boolean; spotIds: string[]; status: number; error: string | null }> {
  const rows = await sbSelect<BookmarkRow>(
    'hangang_bookmarks',
    `select=spot_id,created_at&uid=eq.${encodeURIComponent(uid)}&order=created_at.desc&limit=200`
  );
  if (!rows.ok) return { ok: false, spotIds: [], status: rows.status, error: rows.error };
  return { ok: true, spotIds: (rows.data ?? []).map(r => r.spot_id), status: rows.status, error: null };
}

function spotFrom(req: Request, url: URL, body: Record<string, unknown>): string {
  const fromQuery = (url.searchParams.get('spotId') || '').trim();
  if (fromQuery) return fromQuery;
  return typeof body.spotId === 'string' ? body.spotId.trim() : '';
}

export async function GET(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ ok: false, error: 'Authorization: Bearer <accessToken> required' }, { status: 401 });

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });

  const { uid } = verified.user;
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, db: 'unconfigured', uid, spotIds: [], limit: FREE_BOOKMARK_LIMIT, unlimited: false });
  }

  const [list, unlimited] = await Promise.all([
    listSpots(uid),
    hasActivePass(appIdFromRequest(req), uid, verified.user.username)
  ]);
  if (!list.ok) {
    return NextResponse.json({ ok: false, db: 'error', dbStatus: list.status, error: list.error }, { status: 200 });
  }
  return NextResponse.json({
    ok: true,
    db: 'ready',
    uid,
    spotIds: list.spotIds,
    limit: unlimited ? null : FREE_BOOKMARK_LIMIT,
    unlimited
  });
}

export async function POST(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ ok: false, error: 'Authorization: Bearer <accessToken> required' }, { status: 401 });

  const body = await readJson(req);
  const url = new URL(req.url);
  const spotId = spotFrom(req, url, body);
  if (!SPOT_RE.test(spotId)) return NextResponse.json({ ok: false, error: 'invalid spotId' }, { status: 400 });

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });

  const { uid, username } = verified.user;
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, recorded: false, db: 'unconfigured', uid, spotId, added: null, spotIds: [] });
  }

  await sbUpsert('pi_users', { uid, username, last_seen_at: new Date().toISOString() }, 'uid');

  const existing = await sbSelect<BookmarkRow>(
    'hangang_bookmarks',
    `select=spot_id&uid=eq.${encodeURIComponent(uid)}&spot_id=eq.${encodeURIComponent(spotId)}&limit=1`
  );
  if (!existing.ok) {
    return NextResponse.json({ ok: false, db: 'error', dbStatus: existing.status, error: existing.error }, { status: 200 });
  }

  const has = Array.isArray(existing.data) && existing.data.length > 0;
  if (has) {
    const removed = await sbDelete('hangang_bookmarks', `uid=eq.${encodeURIComponent(uid)}&spot_id=eq.${encodeURIComponent(spotId)}`);
    if (!removed.ok) {
      return NextResponse.json({ ok: false, db: 'error', dbStatus: removed.status, error: removed.error }, { status: 200 });
    }
  } else {
    // 무료 상한 검사 — 패스 사용자만 무제한
    const [current, unlimited] = await Promise.all([
      listSpots(uid),
      hasActivePass(appIdFromRequest(req), uid, username)
    ]);
    if (!unlimited && current.ok && current.spotIds.length >= FREE_BOOKMARK_LIMIT) {
      return NextResponse.json({
        ok: true,
        recorded: false,
        db: 'ready',
        uid,
        spotId,
        added: false,
        limited: true,
        limit: FREE_BOOKMARK_LIMIT,
        unlimited: false,
        spotIds: current.spotIds
      });
    }
    const added = await sbUpsert<BookmarkRow>('hangang_bookmarks', { uid, spot_id: spotId }, 'uid,spot_id');
    if (!added.ok) {
      return NextResponse.json({ ok: false, db: 'error', dbStatus: added.status, error: added.error }, { status: 200 });
    }
  }

  const [list, unlimited] = await Promise.all([
    listSpots(uid),
    hasActivePass(appIdFromRequest(req), uid, username)
  ]);
  return NextResponse.json({
    ok: true,
    recorded: true,
    db: 'ready',
    uid,
    spotId,
    added: !has,
    limited: false,
    limit: unlimited ? null : FREE_BOOKMARK_LIMIT,
    unlimited,
    spotIds: list.ok ? list.spotIds : []
  });
}

export async function DELETE(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ ok: false, error: 'Authorization: Bearer <accessToken> required' }, { status: 401 });

  const body = await readJson(req);
  const url = new URL(req.url);
  const spotId = spotFrom(req, url, body);
  if (!SPOT_RE.test(spotId)) return NextResponse.json({ ok: false, error: 'invalid spotId' }, { status: 400 });

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });

  const { uid } = verified.user;
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, recorded: false, db: 'unconfigured', uid, spotId, spotIds: [] });
  }

  const removed = await sbDelete('hangang_bookmarks', `uid=eq.${encodeURIComponent(uid)}&spot_id=eq.${encodeURIComponent(spotId)}`);
  if (!removed.ok) {
    return NextResponse.json({ ok: false, db: 'error', dbStatus: removed.status, error: removed.error }, { status: 200 });
  }

  const list = await listSpots(uid);
  return NextResponse.json({
    ok: true,
    recorded: true,
    db: 'ready',
    uid,
    spotId,
    spotIds: list.ok ? list.spotIds : []
  });
}
