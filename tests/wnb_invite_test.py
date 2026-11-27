#!/usr/bin/env python3
"""월남뽕 온라인 방 '초대하기' · 초대 링크(?room=XXXX) 딥링크 UI 검증.

실제 Chromium 픽셀·DOM 으로 확인한다.
  - ?room=XXXX 로 들어오면 온라인 모드가 열리고 4자리 코드가 입력칸에 채워진다
  - 안내 문구에 방 코드가 보이고, 닉네임만 확인하면 [입장] 한 번으로 들어간다
  - 방장 대기실의 [초대하기] 버튼이 다국어로 바뀌고 좁은 화면에서도 잘리지 않는다
  - 영문 모드 화면에 '아도(ADO)'가 남지 않는다(라벨 MAX · 우승 문구 MAX BET)

  python3 tests/wnb_invite_test.py            # 390×680
  python3 tests/wnb_invite_test.py --shot     # 대기실 초대 버튼 PNG 저장
"""
import os
import sys
from playwright.sync_api import sync_playwright

HTML = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'wolnambbong.html')
BASE = 'file://' + os.path.abspath(HTML)
DEEP = BASE + '?room=4821'
VIEWPORT = (390, 680)
SHOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..',
                    'downloads', 'wolnambbong_v8_invite.png')


def lobby_on(page, code='4821'):
    """서버 없이도 대기실 화면만 띄워 방장 화면(초대 버튼)을 잰다."""
    page.evaluate("""(code) => {
      document.getElementById('scr-setup').classList.remove('on');
      document.getElementById('scr-game').classList.remove('on');
      document.getElementById('scr-lobby').classList.add('on');
      document.getElementById('roomCode').textContent = code;
      var r = document.getElementById('shareRow');
      r.style.display = '';
      document.getElementById('shareHint').textContent =
        location.origin + '/wolnambbong.html?room=' + code;
      document.getElementById('hostStartBtn').style.display = '';
      document.getElementById('hostStartBtn').textContent = '게임 시작 (2/6)';
    }""", code)


def main():
    shot = '--shot' in sys.argv
    passed = failed = 0

    def ok(cond, label, extra=None):
        nonlocal passed, failed
        if cond:
            passed += 1
            print('  ✓ ' + label)
        else:
            failed += 1
            print('  ✗ ' + label + ('' if extra is None else '  → ' + str(extra)))

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={'width': VIEWPORT[0], 'height': VIEWPORT[1]},
                                  device_scale_factor=2, is_mobile=True, has_touch=True,
                                  user_agent='Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 '
                                             '(KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36')
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))

        print('\n[DEEP LINK] ?room=4821 로 접속')
        page.goto(DEEP, wait_until='load')
        page.evaluate("() => { try { localStorage.clear(); } catch (e) {} }")
        page.goto(DEEP, wait_until='load')
        page.wait_for_timeout(200)

        ok(page.evaluate("() => getComputedStyle(document.getElementById('onlineBox')).display") != 'none',
           '온라인 모드가 자동으로 열린다(onlineBox 표시)')
        ok(page.evaluate("() => document.getElementById('codeInput').value") == '4821',
           '코드 입력칸에 방 코드가 채워진다', page.evaluate("() => document.getElementById('codeInput').value"))
        ok(page.evaluate("() => document.querySelector('[data-mode=\"online\"]').classList.contains('on')"),
           '모드 선택이 [🌐 온라인 방]으로 켜진다')
        hint = page.evaluate("() => document.getElementById('onlineHint').innerText")
        ok('4821' in hint, '안내 문구에 방 코드가 보인다', hint)
        ok(page.evaluate("() => WNB.parseInvite(location.href)") == '4821',
           'WNB.parseInvite(현재 URL) === 4821')
        ok(page.evaluate("() => WNB.parseInvite('4821')") == '4821', '4자리 코드만 붙여넣어도 인식')
        ok(page.evaluate("() => WNB.inviteLink(location.origin, '4821')").endswith('/wolnambbong.html?room=4821'),
           '초대 링크 형식 = origin + /wolnambbong.html?room=XXXX',
           page.evaluate("() => WNB.inviteLink(location.origin, '4821')"))
        ok(page.evaluate("() => document.getElementById('joinBtn').innerText").strip() == '입장',
           '닉네임 확인 후 [입장] 한 번으로 들어간다', page.evaluate("() => document.getElementById('joinBtn').innerText"))
        ok(page.evaluate("() => document.activeElement && ['nickInput','joinBtn'].indexOf(document.activeElement.id) >= 0"),
           '첫 화면 초점이 닉네임/입장 버튼에 있다',
           page.evaluate("() => document.activeElement && document.activeElement.id"))

        print('\n[LOBBY] 방장 대기실 — 초대하기')
        lobby_on(page)
        box = page.evaluate("""() => {
          const b = document.getElementById('inviteBtn');
          const r = b.getBoundingClientRect();
          return { text: b.innerText.trim(), w: r.width, h: r.height, left: r.left, right: r.right,
                   vw: innerWidth, listeners: !!b.onclick };
        }""")
        ok('초대하기' in box['text'], '한국어 라벨 = 초대하기', box['text'])
        ok(box['listeners'], '초대하기 버튼에 클릭 핸들러가 물려 있다')
        ok(box['w'] >= 200 and box['right'] <= box['vw'] + 0.5 and box['left'] >= 0,
           '390px 화면에서 초대 버튼이 잘리지 않는다', box)
        ok(box['h'] >= 34, '초대 버튼 터치 높이 확보(≥34px)', box['h'])

        if shot:
            os.makedirs(os.path.dirname(SHOT), exist_ok=True)
            page.screenshot(path=SHOT, full_page=False)
            print('    스크린샷 → ' + os.path.abspath(SHOT))

        print('\n[EN] 언어 전환 — 아도(ADO) 잔존 0')
        page.click('#langBtn')
        page.wait_for_timeout(120)
        en = page.evaluate("""() => ({
          invite: document.getElementById('inviteBtn').innerText.trim(),
          body: document.body.innerText,
          text: WNB.inviteText('4821', 'en'),
          roomCode: document.getElementById('roomCode').innerText
        })""")
        ok('Invite' in en['invite'], '영문 라벨 = Invite', en['invite'])
        ok('아도' not in en['body'], '영문 화면에 아도 없음', [ln for ln in en['body'].split('\n') if '아도' in ln])
        ok('ADO' not in en['body'].replace('ROOM CODE', ''), '영문 화면에 ADO 없음')
        ok('Room code' in en['text'] and '4821' in en['text'], '영문 초대 문구에 Room code 포함', en['text'])

        ok(not errors, 'JS 런타임 오류 없음', errors)
        ctx.close()
        browser.close()

    print('\n결과: %d 통과 / %d 실패' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
