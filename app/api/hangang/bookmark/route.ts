import { NextResponse } from 'next/server';
import { bearerToken, readJson, verifyPiAccessToken } from '../../../lib/piServerAuth';
import { sbDelete, sbSelect, sbUpsert, supabaseConfigured } from '../../../lib/supabaseAdmin';

/**
 * /api/hangang/bookmark — Hangang 장소·패스 북마크
 *
 *  GET    : 내가 저장한 spot_id 목록
 *  POST   : { spotId } 토글 — 없으면 저장, 있으면 해제. 결과 목록을 그대로 돌려준다.
 *  DELETE : ?spotId=... (또는 body { spotId }) 해제
 *  - Pi accessToken으로 확인한 uid만 저장한다. (uid, spot_id) 유니크.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SPOT_RE = /^[A-Za-z0-9_.:-]{1,64}$/;

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
  if (!supabaseConfigured()) return NextResponse.json({ ok: true, db: 'unconfigured', uid, spotIds: [] });

  const list = await listSpots(uid);
  if (!list.ok) {
    return NextResponse.json({ ok: false, db: 'error', dbStatus: list.status, error: list.error }, { status: 200 });
  }
  return NextResponse.json({ ok: true, db: 'ready', uid, spotIds: list.spotIds });
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
    const added = await sbUpsert<BookmarkRow>('hangang_bookmarks', { uid, spot_id: spotId }, 'uid,spot_id');
    if (!added.ok) {
      return NextResponse.json({ ok: false, db: 'error', dbStatus: added.status, error: added.error }, { status: 200 });
    }
  }

  const list = await listSpots(uid);
  return NextResponse.json({
    ok: true,
    recorded: true,
    db: 'ready',
    uid,
    spotId,
    added: !has,
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
