/* 월남뽕 UI 스모크 테스트 — 브라우저 없이 얇은 DOM 스텁으로
   init → 시작 → 헤더/설정 쿠폰 표시 → 쿠폰 사용(+10,000) 흐름을 확인한다.
   실제 픽셀/레이아웃은 배포 후 브라우저에서 실측한다. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML = path.join(__dirname, '..', 'public', 'wolnambbong.html');
const src = fs.readFileSync(HTML, 'utf8');

function block(id) {
  const m = src.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)</script>'));
  if (!m) throw new Error(id + ' not found');
  return m[1];
}

/* ---------- 아주 얇은 DOM ---------- */
function makeEl(tag, id) {
  const el = {
    tagName: (tag || 'div').toUpperCase(),
    id: id || '',
    children: [],
    _text: '',
    _html: '',
    style: new Proxy({ cssText: '' }, { get: (o, k) => (k in o ? o[k] : ''), set: (o, k, v) => { o[k] = v; return true; } }),
    dataset: {},
    attrs: {},
    disabled: false,
    onclick: null,
    value: '',
    title: '',
    className: '',
    parentNode: null,
    classList: {
      _s: new Set(),
      add(...c) { c.forEach(x => this._s.add(x)); },
      remove(...c) { c.forEach(x => this._s.delete(x)); },
      toggle(c, f) { const on = f === undefined ? !this._s.has(c) : !!f; if (on) this._s.add(c); else this._s.delete(c); return on; },
      contains(c) { return this._s.has(c); }
    }
  };
  Object.defineProperty(el, 'textContent', { get() { return el._text; }, set(v) { el._text = String(v); } });
  Object.defineProperty(el, 'innerHTML', {
    get() { return el._html; },
    set(v) { el._html = String(v); el.children.length = 0; }
  });
  el.appendChild = function (c) { el.children.push(c); if (c) c.parentNode = el; return c; };
  el.insertBefore = function (c, ref) { const i = ref ? el.children.indexOf(ref) : -1; el.children.splice(i < 0 ? el.children.length : i, 0, c); if (c) c.parentNode = el; return c; };
  el.removeChild = function (c) { const i = el.children.indexOf(c); if (i >= 0) el.children.splice(i, 1); return c; };
  el.setAttribute = function (k, v) { el.attrs[k] = String(v); if (k === 'id') el.id = String(v); };
  el.getAttribute = function (k) { return k in el.attrs ? el.attrs[k] : null; };
  el.addEventListener = function () {};
  el.removeEventListener = function () {};
  el.getBoundingClientRect = function () { return { left: 0, top: 0, width: 200, height: 160, right: 200, bottom: 160 }; };
  el.setPointerCapture = function () {};
  el.focus = function () {};
  el.getContext = function () {
    const noop = () => {};
    return {
      canvas: { width: 400, height: 800 },
      clearRect: noop, fillRect: noop, beginPath: noop, arc: noop, fill: noop, stroke: noop,
      moveTo: noop, lineTo: noop, closePath: noop, save: noop, restore: noop, translate: noop,
      rotate: noop, scale: noop, setTransform: noop, createLinearGradient: () => ({ addColorStop: noop }),
      set fillStyle(v) {}, set strokeStyle(v) {}, set globalAlpha(v) {}, set lineWidth(v) {}
    };
  };
  el.classList.toString = () => [...el.classList._s].join(' ');
  return el;
}

const byId = new Map();
const bySel = new Map();
function getEl(sel) {
  if (!byId.has(sel)) {
    const id = sel.replace(/^#/, '');
    byId.set(sel, makeEl('div', id));
  }
  return byId.get(sel);
}

const document = {
  documentElement: makeEl('html'),
  body: makeEl('body'),
  getElementById(id) { return getEl('#' + id); },
  querySelector(sel) { return getEl(sel); },
  querySelectorAll(sel) {
    if (/chip\[data-amt\]/.test(sel)) return [];
    if (/\[data-cpn\]/.test(sel)) return cpnNodes;
    if (/\[data-i18n\]/.test(sel)) return i18nNodes;
    if (/\.mode/.test(sel)) return modeNodes;
    return [];
  },
  createElement(tag) { return makeEl(tag); },
  addEventListener() {}
};

/* 헤더·설정·상태바·시트의 쿠폰 수량 노드 4개 */
const cpnNodes = [makeEl('b'), makeEl('b'), makeEl('b'), makeEl('b')];
cpnNodes.forEach(n => { n.setAttribute('data-cpn', ''); });
const i18nNodes = [];
const modeNodes = [];

const store = new Map();
const localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => { store.set(k, String(v)); },
  removeItem: k => { store.delete(k); }
};

const sandbox = {
  console, Math, Date, JSON, parseInt, parseFloat, isFinite, Number, String, Array, Object, Set, Map,
  document, localStorage,
  navigator: { vibrate: () => true, share: null },
  sessionStorage: { getItem: () => null, setItem: () => {} },
  setTimeout: (fn) => 0,
  clearTimeout: () => {},
  setInterval: () => 0,
  clearInterval: () => {},
  requestAnimationFrame: () => 0,
  addEventListener: () => {},
  location: { search: '', origin: 'https://xaea12.kedheon.com', href: 'https://xaea12.kedheon.com/wolnambbong.html' },
  URLSearchParams: class { get() { return null; } },
  fetch: () => Promise.reject(new Error('offline')),
  module: { exports: {} }
};
sandbox.window = sandbox;
sandbox.window.localStorage = localStorage;
sandbox.global = sandbox;

vm.createContext(sandbox);

let pass = 0, fail = 0;
function ok(cond, label, extra) {
  if (cond) { pass++; console.log('  ✓ ' + label); }
  else { fail++; console.log('  ✗ ' + label + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
}

console.log('\n[UI-1] 스크립트 로드');
vm.runInContext(block('corejs'), sandbox);
ok(!!sandbox.WNB, 'corejs 로드 → WNB 전역');
try {
  vm.runInContext(block('uijs'), sandbox);
  ok(true, 'uijs 초기화 예외 없음');
} catch (e) {
  ok(false, 'uijs 초기화 예외 없음', e && e.message);
  console.log(e && e.stack);
}

const W = sandbox.WNB;
const KEY = W.COUPON_KEY;
const startBtn = getEl('#startBtn');
const toastEl = getEl('#toast');

console.log('\n[UI-2] 보유 0장 — 표시·버튼 상태');
ok(cpnNodes.every(n => n.textContent === 0 || n.textContent === '0'), '헤더·설정·상태바·시트 모두 "0"', cpnNodes.map(n => n.textContent));
ok(getEl('#cpnUseSetup').disabled === true, '쿠폰 0장이면 [사용] 버튼 비활성');
ok(/^🎟️|쿠폰/.test(getEl('#cpnUseSetup').textContent), '설정 행의 쿠폰 버튼 라벨 노출', getEl('#cpnUseSetup').textContent);

console.log('\n[UI-3] 새로고침 유지 — 저장된 2장 복원');
store.set(KEY, '2');
sandbox.WNB && vm.runInContext('void 0', sandbox);
getEl('#gearBtn').onclick();       /* 설정 열기 = 쿠폰 새로고침 */
ok(cpnNodes.every(n => n.textContent === '2'), '저장된 2장이 화면에 반영', cpnNodes.map(n => n.textContent));
ok(getEl('#cpnUseSetup').disabled === false, '1장 이상이면 [사용] 버튼 활성');

console.log('\n[UI-4] 시작 전 쿠폰 예약 → 시작 머니 +10,000');
getEl('#cpnUseSetup').onclick();   /* 예약 토글(S 없음) */
ok(W.couponLoad(localStorage) === 2, '예약 단계에서는 아직 차감하지 않는다');
ok(/\+10,000|\+10,000|예약|이번 판/.test(getEl('#cpnUseSetup').textContent), '예약 상태 라벨', getEl('#cpnUseSetup').textContent);
startBtn.onclick();                /* 게임 시작 */
ok(W.couponLoad(localStorage) === 1, '시작할 때 1장 차감(남은 1장)');
ok(cpnNodes.every(n => n.textContent === '1'), '화면 수량도 1장으로 갱신', cpnNodes.map(n => n.textContent));
ok(/\+10,000/.test(toastEl.innerHTML), '충전 토스트 노출', toastEl.innerHTML);

console.log('\n[UI-5] 게임 중 쿠폰 사용 → 차감');
const before = W.couponLoad(localStorage);
getEl('#cpnSheetUse').onclick();
ok(W.couponLoad(localStorage) === before - 1, '게임 중 사용 시 1장 차감', W.couponLoad(localStorage));
ok(/충전|Recharged|사용/.test(toastEl.innerHTML), '사용 토스트 노출', toastEl.innerHTML);

console.log('\n[UI-6] 0장이면 사용 불가');
getEl('#cpnSheetUse').onclick();
ok(W.couponLoad(localStorage) === 0, '0장에서 더 차감되지 않음(음수 없음)', W.couponLoad(localStorage));
ok(/없음|No coupons/.test(toastEl.innerHTML), '보유 쿠폰 없음 안내', toastEl.innerHTML);

console.log('\n[UI-7] 게임 중 기본 판돈 올리기 (솔로 = 즉시 적용)');
ok(getEl('#raiseNext').textContent === '2,000', '판돈 버튼에 다음 단계(2,000) 표시', getEl('#raiseNext').textContent);
getEl('#raiseBtn').onclick();
ok(getEl('#raiseSheet').classList.contains('on'), '판돈 올리기 시트가 열린다');
const opts = getEl('#raiseOpts').children;
ok(opts.length >= 2, '상향 단계 버튼 노출', opts.length);
ok(/2,000/.test(opts[0].innerHTML), '첫 단계 2,000', opts[0].innerHTML);
opts[0].onclick();
ok(!getEl('#raiseSheet').classList.contains('on'), '고른 뒤 시트 닫힘');
ok(getEl('#raiseNext').textContent === '5,000', '앤티 2,000 반영 → 다음 단계 5,000', getEl('#raiseNext').textContent);
ok(/판돈|앤티|2,000/.test(getEl('#toast').innerHTML), '인상 안내 토스트', getEl('#toast').innerHTML);

console.log('\n[UI-8] 다음 버튼·뽕 2배 토글 없음');
ok(!/id="nextBtn"/.test(src), "'다음' 버튼 없음");
ok(!/id="ngBtn"/.test(src), "'뽕 ×2 걸기' 버튼 없음");
ok(!/ppongSwitch/.test(src), '뽕 2배 토글 없음');
ok(/id="raiseBtn"/.test(src), '판돈 올리기 버튼 존재');
ok(/id="voteSheet"/.test(src), '온라인 전원 동의 모달 존재');

console.log('\n[UI-9] 연속 숫자(사이 없음) — 베팅 UI가 열려 있다');
{
  /* 덱 셔플을 결정적으로 만들기 위해 잠시 Math.random 을 갈아 끼운다 */
  const origRandom = Math.random;
  const months = (el) => {
    const m = String(el.innerHTML).match(/aria-label="(\d+)"/);
    return m ? +m[1] : 0;
  };
  let hit = null;
  for (let seed = 1; seed <= 80 && !hit; seed++) {
    Math.random = W.mulberry32(seed * 7919 + 13);
    getEl('#startBtn').onclick();
    const a = months(getEl('#cardA')), b = months(getEl('#cardB'));
    if (a && b && Math.abs(a - b) <= 1) hit = { a: a, b: b, seed: seed };
  }
  Math.random = origRandom;
  ok(!!hit, '연속 숫자(사이 없음) 판을 실제로 딜', hit);

  if (hit) {
    ok(getEl('#rangeBox').classList.contains('nogap'), '범위 박스가 사이 없음 표시(nogap)');
    const A = String(getEl('#actions').innerHTML);
    ok(/id="betBtn"/.test(A), '걸기 버튼이 열려 있다', A);
    ok(/id="passBtn"/.test(A), '패스 버튼도 있다');
    ok(/class="chip/.test(A), '베팅액 칩이 노출된다');
    ok(!/패스만|passOnly/.test(A), "'패스만 가능' 강제 문구 없음", A);

    /* 실제로 걸어 본다 — 이전 버전에서는 버튼 자체가 없었다 */
    const bet = getEl('#betBtn');
    ok(typeof bet.onclick === 'function', '걸기 버튼에 핸들러 연결');
    bet.onclick();
    ok(String(getEl('#thirdFace').innerHTML).indexOf('<svg') === 0, '걸면 3번째 패가 깔린다(phase=peek)',
      String(getEl('#thirdFace').innerHTML).slice(0, 40));
    ok(getEl('#peekHint').style.display === 'flex', '쪼기 안내가 뜬다');
    ok(/id="quickBtn"/.test(String(getEl('#actions').innerHTML)), '바로 까기 버튼 단계로 진행');
  }
}

console.log('\n결과: ' + pass + ' 통과 / ' + fail + ' 실패');
process.exit(fail ? 1 : 0);
