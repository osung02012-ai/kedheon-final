#!/usr/bin/env python3
"""월남뽕 로비 '명예의 전당' 바 문구 회귀 테스트.

2026-11-27 실기기 제보: AI 배틀을 끝까지 이겼는데 바에
  `π 개척자 0 · 등록 선수 1 · 내 순위 - · 1 Player`
로 나왔다. 원인 두 가지를 여기서 못 박는다.

  1) '내 순위 -'  → 기록 전송(POST profile = wnb_player_touch) 응답에는 rank·seats 가 없는데
                    화면이 hall.data.me 를 통째로 갈아 끼워, 보드에서 받아 둔 순위가 사라졌다.
  2) '· 1 Player' → 1위 닉네임(기본값 'Player')을 '1 ' 접두어로 붙여 '1명'처럼 읽혔다.

DOM 없이 quickjs 로 문구 함수만 떼어 내 검사한다(픽셀 검수는 배포 후 브라우저 몫).

  python3 tests/wnb_hall_bar_test.py
"""
import json
import os
import re
import sys

import quickjs

HTML = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'wolnambbong.html')
SRC = open(HTML, encoding='utf-8').read()


def slice_from(marker, opener='{', closer='}'):
    """marker 위치부터 괄호 짝이 맞는 곳까지 잘라 낸다(문자열 리터럴 무시하는 단순 스캐너)."""
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


HARNESS = r"""
var S = {};
function $(sel) { if (!S[sel]) S[sel] = { textContent: '', innerHTML: '' }; return S[sel]; }
function hx(v) { return String(v == null ? '' : v); }
function fmt(n) { var t = String(Number(n) || 0), o = ''; for (var i = 0; i < t.length; i++) { if (i && (t.length - i) % 3 === 0) o += ','; o += t[i]; } return o; }
var ui = { lang: 'kr' };
__I18N__
function t(k) { return (I18N[ui.lang] && I18N[ui.lang][k]) || (I18N.kr[k] || k); }
function tf(k, vars) { var s = t(k); for (var p in vars) if (Object.prototype.hasOwnProperty.call(vars, p)) s = s.split('{' + p + '}').join(String(vars[p])); return s; }
__TF__
var hall = { data: null };
__FUNCS__

function bar(lang, data) {
  ui.lang = lang; hall.data = data;
  paintHallBar();
  return $('#hallBarSub').textContent;
}
var out = [];
out.push(bar('kr', { available: true, pioneers: 0, players: 1, me: { rank: 1 } }));
out.push(bar('kr', { available: true, pioneers: 0, players: 1, me: null }));
out.push(bar('en', { available: true, pioneers: 0, players: 1, me: { rank: 1 } }));
out.push(bar('en', { available: true, pioneers: 2, players: 12, me: { rank: 12 } }));
out.push(bar('kr', { available: true, pioneers: 0, players: 1, me: { nickname: 'Player' } }));  /* rank 없음 */
out.push(bar('en', { available: true, pioneers: 0, players: 3, me: null }));
out.push(bar('kr', { available: true, pioneers: 31415, players: 59058, me: { rank: 7 } }));
out.push(bar('kr', { available: false, pioneers: 0, players: 0, me: null }));
JSON.stringify(out);
"""


def run():
    i18n = slice_from('var I18N = {')
    tf = slice_from('function tf(k, vars) {')
    funcs = '\n'.join([
        slice_from('function playersCountLabel(n) {'),
        slice_from('function myRankLabel(r) {'),
        slice_from('function paintHallBar() {'),
    ])
    js = (HARNESS
          .replace('__I18N__', 'var I18N = ' + i18n[i18n.index('{'):])
          .replace('__TF__', tf)
          .replace('__FUNCS__', funcs))
    ctx = quickjs.Context()
    return json.loads(ctx.eval(js))


EXPECT = [
    ('한국어 · 기록 있음', 'π 개척자 0 · 등록 선수 1 · 내 순위 1위'),
    ('한국어 · 기록 없음(순위 칸 생략)', 'π 개척자 0 · 등록 선수 1'),
    ('영어 · 1명은 단수', 'π Pioneers 0 · 1 Player · My Rank #1'),
    ('영어 · 복수', 'π Pioneers 2 · 12 Players · My Rank #12'),
    ('한국어 · rank 없으면 대시 금지', 'π 개척자 0 · 등록 선수 1'),
    ('영어 · me 없음', 'π Pioneers 0 · 3 Players'),
    ('한국어 · 천 단위', 'π 개척자 31,415 · 등록 선수 59,058 · 내 순위 7위'),
]

pass_n = fail = 0


def ok(cond, label, extra=None):
    global pass_n, fail
    if cond:
        pass_n += 1
        print('  ✓ ' + label)
    else:
        fail += 1
        print('  ✗ ' + label + ('' if extra is None else '  → ' + repr(extra)))


got = run()
print('\n[HALL-BAR-1] 로비 바 문구')
for (label, want), have in zip(EXPECT, got[:len(EXPECT)]):
    ok(have == want, label + ': ' + want, have)
ok('오프라인' in got[7], '오프라인 문구 유지', got[7])

print('\n[HALL-BAR-2] 제보된 문구가 다시 나오지 않는다')
for have in got:
    ok(' -' not in have and not have.endswith('-'), '대시(-) 표기 없음: ' + have)
for have in got[:2] + got[4:5] + got[6:]:      # 한국어 문구에는 영문 'Player' 가 섞이지 않는다
    ok('Player' not in have, '1위 닉네임(영문) 섞임 없음: ' + have)

print('\n[HALL-BAR-3] 기록 전송이 순위·좌석을 덮어쓰지 않는다(소스 배선)')
push = slice_from('function pushProfile(delay) {')
ok("hall.data.me = j.me" not in push, 'me 통째 교체 제거')
ok('next.rank = prev.rank' in push, '순위는 이전 보드 값을 유지')
ok('next.seats' in push, '좌석(고유 번호)도 유지')
ok('paintHallBar' in push, '전송 후 바 즉시 갱신')

print('\n[HALL-NICK] 닉네임 인라인 편집 — 인앱 브라우저에서 튕기지 않게')
# 2026-11-27 실기기 제보: 명예의 전당 `Player [변경]` → 새 닉네임을 넣어도 튕김.
#   prompt() 는 원래 쓰지 않았고, 20초 보드 폴링이 카드를 다시 그리며 입력 중인 칸과
#   키보드 포커스를 날리고 있었다(20.1초에 입력값이 'Player' 로 되돌아감 실측).
ok('prompt(' not in SRC, 'prompt() 미사용')
ok('alert(' not in SRC, 'alert() 미사용')
ok('confirm(' not in SRC, 'confirm() 미사용')
rhall = slice_from('function renderHall() {')
ok('if (!hall.nickEdit && !hall.piEdit) renderHallMe();' in rhall, '편집 중에는 카드를 다시 그리지 않는다')
ok('renderHallMe();' not in rhall.replace('if (!hall.nickEdit && !hall.piEdit) renderHallMe();', ''),
   '다른 경로로 카드를 통째로 다시 그리는 곳이 없다')
me = slice_from('function renderHallMe() {')
ok('id="nickInput2"' in me, '카드 안 인라인 <input id=nickInput2>')
ok('maxlength="8"' in me, 'maxlength=8')
ok('id="nickSave"' in me and "t('hallOk')" in me, '[확인] 버튼')
ok('id="nickCancel"' in me and "t('hallCancel')" in me, '[취소] 버튼')
for fn in ('function startNickEdit() {', 'function saveNick() {', 'function endNickEdit() {', 'function startPiEdit() {', 'function endPiEdit() {'):
    body = slice_from(fn)
    ok(len(body) > 0, '핸들러 존재: ' + fn.split()[1])
start = slice_from('function startNickEdit() {')
ok('hall.nickFocus = true' in start, '[변경] → 자동 포커스')
save = slice_from('function saveNick() {')
ok('setNick(v)' in save and 'pushProfile(80)' in save, '[확인] → 저장 + 서버 기록')
ok('hall.nickEdit = false' in save, '[확인] → 편집칸 닫기')
end = slice_from('function endNickEdit() {')
ok('hall.nickEdit = false' in end and 'setNick' not in end, '[취소] → 저장하지 않고 닫기')
ok("hall.nickDraft !== null" in me and 'hx(nickVal)' in me, '입력값(draft)을 다시 그려도 살린다')
ok("hall.piDraft !== null" in me and 'hx(piVal)' in me, 'π 입력값도 살린다')
ok('hall.nickDraft = null' in slice_from('function openHall() {'), '명예의 전당을 열면 초안 초기화')
for key in ('hallOk', 'hallCancel', 'hallNickSaved'):
    ok(SRC.count(key + ":" ) >= 2 or SRC.count(key + " :") >= 2 or SRC.count("'" + key + "'") >= 2,
       '다국어 문구 2개 언어: ' + key)

print('\n[HALL-KEY] 키보드가 보이는 영역만 줄어드는 인앱 브라우저 대응')
ok('interactive-widget=resizes-content' in SRC, 'viewport meta 에 interactive-widget')
ok('function fitHallSheet() {' in SRC, 'fitHallSheet 존재')
fit = slice_from('function fitHallSheet() {')
ok('visualViewport' in fit and "s.style.height" in fit and "style.maxHeight" in fit,
   '보이는 영역 높이에 시트를 맞춘다')
ok('bindHallViewport' in slice_from('function bindHallViewport() {'), 'visualViewport resize/scroll 바인딩')
ok('bindHallViewport();' in slice_from('function bind() {'), 'bind() 에서 호출')
ok('fitHallSheet()' in slice_from('function openHall() {'), '열 때·닫을 때 초기화')

print('\n결과: %d 통과 / %d 실패' % (pass_n, fail))
sys.exit(1 if fail else 0)
