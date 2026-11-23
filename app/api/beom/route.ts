import { NextResponse } from 'next/server';
import { bearerToken, readJson, startOfSeoulDay, verifyPiAccessToken } from '../../lib/piServerAuth';
import { appIdFromRequest } from '../../lib/piAppContext';
import { sbSelect, sbSum, sbUpdate, sbUpsert, supabaseConfigured } from '../../lib/supabaseAdmin';
import { lookupAccount, passEnabled } from '../../lib/passServer';
import { summarizeAccount } from '../../lib/passPlan';

/**
 * /api/beom — BEOM(발자국) 원장
 *
 *  GET  : Pi accessToken으로 uid를 확인하고, 그 사람의 beom_total과 최근 발자국을 돌려준다.
 *  POST : { app, action } → 서버가 정한 고정 적립액만 기록한다(delta를 클라이언트에 맡기지 않는다).
 *         하루 한 번인 출석은 같은 날 재요청 시 already:true, delta:0으로 끝낸다.
 *         같은 행동의 하루 상한(cap)을 넘으면 역시 기록하지 않는다.
 *  - 적립액은 클라이언트 조작을 막기 위해 아래 ACTIONS 표가 유일한 출처다.
 *  - Kedheon.pi Pass 사용자는 적립이 ×1.5 (출석 50→75, 다른 적립도 반올림). 배율은 서버가 판정한다.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ActionRule {
  /** 적립 BEOM */
  delta: number;
  /** 같은 앱·행동의 하루 최대 적립 횟수 */
  cap: number;
}

/** 서버가 인정하는 행동과 적립액 (앱:행동) */
const ACTIONS: Record<string, ActionRule> = {
  'kedheon:attendance': { delta: 50, cap: 1 },
  'factfilter:verify': { delta: 2, cap: 20 },
  'factfilter:report': { delta: 10, cap: 10 },
  'factfilter:seal': { delta: 5, cap: 10 },
  'factfilter:endorse': { delta: 1, cap: 30 },
  'hangang:booking': { delta: 5, cap: 10 },
  'hangang:request': { delta: 2, cap: 10 }
};

/** Kedheon.pi Pass 사용자의 BEOM 배율 */
const PASS_MULTIPLIER = 1.5;

/** 배율 적용 — 정수로 반올림(출석 50 → 75). 원장에는 적용된 값만 남는다. */
function boosted(delta: number, multiplier: number): number {
  if (multiplier === 1) return delta;
  return Math.round(delta * multiplier);
}

/** 이 앱의 uid가 살아 있는 패스를 가지고 있는가 (서버 판정 — 클라 조작 불가) */
async function passMultiplier(app: ReturnType<typeof appIdFromRequest>, uid: string, username: string): Promise<number> {
  if (!passEnabled()) return 1;
  const lookup = await lookupAccount(app, uid, username, false);
  if (!lookup.available) return 1;
  return summarizeAccount(lookup.account).active ? PASS_MULTIPLIER : 1;
}

const NAME_RE = /^[a-z0-9_-]{2,32}$/;

interface BeomLogRow {
  id: number;
  app: string;
  action: string;
  delta: number;
  created_at: string;
}

async function currentTotal(uid: string): Promise<number> {
  const user = await sbSelect<{ beom_total: number | null }>(
    'pi_users',
    `select=beom_total&uid=eq.${encodeURIComponent(uid)}&limit=1`
  );
  if (user.ok && Array.isArray(user.data) && user.data.length > 0) {
    return Number(user.data[0].beom_total ?? 0) || 0;
  }
  return 0;
}

async function todayCount(uid: string, app: string, action: string, since: string): Promise<number> {
  const rows = await sbSelect<{ id: number }>(
    'beom_logs',
    `select=id&uid=eq.${encodeURIComponent(uid)}&app=eq.${encodeURIComponent(app)}&action=eq.${encodeURIComponent(
      action
    )}&created_at=gte.${encodeURIComponent(since)}&limit=200`
  );
  return rows.ok && Array.isArray(rows.data) ? rows.data.length : 0;
}

export async function GET(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ ok: false, error: 'Authorization: Bearer <accessToken> required' }, { status: 401 });

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });

  const { uid } = verified.user;

  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: true, db: 'unconfigured', uid, beomTotal: 0, logs: [] });
  }

  const [total, logs] = await Promise.all([
    currentTotal(uid),
    sbSelect<BeomLogRow>(
      'beom_logs',
      `select=id,app,action,delta,created_at&uid=eq.${encodeURIComponent(uid)}&order=created_at.desc&limit=30`
    )
  ]);

  if (!logs.ok) {
    return NextResponse.json({ ok: false, db: 'error', dbStatus: logs.status, error: logs.error }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    db: 'ready',
    uid,
    username: verified.user.username,
    beomTotal: total,
    logs: logs.data ?? [],
    actions: Object.keys(ACTIONS)
  });
}

export async function POST(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ ok: false, error: 'Authorization: Bearer <accessToken> required' }, { status: 401 });

  const body = await readJson(req);
  const app = typeof body.app === 'string' ? body.app.trim().toLowerCase() : '';
  const action = typeof body.action === 'string' ? body.action.trim().toLowerCase() : '';

  if (!NAME_RE.test(app) || !NAME_RE.test(action)) {
    return NextResponse.json({ ok: false, error: 'app and action are required' }, { status: 400 });
  }

  const rule = ACTIONS[`${app}:${action}`];
  if (!rule) {
    return NextResponse.json({ ok: false, error: `unknown action: ${app}:${action}` }, { status: 400 });
  }

  const verified = await verifyPiAccessToken(token);
  if (!verified.ok) return NextResponse.json({ ok: false, error: verified.error }, { status: verified.status });

  const { uid, username } = verified.user;

  if (!supabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      recorded: false,
      db: 'unconfigured',
      uid,
      delta: 0,
      beomTotal: 0,
      note: 'DB not configured; client keeps its local state.'
    });
  }

  // pi_users 행이 없으면 FK 때문에 기록이 실패한다 — 먼저 보장한다.
  await sbUpsert('pi_users', { uid, username, last_seen_at: new Date().toISOString() }, 'uid');

  const since = startOfSeoulDay();
  const used = await todayCount(uid, app, action, since);

  if (used >= rule.cap) {
    return NextResponse.json({
      ok: true,
      recorded: false,
      already: true,
      db: 'ready',
      uid,
      delta: 0,
      beomTotal: await currentTotal(uid),
      note: rule.cap === 1 ? 'already recorded today' : 'daily cap reached'
    });
  }

  const multiplier = await passMultiplier(appIdFromRequest(req), uid, username);
  const delta = boosted(rule.delta, multiplier);

  const inserted = await sbUpsert<BeomLogRow>('beom_logs', { uid, app, action, delta }, undefined, true);
  if (!inserted.ok) {
    return NextResponse.json(
      { ok: false, recorded: false, db: 'error', dbStatus: inserted.status, error: inserted.error },
      { status: 200 }
    );
  }

  // 정확한 집계: 원장 합계를 그대로 beom_total에 반영한다(증분 누적 오차 없음).
  const sum = await sbSum('beom_logs', 'delta', `uid=eq.${encodeURIComponent(uid)}`);
  const total = sum.ok ? sum.sum : (await currentTotal(uid)) + delta;

  await sbUpdate('pi_users', `uid=eq.${encodeURIComponent(uid)}`, {
    beom_total: total,
    username,
    last_seen_at: new Date().toISOString()
  });

  const log = Array.isArray(inserted.data) && inserted.data.length > 0 ? inserted.data[0] : null;

  return NextResponse.json({
    ok: true,
    recorded: true,
    already: false,
    db: 'ready',
    uid,
    app,
    action,
    delta,
    multiplier,
    beomTotal: total,
    logId: log?.id ?? null,
    createdAt: log?.created_at ?? new Date().toISOString()
  });
}
