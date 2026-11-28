#!/usr/bin/env python3
"""월남뽕 계정 연동/병합 회귀 테스트 (2026-11-28)

2026-11-28 실측 문제 — 같은 사람인데 계정이 둘로 갈라졌다:
  · 크롬(일반 브라우저)  `Player` #001 · 16승 · 23판 · π 없음
  · Pi Browser          `david`  · 6승  · 8판  · π ohsangjo 인증

여기서 못 박는 것
  A. DB — 기기 별칭(wnb_aliases)·대표 기기 해석(wnb_resolve_device)·병합(wnb_merge_devices)이
     있고, 모든 RPC 가 입구에서 대표 기기를 먼저 찾는다. 병합은 승수·판수·초대를 합산하고
     등급·머니는 최고값, 좌석은 대표 기기로 옮기며, 기본 닉네임('Player')이 정해진 닉네임을 덮지 않는다.
  B. 서버 라우트 — π 인증(verified:true)은 accessToken 을 Pi /v2/me 로 확인한 뒤에만 인정하고,
     이미 π 인증된 @을 미인증 선언으로 빼앗으려 하면 verified_elsewhere 를 409 로 돌려준다.
  C. 화면 — 사칭 안내·병합 안내 문구가 한국어/영어 모두 있고, savePi 가 그 갈래를 실제로 탄다.
     하단에 /privacy · /terms 링크가 있다.
  D. (--live) 배포된 보드는 주군 계정이 `david`(π ohsangjo·인증) 하나로만 보인다.

  python3 tests/wnb_account_merge_test.py           # 정적·로직 검사
  python3 tests/wnb_account_merge_test.py --live    # 배포 상태까지 확인(읽기 전용)
"""
import json
import os
import sys
import urllib.request

import quickjs

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
HTML = os.path.join(ROOT, 'public', 'wolnambbong.html')
MIG = os.path.join(ROOT, 'supabase', 'migrations', '2026-11-28_wnb_account_link.sql')
ROUTE = os.path.join(ROOT, 'app', 'api', 'wolnambbong', 'board', 'route.ts')
PRIVACY = os.path.join(ROOT, 'app', 'privacy', 'PrivacyDoc.tsx')
TERMS = os.path.join(ROOT, 'app', 'terms', 'TermsDoc.tsx')

SRC = open(HTML, encoding='utf-8').read()
SQL = open(MIG, encoding='utf-8').read()
ROUTE_SRC = open(ROUTE, encoding='utf-8').read()

KO_DISCLAIMER = ('본 서비스는 Pi Network(Pi Community Company / SocialChain Inc.)가 직접 운영하는 공식 앱이 아닙니다. '
                 'Pi 로그인·결제는 공식 Pi SDK와 플랫폼 API를 통해 이루어지며, '
                 '파이 코어팀(Pi Core Team)은 본 서비스의 운영 및 개인정보 처리에 대해 책임을 지지 않습니다.')
EN_DISCLAIMER = ('This service is not an official app directly operated by Pi Network (Pi Community Company / SocialChain Inc.). '
                 'Pi Sign-In and payments are processed through the official Pi SDK and Platform API, '
                 'and the Pi Core Team is not responsible for the operation or personal data processing of this service.')

pass_n = 0
fail_n = 0


def ok(cond, label, extra=None):
    global pass_n, fail_n
    if cond:
        pass_n += 1
        print('  ✓ ' + label)
    else:
        fail_n += 1
        print('  ✗ ' + label + ('' if extra is None else '  → ' + json.dumps(extra, ensure_ascii=False)))


def slice_from(marker, opener='{', closer='}'):
    i = SRC.index(marker)
    j = SRC.index(opener, i)
    depth, k, quote, esc = 0, j, None, False
    while k < len(SRC):
        c = SRC[k]
        if quote:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == quote:
                quote = None
        elif c in ('"', "'"):
            quote = c
        elif c == opener:
            depth += 1
        elif c == closer:
            depth -= 1
            if depth == 0:
                return SRC[i:k + 1]
        k += 1
    raise ValueError('unbalanced: ' + marker)


# ---------------------------------------------------------------- A. DB 마이그레이션
print('\n[A] DB — 별칭·대표 기기·병합')

ok('create table if not exists public.wnb_aliases' in SQL, '기기 별칭 테이블(wnb_aliases) 정의')
ok('create or replace function public.wnb_resolve_device' in SQL, '대표 기기 해석 함수(wnb_resolve_device)')
ok('create or replace function public.wnb_merge_devices' in SQL, '병합 함수(wnb_merge_devices)')
for fn in ('wnb_player_touch', 'wnb_seat_claim', 'wnb_invite_credit', 'wnb_pi_link'):
    body = SQL.split('create or replace function public.' + fn + '(')[1].split('$fn$;')[0]
    ok('wnb_resolve_device(' in body, fn + ' — 입구에서 대표 기기로 해석')
ok('coalesce(wnb_resolve_device(p_device)' in SQL.split('create or replace function public.wnb_board(')[1],
   'wnb_board — 내 기록도 대표 기기 기준')
ok("coalesce(k.wins, 0) + coalesce(d.wins, 0)" in SQL, '병합 — 승수 합산')
ok("coalesce(k.plays, 0) + coalesce(d.plays, 0)" in SQL, '병합 — 판수 합산')
ok('greatest(coalesce(k.best_money, 0), coalesce(d.best_money, 0))' in SQL, '병합 — 머니는 최고값 유지')
ok('update wnb_seats set device_id = p_keep' in SQL, '병합 — 좌석을 대표 기기로 이동')
ok('delete from wnb_seat_counter c' not in SQL.split('wnb_merge_devices')[1].split('$fn$;')[0]
   or 'taken = greatest(0, c.taken - x.n)' in SQL, '병합 — 중복 등급 좌석 정리 시 정원 카운터 복원')
ok("insert into wnb_aliases (device_id, target_device, reason)" in SQL, '병합 — 떨어진 기기를 별칭으로 연결')
ok("'verified_elsewhere'" in SQL, '미인증 선언으로 π 인증 @을 빼앗지 못하게 차단')
ok('v_declared' in SQL and 'not pi_verified' in SQL, '미인증 선언 계정 승격 경로(기존 선언 계정이 더 앞서면 그쪽을 남긴다)')
ok("update wnb_players set pi_username = null, pi_verified = false" in SQL, '이 기기가 더 앞서면 남의 선언만 회수(끌어오지 않는다)')
ok("case when excluded.nickname = 'Player' and wnb_players.nickname <> 'Player'" in SQL,
   '기본 닉네임(Player)이 정해진 닉네임을 덮지 않는다')
ok("revoke all on function public.wnb_merge_devices(text, text) from public, anon, authenticated" in SQL,
   '새 함수도 anon·authenticated 권한 회수')

# ---------------------------------------------------------------- B. 서버 라우트
print('\n[B] 라우트 — π 인증은 서버가 확인, 사칭은 409')

ok('verifyPiAccessToken' in ROUTE_SRC, 'π accessToken 을 서버가 검증(verifyPiAccessToken)')
ok("if (body.verified === true)" in ROUTE_SRC, 'verified:true 는 토큰 검증 분기를 거친다')
ok('check.user.username.toLowerCase() !== username.toLowerCase()' in ROUTE_SRC, '토큰의 @와 요청 @이 다르면 거부')
ok("'username_mismatch'" in ROUTE_SRC, '유저명 불일치 오류 코드')
ok("d.ok === false" in ROUTE_SRC and '409' in ROUTE_SRC, '함수의 업무 규칙 오류를 409 로 전달')
ok("merged: d.merged === true" in ROUTE_SRC, '병합 여부(merged)를 화면에 전달')

# ---------------------------------------------------------------- C. 화면
print('\n[C] 화면 — 문구·동작·법적 링크')

ctx = quickjs.Context()
harness = r"""
var I18N = __I18N__;
var ui = { lang: 'kr' };
var CALLS = [], TOASTS = [], STORE = {};
var PI_KEY = 'wnb_pi_v1';
var hall = { piEdit: true, piDraft: 'draft' };
var RESPONSE = { ok: true };
function t(k) { return (I18N[ui.lang] && I18N[ui.lang][k]) || (I18N.kr && I18N.kr[k]) || k; }
function toast(a, b) { TOASTS.push(b); }
function boardPost(body, cb) { CALLS.push(body); cb(RESPONSE); }
function boardGet(cb) { if (cb) cb(); }
function renderHall() {}
function paintHallBar() {}
function lsGet(k) { return Object.prototype.hasOwnProperty.call(STORE, k) ? STORE[k] : null; }
function lsSet(k, v) { STORE[k] = String(v); }
__SAVEPI__
function run(resp) { RESPONSE = resp; CALLS = []; TOASTS = []; savePi('@ohsangjo', false); return { call: CALLS[0], toast: TOASTS[0], store: STORE[PI_KEY] }; }
function runVerified(resp, token) { RESPONSE = resp; CALLS = []; TOASTS = []; savePi('@ohsangjo', true, token); return { call: CALLS[0], toast: TOASTS[0], store: STORE[PI_KEY] }; }
"""
i18n_raw = slice_from('var I18N = ', '{', '}')
# I18N 본문에서 객체 리터럴만 떼어낸다
ctx.eval(harness.replace('__I18N__', i18n_raw[i18n_raw.index('{'):].rstrip(';'))
                .replace('__SAVEPI__', slice_from('function savePi(')))

for k in ('hallPiTaken', 'hallPiMerged', 'hallPiVerifyFail', 'legalPrivacy', 'legalTerms', 'legalPi'):
    ko = ctx.eval("(I18N.kr['%s']||'')" % k)
    en = ctx.eval("(I18N.en['%s']||'')" % k)
    ok(bool(ko) and bool(en), '문구 다국어: ' + k, {'ko': ko, 'en': en})

r = ctx.eval("JSON.stringify(run({ ok:false, error:'verified_elsewhere' }))")
r = json.loads(r)
ok(r['toast'] == ctx.eval("I18N.kr['hallPiTaken']"), '사칭(이미 인증된 @) → 인증 안내를 띄운다', r)
ok(r.get('store') is None, '사칭 시도는 저장되지 않는다(PI_KEY 비어 있음)', r)

r = ctx.eval("JSON.stringify(run({ ok:false, error:'pi_verify_failed' }))")
r = json.loads(r)
ok(r['toast'] == ctx.eval("I18N.kr['hallPiVerifyFail']"), 'π 인증 실패 → 재시도 안내', r)

r = ctx.eval("JSON.stringify(run({ ok:true, merged:true }))")
r = json.loads(r)
ok(r['toast'] == ctx.eval("I18N.kr['hallPiMerged']"), '병합되면 병합 안내를 띄운다', r)
ok(r.get('store') == 'ohsangjo', '병합 후 @이 저장된다', r)

r = ctx.eval("JSON.stringify(run({ ok:true }))")
r = json.loads(r)
ok(r['toast'] == ctx.eval("I18N.kr['hallPiSaved']"), '일반 연결은 저장 안내', r)

r = ctx.eval("JSON.stringify(runVerified({ ok:true }, 'tok-123'))")
r = json.loads(r)
ok(r['call'].get('accessToken') == 'tok-123' and r['call'].get('verified') is True,
   'π 인증 요청에는 accessToken 을 함께 보낸다', r['call'])

ok("if (j && j.verified && j.username) savePi(j.username, true, token);" in SRC, 'piAuth 가 토큰을 savePi 로 넘긴다')
ok("lsSet('wnb.nick', sv)" in SRC, '서버 닉네임을 이 브라우저로 이어받는다(병합 후 Player 로 안 돌아감)')
ok('href="/privacy"' in SRC and 'href="/terms"' in SRC, '월남뽕 하단에 /privacy · /terms 링크')
ok('data-i18n="legalPrivacy"' in SRC and 'data-i18n="legalTerms"' in SRC, '하단 링크 문구도 다국적으로 바뀐다')
ok('id="legalLinks"' in SRC, '푸터(법적 링크 줄) 존재')
ok('Pi Network 공식 앱 아님' in SRC or 'Not an official Pi Network app' in SRC, '푸터에 Pi 비공식 표기')

for path, label in ((PRIVACY, '/privacy'), (TERMS, '/terms')):
    doc = open(path, encoding='utf-8').read()
    ok(KO_DISCLAIMER in doc, label + ' — 한국어 Pi 비공식·면책 문구')
    ok(EN_DISCLAIMER in doc, label + ' — English Pi disclaimer')

# ---------------------------------------------------------------- D. 라이브(선택)
if '--live' in sys.argv:
    print('\n[D] 라이브 — 배포된 보드')
    with urllib.request.urlopen('https://xaea12.kedheon.com/api/wolnambbong/board', timeout=20) as f:
        board = json.load(f)
    top = board.get('top') or []
    first = top[0] if top else {}
    ok(first.get('nickname') == 'david', '1위 닉네임 david', first)
    ok(first.get('pi') == 'ohsangjo' and first.get('piVerified') is True, '1위 π ohsangjo · 인증', first)
    ok(int(first.get('grade') or 0) == 1, '1위 등급 1(왕좌 #001)', first)
    ok(int(first.get('wins') or 0) == 22 and int(first.get('plays') or 0) == 31, '승수 22 · 판수 31 로 합산', first)
    ok(sum(1 for r in top if (r.get('pi') or '').lower() == 'ohsangjo') == 1, '주군 계정(π ohsangjo)은 한 줄뿐', top)
    with urllib.request.urlopen('https://xaea12.kedheon.com/api/wolnambbong/board?device=bs6t32nmus5hvd3d', timeout=20) as f:
        alt = json.load(f)
    me = alt.get('me') or {}
    ok(me.get('rank') == 1 and (me.get('seats') or {}).get('1') == 1,
       'Pi Browser 기기ID → 같은 계정(#001 좌석 유지)', me)

print('\n결과: %d 통과 / %d 실패' % (pass_n, fail_n))
sys.exit(1 if fail_n else 0)
