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

console.log('\n결과: ' + pass + ' 통과 / ' + fail + ' 실패');
process.exit(fail ? 1 : 0);
