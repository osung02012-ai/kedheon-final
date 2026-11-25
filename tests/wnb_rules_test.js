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

console.log('\n결과: ' + pass + ' 통과 / ' + fail + ' 실패');
process.exit(fail ? 1 : 0);
