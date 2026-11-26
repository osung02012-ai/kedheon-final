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
    if (/chip\[data-amt\]/.test(sel)) return chipNodes();
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
/* 모드 버튼 4개 — 페이지가 data-mode 로 ui.mode 를 바꾼다(AI·모임 인원 UI 검증용) */
const modeNodes = ['solo', 'ai', 'pass', 'online'].map(m => {
  const el = makeEl('button');
  el.setAttribute('data-mode', m);
  return el;
});

/* 베팅액 칩 — #actions innerHTML 에서 data-amt 를 뽑아 실제 클릭이 가능한 노드로 만든다.
   같은 innerHTML 동안은 같은 노드를 돌려줘야 bindBetUI 가 붙인 onclick 이 살아 있다. */
let chipCache = { html: null, nodes: [] };
function chipNodes() {
  const html = String(getEl('#actions').innerHTML);
  if (chipCache.html === html) return chipCache.nodes;
  const nodes = [];
  const re = /data-amt="(\d+)"/g;
  let m2;
  while ((m2 = re.exec(html))) {
    const el = makeEl('button');
    el.setAttribute('data-amt', m2[1]);
    el.classList.add('chip');
    nodes.push(el);
  }
  chipCache = { html, nodes };
  return nodes;
}

/* Web Audio 목업 — 실제 소리 대신 '노드가 만들어졌는지'만 기록한다.
   분기(대형 '딱!!' vs 일반 '띡!!')와 음소거 무음을 소리 없이 검증하기 위한 장치. */
function MockParam(v) { this.value = (v === undefined ? 0 : v); }
['setValueAtTime', 'exponentialRampToValueAtTime', 'linearRampToValueAtTime', 'setTargetAtTime',
  'cancelScheduledValues', 'setValueCurveAtTime'].forEach(k => {
  MockParam.prototype[k] = function (v) { if (typeof v === 'number') this.value = v; return this; };
});
function MockNode(kind) {
  this.kind = kind; this.type = '';
  this.frequency = new MockParam(440); this.gain = new MockParam(1); this.Q = new MockParam(1);
  this.detune = new MockParam(0); this.playbackRate = new MockParam(1);
  this.threshold = new MockParam(-24); this.knee = new MockParam(30); this.ratio = new MockParam(12);
  this.attack = new MockParam(0.003); this.release = new MockParam(0.25); this.reduction = 0;
  this.buffer = null; this.loop = false;
}
MockNode.prototype.connect = function (t) { return t; };
MockNode.prototype.disconnect = function () {};
MockNode.prototype.start = function (when, offset) { this.started = true; this.startAt = when; this.startOffset = offset; };
MockNode.prototype.stop = function (when) { this.stopped = true; this.stopAt = when; };
MockNode.prototype.setPeriodicWave = function () {};
const AC_INSTANCES = [];
function MockAudioContext() {
  this.currentTime = 0; this.sampleRate = 48000; this.state = 'running';
  this.destination = new MockNode('destination');
  this.created = [];
  AC_INSTANCES.push(this);
}
['createGain', 'createOscillator', 'createBiquadFilter', 'createBufferSource', 'createDynamicsCompressor',
  'createStereoPanner', 'createDelay', 'createWaveShaper'].forEach(k => {
  MockAudioContext.prototype[k] = function () { this.created.push(k); return new MockNode(k); };
});
MockAudioContext.prototype.createBuffer = function (ch, len, rate) {
  this.created.push('createBuffer');
  const data = new Float32Array(len);
  return { length: len, sampleRate: rate, numberOfChannels: ch, getChannelData: () => data, copyToChannel() {} };
};
MockAudioContext.prototype.resume = function () { this.state = 'running'; return Promise.resolve(); };
MockAudioContext.prototype.close = function () { return Promise.resolve(); };

const store = new Map();
const vibrations = [];   /* vibrate 패턴 — 승부 종류(아도/일반/패배) 구분 신호 */
const localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => { store.set(k, String(v)); },
  removeItem: k => { store.delete(k); }
};

const sandbox = {
  console, Math, Date, JSON, parseInt, parseFloat, isFinite, Number, String, Array, Object, Set, Map,
  document, localStorage,
  AudioContext: MockAudioContext,
  navigator: { vibrate: (p) => { vibrations.push(p); return true; }, share: null },
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
const origRandomGlobal = Math.random;   /* 테스트가 잠시 갈아 끼우는 Math.random 원본 */

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

console.log('\n[UI-10] 🔊 아도(판 전액) 승리 — 대형 "딱!!" 효과음 분기');
{
  const sfx = sandbox.WNB_SFX;
  const ac = () => AC_INSTANCES[0] || null;
  const kindsSince = n0 => (ac() ? ac().created.slice(n0) : []);
  const n0 = () => (ac() ? ac().created.length : 0);

  ok(!!sfx && typeof sfx.log === 'function', '사운드 계측 핸들(WNB_SFX) 노출');
  ok(/function adoHit\(/.test(src), 'SFX.adoHit(대형 딱!!) 정의');
  ok(/createDynamicsCompressor/.test(src), '아도 타격음에 컴프레서(클리핑 방지)' );
  ok(/if \(adoWin\) SFX\.adoHit\(\); else SFX\.snap/.test(src), '로컬(솔로·AI) 공개: 아도면 대형음, 아니면 일반 탁' );
  ok(/if \(adoWin\) SFX\.adoHit\(\); else SFX\.snap\(1\)/.test(src), '온라인 공개 연출도 같은 분기');
  ok(/adoWin = win && !!res\.ado/.test(src), '승리 && ado 일 때만 대형음(패배·일반 승리 제외)');
  ok(/if \(!c \|\| !on\) return/.test(src), '음소거면 효과음 함수가 즉시 반환');

  /* 한 판을 끝까지: 시작 → (최대=아도) 베팅 → 바로 까기
     AI 3인전이면 판돈 3,000 · 앤티 1,000 → 최소 베팅은 일반, 최대는 아도 */
  function playHand(seed, useMax) {
    Math.random = W.mulberry32(seed * 7919 + 13);
    modeNodes[1].onclick();                            /* data-mode="ai" (3인) */
    getEl('#startBtn').onclick();                     /* paintTurn 이 busy 를 풀어 준다 */
    const A0 = String(getEl('#actions').innerHTML);
    if (!/id="betBtn"/.test(A0)) return null;         /* 땡 판 등 다른 UI */
    if (useMax) {
      const chips = sandbox.document.querySelectorAll('#actions .chip[data-amt]');
      if (!chips.length) return null;
      chips[chips.length - 1].onclick();              /* 정렬 오름차순 → 마지막이 최대(=판돈) */
    }
    const before = n0();
    const bet = getEl('#betBtn');
    if (!bet || typeof bet.onclick !== 'function') return null;
    bet.onclick();
    if (!/id="quickBtn"/.test(String(getEl('#actions').innerHTML))) return null;
    const qb = getEl('#quickBtn');                       /* 로컬 모드는 $('#quickBtn') 로 잡는다 */
    if (!qb || typeof qb.onclick !== 'function') return null;
    qb.onclick();
    return {
      seed: seed,
      msg: String(getEl('#msg').innerHTML),
      last: sfx.log().slice(-1)[0] || '',
      vib: vibrations[vibrations.length - 1],
      kinds: kindsSince(before),
      landCls: getEl('#landWrap').classList.toString(),
      tableCls: getEl('#tableEl').classList.toString()
    };
  }

  let small = null, ado = null;
  for (let seed = 1; seed <= 150 && !(small && ado); seed++) {
    if (!small) {
      const h = playHand(seed, false);                 /* 최소 베팅 = 이 판에선 판돈과 같다 */
      if (h && String(h.vib) === '20,60,20') small = h;   /* 지는 손 → 대형음 금지 */
    }
    if (!ado) {
      const h = playHand(seed + 5000, true);           /* 최대 = 판돈 = 아도 */
      if (h && String(h.vib) === '45,55,45,55,130' && h.last === 'ado') ado = h;
    }
  }
  Math.random = origRandomGlobal;

  ok(!!small, '일반(최소 베팅) 손을 찾았다', small && small.seed);
  ok(!!ado, '아도(최대=판돈) 승리 판을 찾았다', ado && ado.seed);

  if (small) {
    ok(small.last === 'snap', '아도 조건이라도 지면 기존 "띁!!"(snap) — 대형음 안 남', small.last);
    ok(small.kinds.indexOf('createDynamicsCompressor') < 0, '패배엔 컴프레서(대형음) 없음', small.kinds);
    ok(small.landCls.indexOf('ado') < 0, '패배 착지 연출에 ado 클래스 없음', small.landCls);
  }
  if (ado) {
    ok(ado.last === 'ado', '아도 승리는 사운드 로그 = ado(대형 "딱!!")', ado.last);
    ok(ado.kinds.indexOf('createDynamicsCompressor') >= 0, '아도 타격음이 컴프레서를 거친다(클리핑 방지)', ado.kinds);
    ok(ado.kinds.filter(k => k === 'createOscillator').length >= 3, '아도 타격음은 저역·중역·2단 임팩트 오실레이터 3개 이상', ado.kinds);
    ok(ado.kinds.filter(k => k === 'createBufferSource').length >= 3, '노이즈 버스트 3개 이상(어택·크랙·2단)', ado.kinds);
    ok(ado.kinds.length > (small ? small.kinds.length : 0), '아도 승리가 일반 손보다 많은 음원을 쌓는다(더 크고 찰진 소리)', [ado.kinds.length, small && small.kinds.length]);
    ok(/\bado\b/.test(ado.landCls), '착지 연출에 ado(더 큰 슬래밍·금빛 링) 클래스', ado.landCls);
    ok(/adohit/.test(ado.tableCls), '테이블이 금빛으로 번쩍인다(시각 타격감)', ado.tableCls);
  }

  /* 음소거 — 아도 승리여도 소리·노드를 만들지 않는다 */
  if (ado) {
    getEl('#sfxBtn').onclick();                        /* 음소거 */
    ok(sfx.isOn() === false, '🔇 음소거 상태');
    const logBefore = sfx.log().join(',');
    const n1 = n0();
    const m = playHand(ado.seed, true);
    ok(!!m && String(m.vib) === '45,55,45,55,130', '음소거여도 아도 승리 판정·진동은 그대로', m && m.vib);
    ok(n0() === n1, '음소거면 사운드 노드를 만들지 않는다', [n0(), n1]);
    ok(sfx.log().join(',') === logBefore, '음소거면 효과 로그도 쌓이지 않는다(직전 그대로)');
    getEl('#sfxBtn').onclick();                        /* 소리 복구(tick 1회) */
    ok(sfx.isOn() === true, '🔊 소리 복구');
  }
}

console.log('\n[UI-11] 차례 강조 · 보유 머니 가독성');
{
  /* AI 3인전 — 내 자리(0번)는 me, 차례인 사람은 on + ▶ 배지 */
  modeNodes[1].onclick();                              /* data-mode="ai" */
  Math.random = W.mulberry32(20261126);
  getEl('#startBtn').onclick();
  Math.random = origRandomGlobal;
  const kids = getEl('#players').children;
  ok(kids.length === 3, 'AI 3인전 — 플레이어 카드 3개', kids.length);
  ok(/\bme\b/.test(kids[0].className), '내 자리(0번)는 me 클래스', kids[0].className);
  ok(!/\bme\b/.test(kids[1].className), 'AI 자리엔 me 클래스 없음', kids[1].className);
  const onCount = kids.filter(k => /\bon\b/.test(k.className)).length;
  ok(onCount === 1, '차례 강조(on)는 한 명에게만', kids.map(k => k.className));
  const badges = kids.filter(k => /class="tb"/.test(k.innerHTML));
  ok(badges.length === 1, '▶ 차례 배지는 차례인 사람 한 명에게만', badges.length);
  ok(/▶/.test(kids[0].innerHTML) && (/내 차례|YOUR TURN/.test(kids[0].innerHTML)), '내 차례면 "▶ 내 차례" 배지', kids[0].innerHTML.slice(0, 90));
  ok(/class="ch">[\d,]+/.test(kids[0].innerHTML), '내 보유 머니가 카드에 표시', kids[0].innerHTML.slice(-90));
  ok(getEl('#players').className === 'players', '3인은 many 클래스 없음(기본 크기)', getEl('#players').className);

  /* 5~6인 좌석은 many 클래스로 한 단계만 줄인다 */
  ok(/\.players\.many \.pl\.me \.ch\{font-size:13\.5px\}/.test(src), '5~6인 좌석용 축소 규칙');

  /* CSS — 금빛 2.5px 테두리 + 글로우 + 배지, 보유 머니 확대 */
  ok(/\.pl\.on\{[\s\S]{0,220}border:2\.5px solid #ffd76a/.test(src), '현재 차례: 2.5px 금빛 테두리', true);
  ok(/\.pl\.on\{[\s\S]{0,320}box-shadow:0 0 0 1px rgba\(255,215,110,\.35\),0 0 16px/.test(src), '현재 차례: 은은한 금빛 글로우');
  ok(/@keyframes turnGlow/.test(src), '현재 차례: 글로우가 천천히 숨쉰다');
  ok(/\.pl \.tb\{[\s\S]{0,260}font-weight:900/.test(src), '▶ 차례 배지 스타일');
  ok(/\.pl\.me \.ch\{font-size:16px;color:#ffd76a/.test(src), '내 돈 16px 황금 볼드');
  ok(/\.pl \.ch\{[\s\S]{0,200}font-size:12\.5px/.test(src), '상대 돈도 12.5px 로 상향(이전 10px)');
  ok(!/\.pl \.ch\{font-size:10px/.test(src), '예전 10px 규칙 제거');

  /* 모바일 390px 기준 — 4인까지 머니가 카드 폭을 넘지 않는지 계산 */
  const cardw = Math.floor((390 - 24 - 5 * 3 - 2 * 4) / 4);   /* 앱 패딩 12×2 · 카드 간격 5×3 · 카드 패딩 3×2 */
  const moneyW = '50,000'.length * 16 * 0.56;                  /* 16px 볼드 숫자 폭 근사 */
  ok(cardw >= moneyW, '390px·4인에서 내 돈(16px)이 카드 폭에 들어온다', [cardw, Math.round(moneyW)]);
}

console.log('\n결과: ' + pass + ' 통과 / ' + fail + ' 실패');
process.exit(fail ? 1 : 0);
