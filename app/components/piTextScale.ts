/**
 * Pi Browser(안드로이드 WebView) 글자 배율 자동 보정 스크립트
 * ---------------------------------------------------------------
 * 문제
 *  - KEDHEON · CIVIL · FACTFILTER · HANGANG · XAEA12 의 타이포는 모두 px 로 고정돼 있다
 *    (globals.css 의 --t-hero 18px / --t-body 13px …). 일반 모바일 브라우저에서는 알맞다.
 *  - 그런데 안드로이드 WebView(Pi Browser)는 OS 의 '큰 글씨' 설정을 textZoom 으로 받아
 *    **px 글자에도 한 번 더 곱한다.** 레이아웃 박스는 그대로인데 글자만 1.3~1.5배로 커져
 *    히어로가 화면을 덮고 첫 화면 아래가 잘린다.
 *
 * 해법
 *  - 화면 밖에 100px 프로브(span)를 붙여 **실제로 렌더된 글자 크기**를 잰다.
 *    · getComputedStyle().fontSize  : WebView 가 계산값까지 배율에 넣는 구현을 잡는다.
 *    · getBoundingClientRect().height: 계산값은 100px 그대로이고 그리기만 커지는 구현을 잡는다.
 *    → rawScale = max(computed / 100, rectH / 100)
 *  - rawScale 이 1.06 을 넘을 때만(= 실제 글자 팽창이 일어났을 때만) 역수 배율
 *    factor = max(0.65, min(1, 1 / rawScale)) 을 --pi-scale 에 넣는다.
 *  - 일반 브라우저(rawScale ≈ 1.0)에서는 --pi-scale 이 1 그대로라 화면은 예전과 1px도 다르지 않다.
 *
 * 왜 <head> 인라인 스크립트인가
 *  - 첫 페인트 전에 값을 정해야 큰 글씨로 한 번 그려졌다가 줄어드는 깜빡임(FOUT)이 없다.
 *    그래서 React 마운트(useEffect)를 기다리지 않고 layout.tsx 의 <head> 에서 동기 실행한다.
 *  - 회전·앱 복귀(resume) 때 WebView 배율이 다시 잡히는 경우가 있어 resize·orientationchange·
 *    visibilitychange 에서 한 번 더 맞춘다(값이 같으면 아무 일도 일어나지 않는다).
 *
 * 확인용 표식
 *  - <html data-pi-zoom="1.350">  : 마지막 측정에서 잰 실제 배율
 *  - <html data-pi-zoom-first="…"> : <head> 최초 측정값(첫 페인트에 적용된 값)
 *  - window.__piTextScale()        : 수동 재측정(개발/검증용)
 */
export const PI_TEXT_SCALE_SCRIPT = `(function () {
  var PROBE = 100;
  var THRESHOLD = 1.06;
  var MIN = 0.65;

  function sync() {
    var root = document.documentElement;
    if (!root) return;
    var host = document.body || root;
    var probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.setAttribute('data-pi-text-probe', '1');
    probe.textContent = 'Ag';
    probe.style.cssText =
      'position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;' +
      'z-index:-1;font-size:' + PROBE + 'px;line-height:1;font-family:sans-serif;' +
      'font-weight:400;font-style:normal;letter-spacing:0;white-space:nowrap;' +
      'padding:0;margin:0;border:0;transform:none;';
    host.appendChild(probe);
    var computed = parseFloat(window.getComputedStyle(probe).fontSize);
    var rect = probe.getBoundingClientRect().height;
    host.removeChild(probe);

    var raw = Math.max((computed || PROBE) / PROBE, (rect || 0) / PROBE);
    if (!isFinite(raw) || raw <= 0.2) return;

    var factor = raw > THRESHOLD ? Math.max(MIN, Math.min(1, 1 / raw)) : 1;
    root.style.setProperty('--pi-scale', factor.toFixed(3));
    root.setAttribute('data-pi-zoom', raw.toFixed(3));
    if (!window.__piTextScaleFirst) window.__piTextScaleFirst = raw.toFixed(3);
  }

  window.__piTextScale = sync;
  sync();

  var timer = 0;
  function again() {
    clearTimeout(timer);
    timer = setTimeout(sync, 60);
  }
  window.addEventListener('resize', again, { passive: true });
  window.addEventListener('orientationchange', again, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) again();
  });
  document.addEventListener('DOMContentLoaded', sync, { once: true });
  window.addEventListener('load', sync, { once: true });
})();`;
