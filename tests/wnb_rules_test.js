/* 월남뽕 룰 검증 — 땡 업/다운(1배·동률 패배), 2연속 전원 패스 앤티 재적립, 확률 계산기 미노출 */
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
  const badNg = W.placeNoGapBet(s);
  ok(badNg.ok === false, '땡에서 뽕(사이없음) 베팅도 거부', badNg);
  const noDir = W.placePairBet(s, 100, null);
  ok(noDir.ok === false && noDir.err === 'dir', '방향 없이 땡 베팅 거부', noDir);
}

console.log('\n[2] 땡이 아닌 일반 사이값 — 기존 룰 유지(경계 2배 옵션 꺼짐 = 1배)');
{
  const s = scene({ a: 2, b: 10, next: 5, pot: 1000 });
  const before = s.players[0].chips;
  W.placeBet(s, 100);
  const res = W.reveal(s);
  eq(res.type, 'win', '2–10 사이 5 → win');
  eq(s.players[0].chips - before, 100, '일반 사이값 승리는 여전히 1배');
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

console.log('\n결과: ' + pass + ' 통과 / ' + fail + ' 실패');
process.exit(fail ? 1 : 0);
