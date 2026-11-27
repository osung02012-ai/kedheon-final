/* 월남뽕 룰 검증 — 땡 업/다운(1배·동률 패배), 2연속 전원 패스 앤티 재적립, 확률 계산기 미노출,
   중간 판돈 올리기, 자동 팟 충전, 뽕2배·다음버튼 삭제, 48장 금색 숫자 통일 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML = path.join(__dirname, '..', 'public', 'wolnambbong.html');
const src = fs.readFileSync(HTML, 'utf8');
const m = src.match(/<script id="corejs">([\s\S]*?)<\/script>/);
if (!m) { console.error('corejs not found'); process.exit(1); }
const sandbox = { module: { exports: {} }, console, Math };
vm.createContext(sandbox);
vm.runInContext(m[1], sandbox);
const W = sandbox.module.exports;

let pass = 0, fail = 0;
function ok(cond, label, extra) {
  if (cond) { pass++; console.log('  ✓ ' + label); }
  else { fail++; console.log('  ✗ ' + label + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
}
function eq(a, b, label) { ok(a === b, label + ' (' + JSON.stringify(a) + ')', a); }
const card = (month, variant = 0) => ({ id: month + '-' + variant, month, variant });

/* 손으로 만든 판: 보드 두 패 + 덱 맨 위(다음 draw) 지정 */
function scene(opts) {
  const s = W.newGame({ mode: 'ai', ante: 100, count: 3, chips: 1000, rng: () => 0.5 });
  s.over = false;
  s.players.forEach(p => { p.bankrupt = false; p.chips = opts.chips || 1000; });
  s.pot = opts.pot || 1000;
  s.turn = 0;
  s.board = [card(opts.a), card(opts.b === undefined ? opts.a : opts.b)];
  s.third = null;
  s.bet = 0; s.betKind = 'normal'; s.pairDir = null;
  s.phase = 'bet';
  s.pair = s.board[0].month === s.board[1].month;
  s.noGap = (s.board[1].month - s.board[0].month) <= 1;
  s.deck = [card(opts.next)];            // draw()는 pop → 이 카드가 3번째 패
  s.passRun = 0; s.passStreak = 0;
  return s;
}

console.log('\n[1] 땡 판정 — 업/다운 선택과 1배 정산');
{
  // 2땡 + 업 + 7이 나오면 승리, +bet 만큼 (2배 아님)
  let s = scene({ a: 2, next: 7, pot: 1000 });
  let before = s.players[0].chips, potBefore = s.pot;
  let r = W.placePairBet(s, 100, 'up');
  ok(r.ok && r.dir === 'up', 'placePairBet(up) 100 수락', r);
  eq(s.phase, 'peek', '베팅 후 phase=peek');
  let res = W.reveal(s);
  eq(res.type, 'pairWin', '2땡 + 업 + 7 → pairWin');
  eq(res.delta, 100, '승리 배당 = 건 금액 1배 (2배 아님)');
  eq(s.players[0].chips - before, 100, '칩 증가 = +100');
  eq(s.pot, potBefore - 100, '판돈 감소 = -100');

  // 2땡 + 다운 + 7 → 패배, -bet
  s = scene({ a: 2, next: 7, pot: 1000 });
  before = s.players[0].chips; potBefore = s.pot;
  W.placePairBet(s, 100, 'down');
  res = W.reveal(s);
  eq(res.type, 'pairLose', '2땡 + 다운 + 7 → pairLose');
  eq(res.delta, -100, '패배 손실 = -100 (2배 아님)');
  eq(s.players[0].chips - before, -100, '칩 감소 = -100');
  eq(s.pot, potBefore + 100, '판돈 증가 = +100');

  // 땡 숫자와 같은 숫자가 나오면 업이든 다운이든 패배
  s = scene({ a: 2, next: 2, pot: 1000 });
  W.placePairBet(s, 100, 'up');
  res = W.reveal(s);
  eq(res.type, 'pairLose', '2땡 + 업 + 2 → 패배 (동률)');
  eq(res.delta, -100, '동률 손실 -100');

  s = scene({ a: 2, next: 2, pot: 1000 });
  W.placePairBet(s, 100, 'down');
  res = W.reveal(s);
  eq(res.type, 'pairLose', '2땡 + 다운 + 2 → 패배 (동률)');

  // 12땡 + 다운 + 3 → 승리
  s = scene({ a: 12, next: 3, pot: 1000 });
  W.placePairBet(s, 100, 'down');
  res = W.reveal(s);
  eq(res.type, 'pairWin', '12땡 + 다운 + 3 → 승리');
  eq(res.delta, 100, '12땡 승리 +100');

  // 1땡 + 업 + 5 → 승리 / 1땡 + 다운 → 무조건 패배
  s = scene({ a: 1, next: 5, pot: 1000 });
  W.placePairBet(s, 100, 'up');
  eq(W.reveal(s).type, 'pairWin', '1땡 + 업 + 5 → 승리');
  s = scene({ a: 1, next: 1, pot: 1000 });
  W.placePairBet(s, 100, 'down');
  eq(W.reveal(s).type, 'pairLose', '1땡 + 다운 + 1 → 패배');

  // 결과 객체에 방향이 실린다 (온라인 동기화용)
  s = scene({ a: 7, next: 9, pot: 1000 });
  W.placePairBet(s, 100, 'up');
  res = W.reveal(s);
  eq(res.dir, 'up', '결과에 선택 방향(up) 기록');
  eq(res.pair, true, '결과에 땡 플래그 기록');

  // 땡일 때 일반 베팅은 거부되어야 한다
  s = scene({ a: 5, next: 9, pot: 1000 });
  const bad = W.placeBet(s, 100);
  ok(bad.ok === false && bad.err === 'pair', '땡에서 placeBet은 거부(err=pair)', bad);
  ok(typeof W.placeNoGapBet === 'undefined', '뽕 ×2(사이없음) 베팅 API 삭제됨');
  ok(typeof W.noGapStake === 'undefined', '뽕 ×2 배율 계산(noGapStake) 삭제됨');
  const noDir = W.placePairBet(s, 100, null);
  ok(noDir.ok === false && noDir.err === 'dir', '방향 없이 땡 베팅 거부', noDir);
}

console.log('\n[2] 땡이 아닌 일반 사이값 — 기존 룰 유지(경계 적중 = 1배 손실)');
{
  const s = scene({ a: 2, b: 10, next: 5, pot: 1000 });
  const before = s.players[0].chips;
  W.placeBet(s, 100);
  const res = W.reveal(s);
  eq(res.type, 'win', '2–10 사이 5 → win');
  eq(s.players[0].chips - before, 100, '일반 사이값 승리는 여전히 1배');

  /* 경계와 같은 숫자 = 1배 손실 (뽕 2배 페널티 삭제) */
  const e1 = scene({ a: 2, b: 10, next: 2, pot: 1000 });
  W.placeBet(e1, 100);
  const rEdge = W.reveal(e1);
  eq(rEdge.type, 'ppongLose', '경계(2) 적중 → ppongLose');
  eq(rEdge.delta, -100, '경계 적중 손실도 1배(-100)');
  ok(e1.log.every(l => l.t !== 'ppong-double'), '2배 배율 로그 없음');
}

console.log('\n[3] AI — 땡에서 업/다운을 스스로 고른다');
{
  for (const pm of [1, 2, 6, 7, 12]) {
    const s = scene({ a: pm, next: 9, pot: 1000 });
    s.players[1].style = 'balanced';
    // AI 차례(1번)로 옮긴다
    s.turn = 1; s.board = [card(pm), card(pm)];
    const d = W.aiDecide(s);
    const want = pm <= 6 ? 'up' : 'down';
    ok(d.action === 'bet' && d.dir === want, pm + '땡 → AI ' + want + ' 선택', d);
  }
}

console.log('\n[4] 2연속 전원 패스 → 전원 앤티 재적립');
{
  const s = W.newGame({ mode: 'ai', ante: 100, count: 3, chips: 1000, rng: () => 0.5 });
  s.players.forEach(p => { p.bankrupt = false; p.chips = 1000; });
  s.players[1].ai = true; s.players[2].ai = true;
  s.pot = 500; s.phase = 'bet';

  let refills = 0;
  // 3인 = 한 바퀴 3패스. 두 바퀴 연속(6패스)에서 재적립
  for (let i = 0; i < 5; i++) {
    if (s.phase !== 'bet') break;
    W.fold(s);
    if (s.result && s.result.refill) refills++;
    W.continueGame(s);
  }
  eq(refills, 0, '첫 바퀴(3패스)까지는 재적립 없음');
  // 여섯 번째 패스에서 발동
  W.fold(s);
  const res = s.result;
  ok(!!res.refill, '두 번째 바퀴 완주 시 재적립 발동', res.refill);
  eq(res.refill.amt, 300, '3인 × 앤티 100 = 300 적립');
  eq(res.refill.n, 3, '납부 인원 3');

  // 재적립 뒤 카운터 리셋
  W.continueGame(s);
  eq(s.passStreak, 0, '재적립 후 연속 카운터 리셋');

  // 베팅이 끼면 카운터 리셋
  const s2 = scene({ a: 2, b: 10, next: 5, pot: 1000 });
  s2.players.forEach(p => { p.chips = 1000; p.bankrupt = false; });
  W.fold(s2); s2.phase = 'bet';      // 1패스
  eq(s2.passRun, 1, '패스 1회 기록');
  W.placeBet(s2, 100);
  eq(s2.passRun, 0, '베팅하면 패스 카운터 0으로 리셋');
  eq(s2.passStreak, 0, '베팅하면 연속 카운터도 리셋');

  // 짧은 칩: 남은 만큼만 낸다
  const s3 = W.newGame({ mode: 'pass', ante: 100, count: 2, chips: 1000, rng: () => 0.5 });
  s3.players[0].chips = 40; s3.players[1].chips = 1000;
  s3.pot = 500;
  const info = W.anteRefillAll(s3);
  eq(info.amt, 140, '머니 부족자는 남은 40만 납부 (40+100=140)');
  eq(s3.players[0].chips, 0, '부족자는 0칩');
  eq(s3.pot, 640, '판돈에 140 적립');
  eq(info.short, 1, '부족 납부자 1명 보고');
}

console.log('\n[5] 확률 계산기 미노출');
{
  ok(!/id="probTxt"/.test(src), 'probTxt 요소가 HTML에서 제거됨');
  ok(!/\$\('#probTxt'\)/.test(src), 'probTxt 갱신 코드 없음');
  ok(!/oddsPct/.test(src), '확률(oddsPct) 스냅샷 공유 없음');
  ok(/id="rangeTxt"/.test(src), '카드 범위 안내(rangeTxt)는 유지');
  ok(/id="potVal"/.test(src), '쌓인 머니(potVal) 표시는 유지');
}

console.log('\n[6] 1,000 단위 기본값 · 전원 패스 재적립 단위');
{
  const s = W.newGame({ mode: 'ai', count: 3 });
  eq(s.ante, 1000, '기본 앤티 1,000');
  eq(s.players[0].chips, 49000, '기본 시작 머니 50,000 (앤티 1,000 납부 후 49,000)');
  const L = W.betLimits(s);
  eq(L.min, 1000, '최소 베팅 1,000');

  const s2 = W.newGame({ mode: 'ai', count: 3, ante: 2000, chips: 100000 });
  eq(s2.ante, 2000, '앤티 2,000 설정 반영');
  eq(s2.players[0].chips, 98000, '시작 머니 100,000 반영');
  eq(W.betLimits(s2).min, 2000, '앤티 2,000이면 최소 베팅도 2,000');

  // 3인 × 기본 앤티 1,000 — 2연속 전원 패스 적립액
  const s3 = W.newGame({ mode: 'ai', count: 3 });
  s3.players.forEach(p => { p.bankrupt = false; p.chips = 50000; });
  s3.pot = 3000;
  let refill = null;
  for (let i = 0; i < 6; i++) {
    if (s3.phase !== 'bet') break;
    W.fold(s3);
    if (s3.result && s3.result.refill) refill = s3.result.refill;
    W.continueGame(s3);
  }
  ok(!!refill, '기본 설정에서도 2연속 전원 패스 발동', refill);
  eq(refill.amt, 3000, '3인 × 앤티 1,000 = 3,000 적립');
}

console.log('\n[7] AI 베팅 금액도 1,000 단위');
{
  let bad = [];
  for (let k = 0; k < 40; k++) {
    const s = scene({ a: 2, b: 10, next: 5, pot: 3000 + k * 700 });
    s.players.forEach(p => { p.chips = 50000; p.bankrupt = false; });
    s.turn = 1;
    s.players[1].style = ['reckless', 'cautious', 'aggressive', 'balanced'][k % 4];
    const d = W.aiDecide(s);
    if (d.action === 'bet' && d.amount % 1000 !== 0) bad.push(d.amount);
  }
  ok(bad.length === 0, '일반 베팅 40회 모두 1,000 단위', bad);

  let bad2 = [];
  for (let k = 0; k < 20; k++) {
    const pm = (k % 12) + 1;
    const s = scene({ a: pm, next: 9, pot: 5000 + k * 800 });
    s.players.forEach(p => { p.chips = 50000; p.bankrupt = false; });
    s.turn = 1; s.board = [card(pm), card(pm)]; s.pair = true;
    s.players[1].style = ['reckless', 'cautious', 'aggressive', 'balanced'][k % 4];
    const d = W.aiDecide(s);
    if (d.action === 'bet' && d.amount % 1000 !== 0) bad2.push(d.amount);
  }
  ok(bad2.length === 0, '땡 베팅 20회 모두 1,000 단위', bad2);
}

console.log('\n[8] 🎟️ 충전 쿠폰 — 우승 적립 · 쿠폰 사용 · localStorage 영속성');
{
  /* localStorage 대용(메모리) */
  function memStore() {
    const m = {};
    return {
      getItem: k => (Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null),
      setItem: (k, v) => { m[k] = String(v); },
      removeItem: k => { delete m[k]; }
    };
  }

  /* --- 기본 영속성 --- */
  const A = memStore();
  eq(W.couponLoad(A), 0, '처음엔 보유 쿠폰 0장');
  eq(W.couponLoad(null), 0, '저장소가 없으면 0장(안전)');
  eq(W.couponAdd(A, 1), 1, '1장 적립');
  eq(A.getItem(W.COUPON_KEY), '1', 'localStorage 키=' + W.COUPON_KEY + ' 에 1 저장');
  eq(W.couponAdd(A, 2), 3, '2장 더 적립 → 3장');
  eq(W.couponLoad(memStore()), 0, '다른 저장소(새로고침 전 초기화)엔 안 남는다');
  const B = memStore();
  B.setItem(W.COUPON_KEY, '2');
  eq(W.couponLoad(B), 2, '저장된 2장을 그대로 복원(새로고침·재접속 유지)');
  B.setItem(W.COUPON_KEY, 'garbage');
  eq(W.couponLoad(B), 0, '깨진 값은 0장으로 처리');
  B.setItem(W.COUPON_KEY, '-4');
  eq(W.couponLoad(B), 0, '음수는 0장으로 처리');
  B.setItem(W.COUPON_KEY, '1000');
  eq(W.couponLoad(B), W.couponSave(B, 1000), '상한(99장)까지만 보관');

  /* --- 사용(차감) --- */
  const C = memStore();
  W.couponAdd(C, 2);
  let u = W.couponUse(C);
  ok(u.ok && u.left === 1, '쿠폰 1장 사용 → 1장 남음', u);
  eq(u.amount, 10000, '쿠폰 1장 = +10,000 머니');
  u = W.couponUse(C);
  ok(u.ok && u.left === 0, '마지막 1장 사용 → 0장', u);
  u = W.couponUse(C);
  ok(u.ok === false && u.err === 'nocoupon', '0장이면 사용 불가(nocoupon)', u);
  eq(C.getItem(W.COUPON_KEY), '0', '0장도 저장 상태로 남는다');

  /* --- 최종 우승 판정 --- */
  let g = W.newGame({ mode: 'ai', ante: 100, count: 3, chips: 1000, rng: () => 0.5 });
  g.over = true;
  g.players.forEach((p, i) => { p.bankrupt = i !== 0; p.chips = i === 0 ? 3000 : 0; });
  ok(W.isChampion(g, 0), '3인전 마지막 생존(나) → 우승');
  ok(!W.isChampion(g, 1), '파산한 좌석은 우승 아님');
  g.players[2].bankrupt = false;
  ok(!W.isChampion(g, 0), '생존자가 둘이면 우승 확정 아님');

  const soloG = W.newGame({ mode: 'solo', ante: 100, chips: 1000, rng: () => 0.5 });
  ok(!W.isChampion(soloG, 0), '솔로는 우승 개념 없음(연습)');

  /* --- 지급: 우승 시 1장, 같은 판에서 재지급 없음 --- */
  const D = memStore();
  g.players[2].bankrupt = true;
  g.over = true;
  let r = W.couponCheck(g, 0, D);
  ok(r.granted === 1 && r.reason === 'champion', '우승 → 쿠폰 1장 지급', r);
  eq(D.getItem(W.COUPON_KEY), '1', '저장소에 1장 기록');
  r = W.couponCheck(g, 0, D);
  ok(r.granted === 0 && r.reason === 'claimed', '같은 판에서 다시 지급되지 않음', r);
  eq(W.couponLoad(D), 1, '중복 지급 없이 그대로 1장');
  r = W.couponCheck(g, 1, D);
  ok(r.granted === 0, '우승하지 않은 좌석은 지급 없음', r);

  /* 게임이 끝나지 않았으면(over=false) 우승 지급 없음 */
  const E = memStore();
  g.over = false;
  g.couponClaimed = {};
  r = W.couponCheck(g, 0, E);
  eq(r.granted, 0, '게임 종료 전에는 우승 지급 없음');

  /* --- 솔로 연습 3승 목표 --- */
  function soloScene(a, b, next) {
    const s = W.newGame({ mode: 'solo', ante: 1000, chips: 50000, rng: () => 0.5 });
    s.over = false;
    s.players[0].bankrupt = false;
    s.players[0].chips = 50000;
    s.pot = 3000;
    s.turn = 0;
    s.board = [card(a), card(b)];
    s.third = null;
    s.bet = 0; s.betKind = 'normal'; s.pairDir = null; s.phase = 'bet';
    s.pair = s.board[0].month === s.board[1].month;
    s.noGap = (s.board[1].month - s.board[0].month) <= 1;
    s.deck = [card(next)];
    s.passRun = 0; s.passStreak = 0;
    return s;
  }
  const s1 = soloScene(2, 10, 5);
  eq(s1.winCounts[0], 0, '새 판 승리 카운트 0');
  W.placeBet(s1, 1000);
  W.reveal(s1);
  eq(s1.winCounts[0], 1, '승리하면 승리 카운트 +1');
  const s2 = soloScene(2, 10, 5);
  W.placeBet(s2, 1000);
  W.reveal(s2);
  W.continueGame(s2);
  s2.override = 1;
  ok(!W.soloGoalHit(s2, 0), '1승으로는 목표 미달');
  const s3 = soloScene(2, 10, 5);
  s3.winCounts[0] = 2;
  let res3 = W.placeBet(s3, 1000);
  ok(res3.ok, '3승째 판 베팅 수락', res3);
  W.reveal(s3);
  eq(s3.winCounts[0], 3, '3승 기록');
  ok(W.soloGoalHit(s3, 0), '솔로 3승 → 연습 목표 달성');
  const F = memStore();
  r = W.couponCheck(s3, 0, F);
  ok(r.granted === 1 && r.reason === 'solo', '솔로 3승에 쿠폰 1장 지급', r);
  r = W.couponCheck(s3, 0, F);
  eq(r.granted, 0, '3승 뒤 더 이겨도 같은 판에서는 추가 지급 없음');
  eq(W.couponLoad(F), 1, '솔로 쿠폰 1장 유지');

  /* --- 게임 중 사용: +10,000 충전 --- */
  const G = memStore();
  W.couponAdd(G, 1);
  const s4 = soloScene(2, 10, 5);
  const before4 = s4.players[0].chips;
  let rc = W.couponRecharge(s4, 0, G);
  ok(rc.ok, '게임 중 쿠폰 사용 성공', rc);
  eq(s4.players[0].chips - before4, 10000, '보유 머니 +10,000');
  eq(rc.left, 0, '사용 후 보유 0장');
  eq(W.couponLoad(G), 0, 'localStorage에서도 1장 차감');
  ok(W.couponRecharge(s4, 0, G).ok === false, '0장이면 충전 불가');

  /* --- 파산/게임 종료 시 부활 --- */
  const H = memStore();
  W.couponAdd(H, 1);
  const s5 = soloScene(2, 10, 5);
  s5.players[0].bankrupt = true;
  s5.players[0].chips = 0;
  s5.over = true;
  s5.phase = 'result';
  rc = W.couponRecharge(s5, 0, H);
  ok(rc.ok && rc.revived && rc.wasOver, '파산·종료 상태에서 쿠폰 사용 → 부활', rc);
  eq(s5.over, false, '게임 종료가 풀린다');
  eq(s5.players[0].bankrupt, false, '파산 표시가 풀린다');
  eq(s5.players[0].chips, 10000, '부활 머니 10,000');
  const bt = W.beginTurn(s5);
  ok(s5.phase === 'bet' || s5.over === false, '부활 후 다음 차례를 열 수 있다', { phase: s5.phase, over: s5.over });

  /* --- 온라인 방장 대행 충전: 차감 없이 머니만 (손님 기기에서 이미 차감) --- */
  const s6 = W.newGame({ mode: 'pass', ante: 1000, count: 3, chips: 50000, rng: () => 0.5 });
  const before6 = s6.players[1].chips;
  rc = W.couponRecharge(s6, 1, null);
  ok(rc.ok, '방장 대행 충전 성공(null 저장소)', rc);
  eq(s6.players[1].chips - before6, 10000, '손님 좌석 +10,000 동기화');
  eq(s6.players[0].chips, 49000, '다른 좌석 머니는 그대로');

  /* --- 화면 요소·키 존재 --- */
  ok(/data-cpn/.test(src), '헤더·상태바에 쿠폰 수량 표시([data-cpn])');
  ok(/id="cpnUseSetup"/.test(src), '설정 화면에 쿠폰 사용 버튼');
  ok(/localStorage/.test(src), 'localStorage 영속성 코드 존재');
}

console.log('\n[9] 중간 판돈 올리기 — 단계 상향 · 하향 거부 · 상한');
{
  const g = W.newGame({ mode: 'ai', ante: 1000, count: 3, chips: 50000 });
  eq(g.ante, 1000, '시작 앤티 1,000');

  const up = W.raiseAnte(g, 2000);
  ok(up.ok && up.from === 1000 && up.ante === 2000, '1,000 → 2,000 인상', up);
  eq(g.ante, 2000, '상태의 앤티가 2,000으로');
  eq(g.anteRaises, 1, '인상 횟수 1');
  eq(g.anteHistory.length, 1, '인상 이력 1건');
  eq(g.anteHistory[0].to, 2000, '이력에 새 앤티 기록');
  eq(W.betLimits(g).min, 1000, '최소 베팅은 팟 한도(팟 1,000 → 1,000)');
  g.pot = 5000;
  eq(W.betLimits(g).min, 2000, '팟이 충분하면 최소 베팅 = 새 앤티(2,000)');

  const low = W.raiseAnte(g, 2000);
  ok(low.ok === false && low.err === 'low', '같은 금액은 거부(err=low)', low);
  const down = W.raiseAnte(g, 1000);
  ok(down.ok === false && down.err === 'low', '내리는 것도 거부', down);
  const nan = W.raiseAnte(g, 'abc');
  ok(nan.ok === false && nan.err === 'amount', '숫자가 아니면 거부', nan);

  const cap = W.raiseAnte(g, 999999);
  ok(cap.ok && cap.ante === W.ANTE_MAX, '상한 50,000으로 캡', cap);
  eq(W.ANTE_MAX, 50000, '최대 앤티 50,000');

  const opts = W.anteOptions({ ante: 1000 });
  eq(opts[0], 2000, '1,000에서 다음 단계 2,000');
  ok(opts.indexOf(5000) > 0 && opts.indexOf(10000) > 0, '5,000·10,000 단계 노출', opts);
  eq(W.anteOptions({ ante: 50000 }).length, 0, '최대에서는 더 올릴 단계 없음');

  const go = W.newGame({ mode: 'solo', ante: 1000 });
  go.over = true;
  const overRaise = W.raiseAnte(go, 2000);
  ok(overRaise.ok === false && overRaise.err === 'over', '게임 종료 뒤에는 인상 불가', overRaise);
}

console.log('\n[10] 쌓인 머니 < 기본 베팅 → 자동 추가 베팅(팟 충전)');
{
  /* 3인 · 앤티 1,000 · 팟 500 → 자동 충전 */
  const s = W.newGame({ mode: 'pass', ante: 1000, count: 3, chips: 20000, rng: () => 0.5 });
  s.players.forEach(p => { p.chips = 20000; p.bankrupt = false; });
  s.pot = 500;
  const info = W.autoTopUp(s);
  ok(!!info, '팟 < 앤티 → 자동 충전 발동', info);
  eq(info.amt, 3000, '3인 × 앤티 1,000 = 3,000 추가 베팅');
  eq(info.n, 3, '납부 인원 3');
  eq(s.pot, 3500, '팟 500 → 3,500');
  ok(s.players.every(p => p.chips === 19000), '전원 1,000씩 차감', s.players.map(p => p.chips));
  ok(s.log.some(l => l.t === 'auto-topup'), '자동 충전 로그 기록');

  /* 이미 앤티 이상이면 아무 일도 없다(멱등) */
  eq(W.autoTopUp(s), null, '팟 ≥ 앤티면 발동하지 않음');
  eq(s.pot, 3500, '팟 변화 없음');

  /* 보유 머니가 모자란 참가자는 남은 만큼만 */
  const s2 = W.newGame({ mode: 'pass', ante: 1000, count: 3, chips: 20000, rng: () => 0.5 });
  s2.players.forEach(p => { p.chips = 20000; p.bankrupt = false; });
  s2.players[1].chips = 400;
  s2.players[2].bankrupt = true;
  s2.pot = 100;
  const i2 = W.autoTopUp(s2);
  eq(i2.amt, 1400, '부족자는 400만 · 나머지는 1,000 (1,400)');
  eq(s2.players[1].chips, 0, '부족자는 0칩');
  eq(i2.short, 2, '부족·파산 인원 2 보고');
  eq(s2.pot, 1500, '팟 100 → 1,500');

  /* 솔로 — 하우스가 부족분을 채운다 */
  const so = W.newGame({ mode: 'solo', ante: 1000, chips: 50000, rng: () => 0.5 });
  so.pot = 300;
  const i3 = W.autoTopUp(so);
  ok(i3 && i3.house, '솔로는 하우스 충전', i3);
  eq(so.pot, 1000, '솔로 팟이 앤티(1,000)까지 채워짐');
  eq(so.players[0].chips, 49000, '솔로 플레이어 머니는 그대로');

  /* 턴 시작 시 자동 발동 — 앤티를 내도 팟이 앤티보다 적은 상황 */
  const s3 = W.newGame({ mode: 'pass', ante: 1000, count: 3, chips: 20000, rng: () => 0.5 });
  s3.players.forEach(p => { p.chips = 20000; p.bankrupt = false; });
  s3.pot = 0; s3.phase = 'idle'; s3.turn = 0; s3.deck = W.newDeck();
  W.beginTurn(s3);
  ok(s3.pot >= s3.ante, '턴 시작 뒤 팟은 최소 앤티 이상', { pot: s3.pot, ante: s3.ante });

  /* 정산 직후 자동 발동 — 큰 승리로 팟이 앤티 밑으로 떨어질 때 */
  const s4 = W.newGame({ mode: 'pass', ante: 1000, count: 3, chips: 20000, rng: () => 0.5 });
  s4.players.forEach(p => { p.chips = 20000; p.bankrupt = false; });
  s4.turn = 0; s4.phase = 'bet';
  s4.board = [card(2), card(10)];
  s4.pair = false; s4.noGap = false; s4.third = null; s4.bet = 0; s4.betKind = 'normal';
  s4.deck = [card(5)];
  s4.pot = 1500;
  W.placeBet(s4, 1000);
  const r4 = W.reveal(s4);           /* win +1000 → 팟 500 < 앤티 1,000 */
  eq(r4.type, 'win', '2–10 사이 5 승리');
  ok(!!r4.autotop, '정산 직후 자동 충전 결과에 기록', r4.autotop);
  ok(s4.pot > s4.ante, '정산 뒤 팟이 앤티보다 커진다', s4.pot);
  const chipsSum = s4.players.reduce((t, p) => t + p.chips, 0) + s4.pot;
  eq(chipsSum, W.totalChips(s4), '머니 총량 보존(자동 충전은 이동만)');
}

console.log('\n[11] 삭제·자동 진행 확인 (뽕 2배 · 다음 버튼)');
{
  ok(!/ppongDouble/.test(src), '뽕 2배 배율 상태(ppongDouble) 삭제');
  ok(!/ppongSwitch/.test(src), '설정·로비의 뽕 2배 토글 삭제');
  ok(!/ppongBet/.test(src), '뽕 ×2 걸기 버튼 문구 삭제');
  ok(!/placeNoGapBet|noGapStake/.test(src), '뽕 ×2 베팅 로직 삭제');
  ok(!/id="nextBtn"/.test(src), "'다음' 버튼 UI 삭제");
  ok(!/id="ngBtn"/.test(src), "'뽕 ×2 걸기' 버튼 UI 삭제");
  ok(/scheduleAdvance\(HOLD_MS\)/.test(src), '공개 뒤 자동 진행 예약(landThird → HOLD_MS)');
  ok(/scheduleAdvance\(FOLD_MS\)/.test(src), '패스 뒤 자동 진행 예약');
  ok(/function scheduleAdvance/.test(src), '자동 진행 스케줄러 존재');
  const hm = src.match(/HOLD_MS\s*=\s*(\d+)/);
  ok(hm && +hm[1] >= 1800 && +hm[1] <= 2200, '결과 확인 시간 1.8~2.2초 (HOLD_MS=' + (hm && hm[1]) + ')');
  ok(/doneApply[\s\S]{0,400}scheduleAdvance/.test(src), '온라인도 방장이 자동으로 다음 판');
}

console.log('\n[12] 48장 카드 — 동그라미 삭제 · 좌상단 황금색 숫자 · 흰 숫자 0장');
{
  let sameNum = [], whiteHits = [], badFill = [], missing = [], circleHits = [];
  let posBad = [], sizeBad = [], strokeBad = [], gradHits = [];
  let ref = null, count = 0;
  for (let m = 1; m <= 12; m++) {
    for (let v = 0; v < 4; v++) {
      count++;
      const svg = W.faceSVG({ month: m, variant: v });
      /* ① 원형 배지(메달)가 남아 있으면 실패 — 카드 전체에 <circle> 금지 */
      if (/<circle/i.test(svg)) circleHits.push(m + '-' + v);
      /* ② 배지용 그라데이션 defs도 함께 사라져야 한다 */
      if (/radialGradient|linearGradient|url\(#gf|url\(#gs/.test(svg)) gradHits.push(m + '-' + v);
      /* ③ 숫자는 카드 마지막(</svg> 직전)에 <g><text> 하나 */
      const i = svg.lastIndexOf('<g><text');
      if (i < 0) { missing.push(m + '-' + v); continue; }
      const b = svg.slice(i);
      const tm = b.match(/<text([^>]*)>(\d+)<\/text>/);
      if (!tm) { missing.push(m + '-' + v); continue; }
      const attrs = tm[1];
      if (+tm[2] !== m) missing.push(m + '-' + v + ':num=' + tm[2]);
      if (!/fill="#f3c73f"/i.test(attrs)) badFill.push(m + '-' + v);
      if (/fill="#fff/i.test(attrs)) whiteHits.push(m + '-' + v);
      if (!/stroke="#0d0803"/i.test(attrs) || !/paint-order="stroke"/.test(attrs)) strokeBad.push(m + '-' + v);
      const x = +((attrs.match(/ x="([\d.]+)"/) || [])[1]);
      const y = +((attrs.match(/ y="([\d.]+)"/) || [])[1]);
      const fs = +((attrs.match(/font-size="([\d.]+)"/) || [])[1]);
      /* ④ 좌측 상단 모서리 밀착 — x 8 이하, 글자 꼭대기는 카드 위쪽 8 안쪽 */
      if (!(x <= 8 && (y - fs * 0.84) <= 8 && y > 14)) posBad.push(m + '-' + v + ':x=' + x + ',y=' + y);
      /* ⑤ 숫자 크기 확대 — 한 자리 30 이상, 두 자리 26 이상(예전 13.4 / 9.6) */
      if (!(fs >= (m > 9 ? 26 : 30))) sizeBad.push(m + '-' + v + ':fs=' + fs);
      const norm = attrs.replace(/font-size="[\d.]+"/, 'font-size="F"')
        .replace(/ x="[\d.]+"/, ' x="X"').replace(/ y="[\d.]+"/, ' y="Y"')
        .replace(/text-anchor="\w+"/, 'text-anchor="A"');
      if (ref === null) ref = norm; else if (norm !== ref) sameNum.push(m + '-' + v);
    }
  }
  eq(count, 48, '48장 전부 렌더');
  eq(missing.length, 0, '모든 카드에 숫자 존재', missing);
  eq(circleHits.length, 0, '동그라미(원형 배지) 0장', circleHits);
  eq(gradHits.length, 0, '배지용 그라데이션 defs 삭제', gradHits);
  eq(sameNum.length, 0, '48장 숫자 스타일 동일(위치·크기만 자리별)', sameNum);
  eq(badFill.length, 0, '48장 모든 숫자가 황금색(#f3c73f)', badFill);
  eq(strokeBad.length, 0, '48장 모두 먹색 외곽선 + paint-order:stroke', strokeBad);
  eq(posBad.length, 0, '좌측 상단 모서리 밀착', posBad);
  eq(sizeBad.length, 0, '숫자 크기 확대(한 자리 38 / 두 자리 31.5)', sizeBad);
  eq(whiteHits.length, 0, '흰색으로 빠지는 카드 0장', whiteHits);
  /* 색상 검증 — 황금색 계열(색상 35~55°, 채도 60% 이상) */
  const hex = '#f3c73f', r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const mx = Math.max(r,g,b), mn = Math.min(r,g,b), d = mx-mn;
  let hue = mx === r ? ((g-b)/d)%6 : mx === g ? (b-r)/d+2 : (r-g)/d+4;
  hue = (hue*60+360)%360;
  const sat = d/mx;
  ok(hue >= 35 && hue <= 55, '숫자 색상이 황금색 계열(H=' + hue.toFixed(1) + '°)');
  ok(sat > 0.6, '숫자 채도 충분(S=' + sat.toFixed(2) + ')');
  ok(mx > 0.8, '숫자 밝기 충분 — 흐린 회색/흰색 아님(L≈' + (mx*100).toFixed(0) + '%)');
  ok(/x="6\.5"/.test(W.faceSVG({ month: 7, variant: 0 })), '숫자 좌측 x=6.5 — 카드 테두리 안쪽 모서리 밀착');
  ok(/font-size="38"/.test(W.faceSVG({ month: 7, variant: 0 })), '한 자리 숫자 38 (기존 13.4)');
  ok(/font-size="31\.5"/.test(W.faceSVG({ month: 12, variant: 0 })), '두 자리 숫자 31.5 (기존 9.6)');
  ok(!/r="11\.2"/.test(src), '메달 반지름(11.2) 마크업 삭제');
}

console.log('\n[13] 연속 숫자(사이 없음) — 패스 강제 해제 · 플레이어가 직접 건다');
{
  /* 2·3 — 사이가 없어 어떤 패도 들어갈 수 없다 */
  const s = scene({ a: 2, b: 3, next: 7, pot: 2000 });
  eq(s.noGap, true, '2·3 → noGap 플래그');
  const L = W.betLimits(s);
  ok(L.max >= 500, '베팅 한도는 그대로 계산', L);
  const before = s.players[0].chips, potBefore = s.pot;
  const r = W.placeBet(s, 500);
  ok(r.ok && r.amount === 500, '연속 숫자에서도 걸기 수락', r);
  eq(s.phase, 'peek', '베팅하면 phase=peek');
  const res = W.reveal(s);
  eq(res.type, 'lose', '사이에 못 들어가 패배');
  eq(res.delta, -500, '잃은 금액 = 건 금액 1배');
  eq(s.players[0].chips - before, -500, '칩 -500');
  eq(s.pot, potBefore + 500, '판돈 +500 (1배 적립, 2배 아님)');

  /* 경계(2 또는 3)가 나오면 ppongLose — 역시 1배 */
  const e = scene({ a: 2, b: 3, next: 3, pot: 2000 });
  W.placeBet(e, 1000);
  const re = W.reveal(e);
  eq(re.type, 'ppongLose', '연속 숫자의 경계 적중 → ppongLose');
  eq(re.delta, -1000, '경계 적중도 1배');

  /* 걸지 않고 패스하는 선택도 그대로 */
  const f = scene({ a: 6, b: 7, next: 9, pot: 2000 });
  const fr = W.fold(f);
  ok(fr.ok === true, '연속 숫자에서 패스도 가능', fr);
  eq(f.result.delta, 0, '패스는 손익 0');

  /* 한도 밖 금액은 기존처럼 잘라서 */
  const c = scene({ a: 4, b: 5, next: 9, pot: 2000 });
  const cr = W.placeBet(c, 999999);
  ok(cr.ok && cr.amount === W.betLimits(c).max, '한도 초과는 최대치로 잘림', cr);

  /* 땡(2·2)은 여전히 업/다운 — 일반 베팅 거부 */
  const p = scene({ a: 2, b: 2, next: 9, pot: 2000 });
  const pr = W.placeBet(p, 500);
  ok(pr.ok === false && pr.err === 'pair', '땡은 여전히 업/다운 선택', pr);

  /* AI는 연속 숫자에서 합리적으로 패스 */
  const ai = scene({ a: 4, b: 5, next: 9, pot: 2000 });
  ai.turn = 1;
  const d = W.aiDecide(ai);
  ok(d.action === 'fold' && d.reason === 'nogap', 'AI는 사이 없음이면 패스', d);

  /* UI에 '패스만 가능' 강제 분기가 없다 · 안내 문구도 바뀐다 */
  ok(!/if \(S\.noGap && !S\.pair\) \{\s*return '<div class="ctarow">/.test(src), '베팅 UI에 사이 없음 패스 강제 분기 없음');
  ok(/noGapMsg: '사이 없음 — 걸어도 들어갈 자리 없음'/.test(src), '안내 문구도 강제 패스가 아니라 선택 안내');
  ok(/id="betBtn"/.test(src) && /id="passBtn"/.test(src), '걸기·패스 버튼이 함께 생성된다');
}

console.log('\n[14] 모바일 실기기 카드 크기 — 기준 패 2장 확대');
{
  const cm = src.match(/--cardw\s*:\s*min\(([\d.]+)vw/);
  ok(!!cm && +cm[1] >= 26, '카드 폭 vw 계수 26 이상 (이전 19.6vw)', cm && cm[1]);
  ok(/\.slot\{width:var\(--cardw\)/.test(src), '.slot 이 --cardw 사용');
  ok(/\.landcard\{[\s\S]{0,80}width:var\(--cardw\)/.test(src), '.landcard 도 --cardw 사용');
  ok(/calc\(var\(--cardw\)\*1\.55\)/.test(src), '높이는 120:186 비율(×1.55)');
  ok(!/(?:width|height)\s*:[^;}]*19\.6vw/.test(src), '낡은 19.6vw 크기 규칙 제거(주석 제외)');
  /* 3장(착지 패 포함)이 테이블 안쪽 폭에 들어오는지 계산 검증 */
  for (const vw of [360, 390, 412]) {
    const cardw = Math.min(27.8 * vw / 100, 124);
    const inner = vw - 24 - 16;   /* 앱 좌우 패딩 12×2 · 테이블 패딩 8×2 */
    ok(cardw * 3 + 9 * 2 <= inner, vw + 'px 폭: 3장 + 간격 18 ≤ ' + inner + ' (카드 폭 ' + cardw.toFixed(1) + ')');
  }
}

console.log('\n[15] 아도(판 전액) 판정 — 승리하면 팟 전액 회수 · 일반 올인과 구분');
{
  /* 판돈 4,000 / 내 돈 8,000 → 최대 베팅 = 판돈 = 아도 */
  let s = scene({ a: 2, b: 10, next: 5, pot: 4000, chips: 8000 });
  let L = W.betLimits(s);
  eq(L.max, 4000, '최대 베팅 = 판돈(내 돈이 더 많을 때)');
  let before = s.players[0].chips;
  W.placeBet(s, L.max);
  let res = W.reveal(s);
  eq(res.type, 'win', '사이값 적중 → win');
  eq(res.ado, true, '건 금액 = 판돈 → res.ado === true');
  eq(res.sweep, true, '팟 통째 회수(sweep) 표시');
  eq(res.delta, 4000, '회수액 = 판돈 전액 4,000');
  /* 판돈이 0이 되어 전원 앤티(100) 자동 충전이 붙으므로 칩 변화는 4,000 − 100 */
  eq(s.players[0].chips - before, 3900, '칩 증가 = 회수 4,000 − 자동 충전 앤티 100');
  eq(res.pot0, 4000, '정산 전 판돈(pot0)도 결과에 남는다');

  /* 같은 조건인데 최소 베팅 → 아도 아님 */
  s = scene({ a: 2, b: 10, next: 5, pot: 4000, chips: 8000 });
  W.placeBet(s, 1000);
  res = W.reveal(s);
  eq(res.type, 'win', '일반 베팅도 적중하면 win');
  eq(res.ado, false, '최소 베팅(1,000) 승리 → ado === false');
  eq(res.sweep, false, '일반 승리는 sweep 아님');

  /* 내 돈이 판돈보다 적은 올인 → 아도 아님(팟을 다 못 쓸어간다) */
  s = scene({ a: 2, b: 10, next: 5, pot: 4000, chips: 1000 });
  L = W.betLimits(s);
  eq(L.max, 1000, '내 돈이 모자라면 최대 = 내 돈(올인)');
  W.placeBet(s, L.max);
  res = W.reveal(s);
  eq(res.type, 'win', '올인 적중 → win');
  eq(res.ado, false, '내 돈 전액 올인이라도 판돈 전액이 아니면 ado === false');
  eq(res.sweep, false, '팟을 다 쓸어가지 못하므로 sweep === false');
  eq(res.delta, 1000, '회수액은 건 금액 1,000');

  /* 아도인데 지면 ado 표시는 남되 승리 분기(대형음)는 타지 않는다 */
  s = scene({ a: 2, b: 10, next: 12, pot: 4000, chips: 8000 });
  W.placeBet(s, 4000);
  res = W.reveal(s);
  eq(res.type, 'lose', '바깥 숫자 → lose');
  eq(res.ado, true, '아도 패배에도 ado === true');
  eq(res.sweep, false, '패배는 sweep 아님');

  /* 땡(2·2) 아도 — 업/다운 적중이면 팟 전액 */
  s = scene({ a: 2, b: 2, next: 9, pot: 3000, chips: 3000 });
  W.placePairBet(s, 3000, 'up');
  res = W.reveal(s);
  eq(res.type, 'pairWin', '2땡 + 업 + 9 → pairWin');
  eq(res.ado, true, '땡 아도도 ado === true');
  eq(res.sweep, true, '땡 아도 적중 → 팟 전액 회수');
  eq(res.delta, 3000, '회수액 3,000');

  /* 패스는 아도가 아니다 */
  s = scene({ a: 2, b: 10, next: 5, pot: 4000, chips: 8000 });
  const fr = W.fold(s);
  ok(fr.ok === true, '패스 수락', fr);
  eq(s.result.ado, false, '패스 결과 ado === false');
  eq(s.result.sweep, false, '패스 결과 sweep === false');

  /* 판돈이 0이거나 베팅이 없으면 ado 아님(0으로 나누기·오판 방지) */
  s = scene({ a: 2, b: 10, next: 5, pot: 1, chips: 8000 });
  s.pot = 0;
  eq(W.betLimits(s).max, 0, '판돈 0이면 최대 베팅 0');
  s.pot = 2; s.players[0].chips = 8000;
  W.placeBet(s, 2);
  res = W.reveal(s);
  eq(res.type, 'win', '초소액 판도 승리하면 win');
  eq(res.ado, true, '판돈 2를 전부 건 판도 ado === true');
  eq(res.delta, 2, '회수액 2');
}

console.log('\n[16] 짧은 모바일 화면 — 깔린 2장 잘림 0px · [⤒] 겹침 방지');
{
  /* 쪼기 패는 기준 패의 72% — 작아야 위쪽 두 패를 키운 채 한 화면에 들어온다 */
  const pw = src.match(/--pickw:calc\(var\(--cardw\)\s*\*\s*([\d.]+)\)/);
  ok(!!pw && +pw[1] >= 0.7 && +pw[1] <= 0.78, '쪼기 패 = 기준 패의 0.70~0.78배', pw && pw[1]);
  ok(/\.thirdwrap\{[\s\S]{0,140}width:calc\(var\(--pickw\)\*1\.07\)/.test(src), '.thirdwrap 폭이 --pickw 기준');
  ok(/\.thirdwrap\{[\s\S]{0,200}height:calc\(var\(--pickw\)\*1\.6585\)/.test(src), '.thirdwrap 높이도 --pickw 기준');
  ok(!/\.thirdwrap\{[^}]*width:calc\(var\(--cardw\)\*1\.07\)/.test(src), '옛 기준 패 크기(×1.07) 규칙 제거');

  /* 카드 폭을 화면 높이에서 역산 — 짧은 뷰포트에서 테이블 높이가 모자라 위가 잘리던 원인 */
  ok(/--fitw:calc\(\(100dvh - var\(--chrome\)\)\/2\.744\)/.test(src), '화면 높이(100dvh)에서 머리 높이를 뺀 값으로 카드 폭 역산');
  ok(/--cardw:min\(27\.8vw,120px,var\(--fitw\)\)/.test(src), '카드 폭 상한 = min(27.8vw, 120px, 역산값)');
  ok(/@media \(max-height:700px\)\{[\s\S]{0,900}--chrome:414px/.test(src), '≤700px 화면은 머리 높이 414px 로 보정');
  ok(/container-type:size/.test(src), '.table 이 크기 컨테이너(cqh 안전장치)');
  ok(/justify-content:safe center/.test(src), '넘칠 때 위가 아니라 아래로 흘리는 safe center(justify-content)');

  /* [⤒] 판돈 버튼은 테이블 우하단 — 상단 패와 겹칠 수 없는 자리 */
  ok(/\.raisebtn\{[\s\S]{0,140}bottom:6px;right:8px/.test(src), '[⤒] 판돈 버튼을 테이블 우하단에 배치');
  ok(!/\.raisebtn\{[^}]*\btop:7px/.test(src), '상단 고정(top:7px) 규칙 제거 — 깔린 오른쪽 패와 겹침 방지');

  /* 실제 높이 계산: 카드 1.55 + 쪼기패 1.6585×비율 + 간격·쪼기안내 32 + 테이블 패딩 15 ≤ 테이블 높이 */
  const pick = +pw[1];
  const div = +(src.match(/--fitw:calc\(\(100dvh - var\(--chrome\)\)\/([\d.]+)\)/) || [0, 2.744])[1];
  const cases = [
    /* [뷰포트 폭, 높이, 머리 높이, 카드 상한]  — 360×640·390×680·390×740·365×700 */
    [360, 640, 414, 110], [390, 640, 414, 110],
    [390, 680, 414, 110], [365, 700, 414, 110],
    [390, 740, 434, 120], [412, 800, 434, 120]
  ];
  for (const [vw, vh, chrome, cap] of cases) {
    const cardw = Math.min(27.8 * vw / 100, cap, (vh - chrome) / div);
    const tableH = vh - (chrome - 47);          /* 머리·발치를 뺀 테이블 높이 */
    const need = 1.55 * cardw + 6 + 1.6585 * pick * cardw + 5 + 21 + 15;
    ok(need <= tableH + 2, vw + '×' + vh + ' 쪼개기 단계가 잘림 없이 들어온다 (필요 ' + need.toFixed(1) + ' ≤ ' + tableH + ', 카드 ' + cardw.toFixed(1) + 'px)', [need, tableH]);
    ok(cardw >= 60, vw + '×' + vh + ' 카드 폭이 읽을 만하다 (' + cardw.toFixed(1) + 'px ≥ 60)', cardw);
  }
}

console.log('\n[17] 초대하기 · 초대 링크 딥링크(?room=) 파싱');
{
  /* 순수 함수 — 화면과 같은 W.inviteLink / W.parseInvite / W.inviteText 를 검사한다 */
  eq(W.inviteLink('https://xaea12.kedheon.com', '4821'),
    'https://xaea12.kedheon.com/wolnambbong.html?room=4821', '초대 링크 = origin + /wolnambbong.html?room=XXXX');
  eq(W.inviteLink('https://xaea12.kedheon.com/', ' 4 8 2 1 '),
    'https://xaea12.kedheon.com/wolnambbong.html?room=4821', '끝 슬래시·공백·비숫자는 정리');
  eq(W.inviteLink('', '4821'), '/wolnambbong.html?room=4821', 'origin 이 없으면 상대 경로');
  eq(W.inviteLink('https://x', '12'), '', '3자리 코드는 링크를 만들지 않는다');
  eq(W.inviteLink('https://x', 'abcd'), '', '숫자 아닌 코드는 링크를 만들지 않는다');
  eq(W.roomCode('00 12'), '0012', 'roomCode 는 4자리만 인정');

  eq(W.parseInvite('https://xaea12.kedheon.com/wolnambbong.html?room=4821'), '4821', '딥링크에서 방 코드 추출');
  eq(W.parseInvite('https://xaea12.kedheon.com/wolnambbong.html?room=4821&x=1'), '4821', '뒤에 다른 쿼리가 붙어도 추출');
  eq(W.parseInvite('?room=9070#invite'), '9070', '#앵커가 붙어도 추출');
  eq(W.parseInvite(' 4821 '), '4821', '4자리 코드만 붙여넣어도 통과');
  eq(W.parseInvite('https://xaea12.kedheon.com/wolnambbong.html?room=12'), '', '3자리 room 파라미터는 무시');
  eq(W.parseInvite('https://xaea12.kedheon.com/wolnambbong.html'), '', 'room 파라미터 없는 링크는 코드 없음');
  eq(W.parseInvite(''), '', '빈 문자열은 코드 없음');
  eq(W.parseInvite(null), '', 'null 안전');

  ok(/방 코드/.test(W.inviteText('4821', 'kr')) && /4821/.test(W.inviteText('4821', 'kr')), '한국어 초대 문구에 방 코드 포함');
  ok(/Room code/i.test(W.inviteText('4821', 'en')) && /4821/.test(W.inviteText('4821', 'en')), '영어 초대 문구에 Room code 포함');
  ok(W.inviteText('4821', 'kr') !== W.inviteText('4821', 'en'), '언어별 문구가 다르다');

  /* 화면 배선 */
  ok(/id="inviteBtn"/.test(src), '대기실에 초대하기 버튼(#inviteBtn)');
  ok(/id="inviteBtn"[\s\S]{0,90}data-i18n="invite"/.test(src), '초대하기 버튼은 다국어(data-i18n="invite")');
  ok(/#inviteBtn\{/.test(src), '초대하기 버튼 스타일 정의');
  ok(/W\.inviteLink\(/.test(src) && /W\.parseInvite\(/.test(src), '화면이 W.inviteLink·W.parseInvite 를 사용');
  ok(/navigator\.share/.test(src) && /navigator\.clipboard\.writeText/.test(src), '공유 시트 → 클립보드 순 폴백');
  ok(/cdocument/.test(src) === false && /execCommand\('copy'\)/.test(src), '클립보드 미지원 시 수동 복사 폴백');
  ok(/function paintRoomBadge/.test(src), '상단 방 코드 배지 = 방장 초대 트리거');
  ok(/#roomBadge\.invitable\{cursor:pointer\}/.test(src), '방장일 때만 배지가 클릭 커서');
  ok(/hint\('🎟️ ' \+ t\('roomCode'\)/.test(src), '초대 링크 접속 시 방 코드·안내 문구 표시');
  ok(/ui\.mode !== 'online'\) \{ ui\.mode = 'online'; applyStatic\(\)/.test(src), '초대 링크로 오면 온라인 모드로 전환');
}

console.log('\n[18] 다국어 — 번역본에 ADO(아도) 잔존 0');
{
  const langBlock = (name) => {
    const m = src.match(new RegExp('\\n    ' + name + ': \\{([\\s\\S]*?)\\n    \\}'));
    return m ? m[0] : '';
  };
  const kr = langBlock('kr'), en = langBlock('en');
  ok(!!kr && !!en, 'kr·en 사전을 찾는다');
  ok(/ado: 'MAX'/.test(en), "영문 아도 라벨 = 'MAX'");
  ok(/adoWin: 'MAX BET'/.test(en), "영문 우승 문구 = 'MAX BET'");
  ok(!/'ADO'/.test(en) && !/아도/.test(en), '영문 사전에 ADO·아도 없음');
  ok(/ado: '아도'/.test(kr), "한국어 라벨은 그대로 '아도'");
  ok(/adoWin: '아도'/.test(kr), "한국어 우승 문구도 '아도'");
  ok(/invite: '초대하기'/.test(kr) && /invite: 'Invite'/.test(en), '초대하기 라벨 다국어');
  ok((src.match(/t\('ado'\)/g) || []).length === 1, "t('ado') 는 베팅 칩 라벨 한 곳에서만", (src.match(/t\('ado'\)/g) || []).length);
  ok((src.match(/t\('adoWin'\)/g) || []).length === 2, "우승 문구는 t('adoWin') 두 곳", (src.match(/t\('adoWin'\)/g) || []).length);
}

/* ============================================================
   [19] 왕좌(명예 등급) — 판정 · 집계 · 보존
   ============================================================ */
function fakeStore(raw) {
  const m = {};
  if (raw !== undefined) m[W.THRONE_KEY] = typeof raw === 'string' ? raw : JSON.stringify(raw);
  return {
    getItem: (k) => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: (k) => { delete m[k]; }
  };
}
function stOf(raw) { return W.throneLoad(fakeStore(raw)); }
function gradeOf(raw) { return W.throneGrade(stOf(raw)); }
/* 이벤트 n건 적용한 뒤의 기록 */
function play(evs, base) {
  let st = stOf(base || {});
  evs.forEach((e) => { st = W.throneApply(st, Object.assign({ play: true, win: false, ado: false, comeback: false, human: false }, e)); });
  return st;
}
const winN = (n, extra) => Array(n).fill(0).map(() => Object.assign({ win: true }, extra || {}));
const loseN = (n, extra) => Array(n).fill(0).map(() => Object.assign({ win: false }, extra || {}));
const recentMix = (wins, total) => Array(total).fill(0).map((_, i) => (i < wins ? 1 : 0));

console.log('\n[19] 왕좌(명예 등급) — 7단계 정의');
{
  eq(W.THRONES.length, 7, '왕좌 7단계');
  eq(W.THRONES.map((t) => t.g).join(','), '1,2,3,4,5,6,7', '등급 1~7 순서');
  ok(W.THRONES.every((t) => t.img && /\.webp$/.test(t.img)), '7종 모두 WebP 파일명');
  ok(W.THRONES.every((t) => !('price' in t) && !('cost' in t) && !('buy' in t)), '구매·가격 필드 없음(비환금성)');
  const wins = W.THRONES.map((t) => t.wins);
  ok(wins.every((v, i) => i === 0 || v > wins[i - 1]), '누적 승리 조건이 등급마다 엄격히 증가', wins);
  const rates = W.THRONES.map((t) => t.rate);
  ok(rates.every((v, i) => i === 0 || v >= rates[i - 1]), '승률 조건이 내려가지 않는다', rates);
  eq(W.THRONE_HUMAN_FROM, 3, '3등급부터 사람 대전만 집계');
  eq(W.THRONE_RECENT, 100, '승률 모수 = 최근 100판');
  eq(W.THRONE_COMEBACK_MULT, 3, '역전승 = 앤티 3배 이하 위기');
  ok(W.THRONES.slice(2).every((t) => t.human === true), '3~7등급은 사람(온라인) 기록 기준');
  ok(W.THRONES.slice(0, 2).every((t) => t.human === false), '1~2등급은 연습전 포함');

  /* 이미지 실물 — 저장소에 WebP 7종이 있고 과하게 무겁지 않다 */
  const dir = path.join(__dirname, '..', 'public', 'thrones');
  W.THRONES.forEach((t) => {
    const f = path.join(dir, t.img);
    const exists = fs.existsSync(f);
    ok(exists, '이미지 존재 ' + t.img);
    if (!exists) return;
    const b = fs.readFileSync(f);
    ok(b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP', 'WebP 포맷 ' + t.img);
    ok(b.length < 120 * 1024, '경량(<120KB) ' + t.img + ' — ' + Math.round(b.length / 1024) + 'KB');
  });
}

console.log('\n[20] 왕좌 — 저장·집계·승격 판정');
{
  /* 빈 기록 */
  const blank = W.throneBlank();
  eq(blank.plays, 0, '빈 기록 plays=0');
  eq(gradeOf(), 0, '첫 방문(기록 없음) = 왕좌 없음(0)');
  eq(W.throneApply(blank, { play: false }).plays, 0, '패스한 판은 승부로 세지 않는다');

  /* 저장 왕복 */
  const s1 = fakeStore();
  W.throneSave(s1, { plays: 12, wins: 7, streakBest: 4 });
  const back = W.throneLoad(s1);
  eq(back.plays, 12, '저장 후 plays 유지');
  eq(back.wins, 7, '저장 후 wins 유지');
  eq(back.streakBest, 4, '저장 후 streakBest 유지');
  eq(W.throneLoad(fakeStore('{깨진 JSON')).plays, 0, '깨진 저장값은 빈 기록으로');
  eq(W.throneLoad(fakeStore({ plays: -5, wins: 'x' })).plays, 0, '음수·문자열은 0으로 정규화');
  eq(W.throneLoad(null).plays, 0, '저장소 없음(null) 안전');
  eq(W.throneLoad({ getItem() { throw new Error('blocked'); } }).plays, 0, 'localStorage 차단 환경 안전');

  /* 1등급 — 첫 10판 승부 */
  eq(gradeOf({ plays: 9 }), 0, '9판 = 아직 1등급 아님');
  eq(gradeOf({ plays: 10 }), 1, '10판 승부 = 1등급 풋내기');
  eq(gradeOf({ plays: 10, wins: 0 }), 1, '10판 전패여도 1등급(첫 10판 완료)');

  /* 2등급 — 30승 · 승률 40% · 3연승 */
  const g2 = { plays: 90, wins: 40, streakBest: 3, recent: recentMix(45, 100) };
  eq(gradeOf(g2), 2, '30승+ · 승률 45% · 3연승 = 2등급 꾼');
  eq(gradeOf(Object.assign({}, g2, { streakBest: 2 })), 1, '3연승 없으면 2등급 미달');
  eq(gradeOf(Object.assign({}, g2, { recent: recentMix(35, 100) })), 1, '승률 35% 면 2등급 미달');
  eq(gradeOf(Object.assign({}, g2, { wins: 29, streakBest: 3 })), 1, '29승이면 2등급 미달');

  /* AI·솔로 연습전은 2등급까지만 — 사람 기록 0이면 3등급 불가 */
  const farmed = { plays: 4000, wins: 3500, streakBest: 40, adoN: 300, adoW: 250, comeback: 50, recent: recentMix(90, 100) };
  eq(gradeOf(farmed), 2, '연습전 3,500승을 쌓아도 2등급에서 멈춘다');

  /* 3등급 — 사람 대전 100승 · 48% · 5연승 · 아도 3 */
  const g3 = { plays: 4000, wins: 3500, streakBest: 3, recent: recentMix(90, 100), hPlays: 140, hWins: 100, hStreakBest: 5, hAdoN: 5, hAdoW: 3, hrecent: recentMix(48, 100) };
  eq(gradeOf(g3), 3, '사람 100승+ · 48% · 5연승 · 아도 3 = 3등급 승부사');
  eq(gradeOf(Object.assign({}, g3, { hWins: 99 })), 2, '사람 99승이면 3등급 미달');
  eq(gradeOf(Object.assign({}, g3, { hAdoW: 2 })), 2, '아도 성공 2회면 3등급 미달');
  eq(gradeOf(Object.assign({}, g3, { hStreakBest: 4 })), 2, '4연승이면 3등급 미달');
  eq(gradeOf(Object.assign({}, g3, { hrecent: recentMix(47, 100) })), 2, '사람 승률 47% 면 3등급 미달');

  /* 4등급 — 역전승 5회 추가 */
  const g4 = Object.assign({}, g3, { hWins: 300, hPlays: 400, hStreakBest: 7, hAdoW: 10, hAdoN: 14, hrecent: recentMix(53, 100), hComeback: 5 });
  eq(gradeOf(g4), 4, '300승·53%·7연승·아도 10·역전승 5 = 4등급 고수');
  eq(gradeOf(Object.assign({}, g4, { hComeback: 4 })), 3, '역전승 4회면 4등급 미달');

  /* 5·6·7등급 */
  const g5 = Object.assign({}, g4, { hWins: 700, hPlays: 900, hStreakBest: 10, hAdoW: 25, hAdoN: 45, hrecent: recentMix(57, 100) });
  eq(gradeOf(g5), 5, '700승·57%·10연승·아도 25·성공률 55% = 5등급 타짜');
  eq(gradeOf(Object.assign({}, g5, { hAdoN: 60, hAdoW: 25 })), 4, '아도 성공률 41% 면 5등급 미달');
  const g6 = Object.assign({}, g5, { hWins: 1500, hPlays: 1800, hStreakBest: 15, hAdoW: 60, hAdoN: 100, hrecent: recentMix(60, 100) });
  eq(gradeOf(g6), 6, '1,500승·60%·15연승·아도 60·성공률 60% = 6등급 전설');
  const g7 = Object.assign({}, g6, { hWins: 3000, hPlays: 3500, hStreakBest: 20, hAdoW: 100, hAdoN: 160, hrecent: recentMix(63, 100) });
  eq(gradeOf(g7), 7, '3,000승·63%·20연승·아도 100·성공률 62% = 7등급 신');
  eq(gradeOf(Object.assign({}, g7, { hrecent: recentMix(62, 100) })), 6, '사람 승률 62% 면 7등급 미달');

  /* 승률 모수 — 최근 100판만 */
  const longWin = Object.assign({}, g2, { recent: Array(300).fill(1).concat(recentMix(0, 100)) });
  eq(W.throneRate(W.throneLoad(fakeStore(longWin)), false), 0, '옛 300연승은 승률 모수(최근 100판)에서 빠진다');
  ok(W.throneLoad(fakeStore(longWin)).recent.length === 100, '최근 기록은 100판까지만 보관');
  eq(W.throneRate(W.throneLoad(fakeStore({ hrecent: recentMix(48, 100), recent: recentMix(90, 100) })), true), 48, 'human=true 면 사람 기록만');
  eq(W.throneRate(W.throneLoad(fakeStore({ hrecent: recentMix(48, 100), recent: recentMix(90, 100) })), false), 90, 'human=false 면 전체 기록');

  /* 집계 — 연승·아도·역전승 */
  let st = play(winN(2).concat([{ win: false }]).concat(winN(1)));
  eq(st.plays, 4, '승부 4판 누적');
  eq(st.wins, 3, '승리 3판');
  eq(st.streak, 1, '패배 뒤 연승은 1부터');
  eq(st.streakBest, 2, '최고 연승은 2로 보존');
  st = play([{ win: true, ado: true, comeback: true }, { win: false, ado: true }, { win: true, ado: true, comeback: true }]);
  eq(st.adoN, 3, '아도 시도 3회');
  eq(st.adoW, 2, '아도 성공 2회');
  eq(st.comeback, 2, '역전승 2회');
  st = play([{ win: true, human: true }, { win: true, human: false }]);
  eq(st.wins, 2, '전체 승리 2');
  eq(st.hWins, 1, '사람 대전 승리 1');
  eq(st.hPlays, 1, '사람 대전 승부 1');

  /* 최고 왕좌는 영구 보존 — 현재 등급만 내려간다 */
  const store2 = fakeStore(Object.assign({}, g2, { crownBest: 2 }));
  eq(W.throneGrade(W.throneLoad(store2)), 2, '2등급 상태에서 시작');
  let r = W.throneRecord(store2, { play: true, win: true });
  eq(r.grade, 2, '승리해도 2등급 유지');
  eq(r.up, false, '같은 등급이면 승격 아님');
  const drop = W.throneApply(W.throneSave(store2, Object.assign({}, W.throneLoad(store2), { recent: recentMix(10, 100) })), { play: true, win: false });
  eq(W.throneGrade(drop), 1, '승률이 40% 아래로 떨어지면 현재 등급은 1등급');
  eq(drop.crownBest, 2, '그래도 최고 왕좌 2등급은 보존');
  r = W.throneRecord(fakeStore({ plays: 10, crownBest: 0 }), { play: true, win: true });
  eq(r.up, true, '9→10판으로 1등급 달성 시 승격 신호');
  eq(r.upGrade, 1, '승격 등급 = 1');
  eq(r.beforeBest, 0, '승격 전 최고 = 0');
  eq(W.throneRecord(fakeStore({ plays: 10, crownBest: 1 }), { play: true, win: true }).up, false, '이미 보유한 왕좌는 다시 승격 알림 없음');

  /* 판돈·베팅액은 등급에 영향 없음 — 이벤트에 실린 금액 필드는 집계에서 무시된다 */
  const bigBet = play([{ win: true, bet: 500000, chips: 1000000}], { plays: 30, wins: 30, streakBest: 3 });
  const smallBet = play([{ win: true, bet: 1000, chips: 2000 }], { plays: 30, wins: 30, streakBest: 3 });
  eq(JSON.stringify(bigBet), JSON.stringify(smallBet), '판돈 규모와 무관하게 같은 집계');

  /* 판 결과 → 집계 이벤트 */
  const g = W.newGame({ mode: 'ai', ante: 1000, count: 2, chips: 5000 });
  g.players[0].chips = 6000;
  let ev = W.throneFromResult(g, 0, { type: 'win', delta: 1000, bet: 1000, ado: false }, 'ai');
  ok(ev.play && ev.win, '승리 판 = play+win');
  eq(ev.human, false, 'AI전은 사람 대전 아님');
  ev = W.throneFromResult(g, 0, { type: 'win', delta: 1000, bet: 1000, ado: false }, 'online');
  eq(ev.human, true, '온라인전은 사람 대전');
  g.players[0].chips = 3200;   /* 정산 뒤 3,200 = 판 직전 2,200 (앤티 1,000 × 3 이하) */
  eq(W.throneFromResult(g, 0, { type: 'win', delta: 1000, ado: false }, 'ai').comeback, true, '앤티 3배 이하에서 이기면 역전승');
  g.players[0].chips = 9000;
  eq(W.throneFromResult(g, 0, { type: 'win', delta: 1000, ado: false }, 'ai').comeback, false, '여유 있을 때 이긴 판은 역전승 아님');
  eq(W.throneFromResult(g, 0, { type: 'lose', delta: -1000, bet: 1000, ado: false }, 'ai').win, false, '패배 판');
  eq(W.throneFromResult(g, 0, { type: 'pairWin', delta: 500, bet: 500, ado: true }, 'ai').ado, true, '아도 판 승리 기록');
  eq(W.throneFromResult(g, 0, { type: 'fold', delta: 0, kind: 'fold' }, 'ai').play, false, '패스는 승부로 세지 않음');
  eq(W.throneFromResult(g, 0, { type: 'win', delta: 100 }, 'pass').human, false, '오프라인 친구방은 사람 기록 아님');
  eq(W.throneFromResult(null, 0, { type: 'win' }, 'ai'), null, '상태 없으면 null');
}

console.log('\n[21] 왕좌 — 화면 배선 · 다국어');
{
  ok(/id="throneBtn"/.test(src), '헤더에 왕좌 배지 버튼(#throneBtn)');
  ok(/id="thrBadgeN"/.test(src), '배지에 등급 숫자(#thrBadgeN)');
  ok(/id="setupThr"/.test(src), '로비(설정 화면) 왕좌 배지(#setupThr)');
  ok(/id="throneSheet"/.test(src) && /id="thrList"/.test(src), '7 왕좌 도감 시트(#throneSheet·#thrList)');
  ok(/id="thrUp"/.test(src), '승격 배너(#thrUp)');
  ok(/\.thrcard\.lock/.test(src), '미달성 카드는 잠금(실루엣) 스타일');
  ok(/\.thrcard\.god/.test(src), '7등급 신 왕좌는 황금빛 강조');
  ok(/\.thrup\.on/.test(src), '승격 배너 표시 스타일');
  ok(/throneBtn'\).onclick = openThrone/.test(src) || /\$\('#throneBtn'\)/.test(src), '배지 버튼이 도감을 연다');
  ok(/W\.throneCheck\(c\.st, row\.g\)/.test(src), '도감이 내 달성 현황(throneCheck)을 그린다');
  ok(/refreshCoupons\(\);\n    paintThrone\(\);/.test(src), '언어·설정 변경 시 배지도 다시 그린다');
  ok(/noteThrone\(res, 0, ui\.mode\)/.test(src), '솔로·AI 판 결과가 왕좌에 기록된다');
  ok(/noteThrone\(res, res\.turn, 'online'\)/.test(src), '온라인 판 결과가 사람 대전으로 기록된다');
  ok(/mode === 'pass'\) return null/.test(src), '오프라인 패스앤플레이는 기록 제외');
  ok(/\/thrones\/' \+/.test(src) && !/https?:\/\/[^"']*throne/.test(src), '왕좌 이미지는 저장소 정적 경로(/thrones/)만');

  /* 다국어 — KR/EN 모두 7등급 이름·왕좌 설명·조건 라벨 */
  const dict = (name) => {
    const m = src.match(new RegExp('\\n    ' + name + ': \\{([\\s\\S]*?)\\n    \\}'));
    return m ? m[1] : '';
  };
  const kr = dict('kr'), en = dict('en');
  ok(!!kr && !!en, 'kr·en 사전을 찾는다');
  ['crownTitle', 'crownNote', 'crownRule', 'crownComeback', 'crownRank', 'crownUp', 'crownBest', 'crownNone',
    'cWins', 'cPlays', 'cRate', 'cStreak', 'cAdo', 'cAdoRate', 'cComeback'].forEach((k) => {
    ok(new RegExp('\\b' + k + ': ').test(kr) && new RegExp('\\b' + k + ': ').test(en), '조건·고지 문구 다국어: ' + k);
  });
  for (let i = 1; i <= 7; i++) {
    ok(new RegExp('\\bthr' + i + ": '").test(kr) && new RegExp('\\bthr' + i + ": '").test(en), i + '등급 이름 다국어');
    ok(new RegExp('\\bth' + i + ": '").test(kr) && new RegExp('\\bth' + i + ": '").test(en), i + '등급 왕좌 설명 다국어');
  }
  ok(!/아도|ADO/.test(en), '영문 사전에 아도·ADO 없음(MAX 사용)');
  ok(/MAX/.test(en), '영문 아도 표기는 MAX');
  ok(/비환금성|바꿀 수 없습니다/.test(kr) || /명예 등급입니다/.test(kr), '한국어 고지에 비환금성 명시');
  ok(/honor rank|cash out/i.test(en), '영문 고지에 비환금성 명시');
}

console.log('\n결과: ' + pass + ' 통과 / ' + fail + ' 실패');
process.exit(fail ? 1 : 0);
