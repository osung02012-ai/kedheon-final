#!/usr/bin/env python3
"""월남뽕 실기기 레이아웃 검증 — 짧은 모바일 뷰포트에서 쪼개기(picking) 단계에
깔린 2장(기준 패) 상단이 테이블 위로 잘리지 않고, 우상단 [⤒ 판돈] 버튼과
겹치지 않는지 실제 Chromium 픽셀로 잰다.

  python3 tests/wnb_layout_test.py            # 360×640 · 390×680 · 390×740
  python3 tests/wnb_layout_test.py --shot     # 390×680 쪼개기 화면 PNG 저장
"""
import os
import sys
from playwright.sync_api import sync_playwright

HTML = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'wolnambbong.html')
URL = 'file://' + os.path.abspath(HTML)
VIEWPORTS = [(360, 640), (390, 680), (390, 740)]
SHOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..',
                    'downloads', 'wolnambbong_v7_fixed_crop.png')

MEASURE = r"""
() => {
  const R = (el) => { const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height }; };
  const table = document.getElementById('tableEl');
  const a = document.getElementById('cardA');
  const b = document.getElementById('cardB');
  const third = document.getElementById('thirdWrap');
  const raise = document.getElementById('raiseBtn');
  const tr = R(table), ar = R(a), br = R(b), th = R(third), rr = R(raise);
  const cs = getComputedStyle(table);
  const overlap = !(rr.right <= br.left || rr.left >= br.right || rr.bottom <= br.top || rr.top >= br.bottom);
  const overlapA = !(rr.right <= ar.left || rr.left >= ar.right || rr.bottom <= ar.top || rr.top >= ar.bottom);
  return {
    table: tr, a: ar, b: br, third: th, raise: rr,
    padTop: parseFloat(cs.paddingTop), padBottom: parseFloat(cs.paddingBottom),
    overheadA: +(tr.top + tr.height - ar.bottom).toFixed(1),   /* 카드 아래 여유 */
    topGap: +(Math.min(ar.top, br.top) - tr.top).toFixed(1),
    bottomGap: +(tr.bottom - Math.max(ar.bottom, br.bottom, th.bottom)).toFixed(1),
    overlapRight: overlap, overlapLeft: overlapA,
    cardW: +ar.width.toFixed(1), thirdW: +th.width.toFixed(1),
    vh: innerHeight, vw: innerWidth
  };
}
"""


def to_picking(page):
    """AI 3인전 시작 → 베팅 → 쪼기(picking) 단계."""
    page.goto(URL, wait_until='load')
    page.evaluate("() => { try { localStorage.clear(); } catch (e) {} }")
    page.reload(wait_until='load')
    page.click('[data-mode="ai"]')
    page.click('#startBtn')
    page.wait_for_timeout(250)
    # 판돈(최대) 칩 → 걸기 (떡 판이면 업/다운으로 건다)
    chips = page.query_selector_all('#actions .chip[data-amt]')
    assert chips, 'betting chips not rendered'
    chips[-1].click()
    page.wait_for_timeout(80)
    if page.query_selector('#upBtn'):
        page.click('#upBtn')
    else:
        page.click('#betBtn')
    page.wait_for_timeout(450)      # 3번째 패 딜 + 쪼기 안내
    assert page.evaluate("() => getComputedStyle(document.getElementById('peekHint')).display") != 'none', \
        'picking hint not shown'


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
        for (w, h) in VIEWPORTS:
            ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2,
                                      is_mobile=True, has_touch=True,
                                      user_agent='Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 '
                                                 '(KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36')
            page = ctx.new_page()
            print('\n[LAYOUT %dx%d] 쪼개기 단계' % (w, h))
            to_picking(page)
            m = page.evaluate(MEASURE)
            print('    table %.0f–%.0f (%.0f) · 카드 %.0f×%.0f · 쪼기패 폭 %.0f · topGap %.1f · bottomGap %.1f'
                  % (m['table']['top'], m['table']['bottom'], m['table']['height'],
                     m['cardW'], m['a']['height'], m['thirdW'], m['topGap'], m['bottomGap']))
            ok(m['cardW'] == m['thirdW'] or m['thirdW'] <= m['cardW'] * 0.80,
               '쪼기 패가 기준 패보다 작다(≤80%)', [m['cardW'], m['thirdW']])
            ok(m['topGap'] >= 0, '깔린 2장 상단 잘림 0px (top >= table.top)', m['topGap'])
            ok(m['topGap'] >= m['padTop'] - 0.5, '상단 패딩 확보(카드가 테두리에 붙지 않음)', [m['topGap'], m['padTop']])
            ok(m['bottomGap'] >= -0.5, '테이블 아래로도 넘치지 않음', m['bottomGap'])
            ok(not m['overlapRight'] and not m['overlapLeft'], '[⤒] 버튼이 오른쪽 카드와 겹치지 않음',
               [m['overlapRight'], m['overlapLeft'], m['raise'], m['b']])
            # 쪼기 패 아래 안내까지 테이블 안에
            hint = page.evaluate("() => { const r = document.getElementById('peekHint').getBoundingClientRect();"
                                 " const t = document.getElementById('tableEl').getBoundingClientRect();"
                                 " return [r.bottom - t.bottom, r.top - t.top]; }")
            ok(hint[1] >= 0 and hint[0] <= 0.5, '쪼기 안내까지 테이블 안', hint)
            # 숫자 라벨이 카드 상단 밖으로 나가지 않는지(내부 텍스트 기준)
            label = page.evaluate("""() => {
              const out = [];
              for (const id of ['cardA','cardB']) {
                const el = document.getElementById(id);
                const r = el.getBoundingClientRect();
                const svg = el.querySelector('svg');
                const s = svg ? svg.getBoundingClientRect() : r;
                out.push(+(Math.min(s.top - r.top, 0)).toFixed(1));
              }
              return out;
            }""")
            ok(all(x >= -0.5 for x in label), '카드 숫자(금박)가 카드 안에 있음', label)

            if shot and (w, h) == (390, 680):
                os.makedirs(os.path.dirname(SHOT), exist_ok=True)
                page.screenshot(path=SHOT, full_page=False)
                print('    스크린샷 → ' + os.path.abspath(SHOT))
            ctx.close()
        browser.close()

    print('\n결과: %d 통과 / %d 실패' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
