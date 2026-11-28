-- ============================================================================
-- 월남뽕 · 기기(브라우저) ↔ 계정 연동/병합 — XAEA12  ·  2026-11-28
--   대상: kedheon-db (서울) — xaea12.kedheon.com/wolnambbong.html
--   실행: Supabase SQL Editor (또는 Vercel → Storage → kedheon-db → Query)에
--         아래 `do $do$ begin execute $sql$ ... $sql$; end $do$;` 한 덩어리를 그대로.
--         편집기가 "한 번에 한 문장"만 받기 때문에 DO 블록으로 묶었다. 다시 돌려도 안전하다.
--
--   문제
--     계정의 주 키가 기기ID(localStorage)라서, 같은 사람이 크롬에서 놀다가
--     Pi Browser 로 옮기면 기록·좌석이 두 계정으로 갈라졌다(2026-11-28 실측:
--     `Player` #001 16승 / `david` π ohsangjo 6승).
--
--   해법
--     1) wnb_aliases — 기기ID → 대표 기기ID. 모든 함수는 입구에서 wnb_resolve_device()로
--        대표 기기를 먼저 찾는다. 그래서 Pi Browser 에서 다시 열어도 같은 계정이 이어진다.
--     2) wnb_merge_devices() — 두 기기 기록을 하나로: 승수·판수·초대 합산, 등급·머니는 최고값,
--        좌석은 대표 기기로 옮기고(같은 등급 중복은 정리하며 정원 카운터도 되돌림), 초대 실적·별칭 재지정.
--        더 잘 나가는 쪽(등급→머니→승수)을 대표로 남긴다.
--     3) wnb_pi_link() — π 실인증(p_verified=true)이면 같은 @의 기존 계정과 병합,
--        (아직 인증 전인 '선언' 계정도 이 기기보다 앞서 있으면 승격해 합친다)
--        미인증 선언이면 이미 π 인증된 @을 빼앗지 못하게 `verified_elsewhere`로 막는다.
--        (p_verified=true 는 서버가 Pi Platform API /v2/me 로 확인한 뒤에만 넘어온다 —
--         /api/wolnambbong/board 라우트가 accessToken을 검증한다.)
--     4) 닉네임 보호 — 기본값 'Player' 로는 이미 정해진 닉네임을 덮어쓰지 않는다
--        (병합 후 크롬 쪽 기본 닉네임이 'david'를 지우던 문제).
--     · 좌석·랭킹은 명예 표시일 뿐 — 환금성 없음(돈·코인·현금 필드 없음).
--     · 모든 접근은 서버(service_role) API 경유. anon·authenticated는 RLS + 권한 회수로 차단.
-- ============================================================================

do $do$ begin execute $sql$
create table if not exists public.wnb_aliases (device_id text primary key, target_device text not null, reason text, created_at timestamptz not null default now());
create index if not exists wnb_aliases_target_idx on public.wnb_aliases (target_device);

create or replace function public.wnb_resolve_device(p_device text) returns text language plpgsql stable security definer set search_path = public as $fn$
declare v text; v_next text; i int := 0;
begin
 if p_device is null then return null; end if;
 v := lower(btrim(p_device));
 loop
  i := i + 1;
  exit when i > 8;
  select a.target_device into v_next from wnb_aliases a where a.device_id = v;
  exit when v_next is null or v_next = v;
  v := v_next;
 end loop;
 return v;
end; $fn$;

create or replace function public.wnb_merge_devices(p_keep text, p_drop text) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare k wnb_players; d wnb_players; v_nick text; v_grade int; v_money bigint; v_wins int; v_plays int; v_invites int;
begin
 if p_keep is null or p_drop is null or p_keep = p_drop then return jsonb_build_object('ok', false, 'error', 'bad_pair'); end if;
 insert into wnb_players (device_id) values (p_keep) on conflict (device_id) do nothing;
 insert into wnb_players (device_id) values (p_drop) on conflict (device_id) do nothing;
 select * into k from wnb_players where device_id = p_keep;
 select * into d from wnb_players where device_id = p_drop;
 if k.device_id is null or d.device_id is null then return jsonb_build_object('ok', false, 'error', 'missing_player'); end if;

 v_nick := case when k.nickname is null or btrim(k.nickname) = '' or k.nickname = 'Player' then coalesce(nullif(btrim(d.nickname), ''), k.nickname) else k.nickname end;
 v_grade := greatest(coalesce(k.best_grade, 0), coalesce(d.best_grade, 0));
 v_money := greatest(coalesce(k.best_money, 0), coalesce(d.best_money, 0));
 v_wins := coalesce(k.wins, 0) + coalesce(d.wins, 0);
 v_plays := coalesce(k.plays, 0) + coalesce(d.plays, 0);
 v_invites := coalesce(k.invites, 0) + coalesce(d.invites, 0);

 update wnb_seat_counter c set taken = greatest(0, c.taken - x.n) from (select s.grade, count(*) as n from wnb_seats s where s.device_id = p_drop and exists (select 1 from wnb_seats q where q.device_id = p_keep and q.grade = s.grade) group by s.grade) x where c.grade = x.grade;
 delete from wnb_seats s where s.device_id = p_drop and exists (select 1 from wnb_seats q where q.device_id = p_keep and q.grade = s.grade);
 update wnb_seats set device_id = p_keep, nickname = v_nick where device_id = p_drop;

 delete from wnb_invites i where i.invited_device = p_drop and exists (select 1 from wnb_invites q where q.invited_device = p_keep);
 update wnb_invites set invited_device = p_keep where invited_device = p_drop;
 update wnb_invites set inviter_device = p_keep where inviter_device = p_drop;
 update wnb_aliases set target_device = p_keep where target_device = p_drop;

 update wnb_players set nickname = v_nick, best_grade = v_grade, best_money = v_money, wins = v_wins, plays = v_plays, invites = v_invites,
   pi_username = coalesce(nullif(btrim(coalesce(d.pi_username, '')), ''), k.pi_username),
   pi_verified = coalesce(k.pi_verified, false) or coalesce(d.pi_verified, false),
   created_at = least(k.created_at, d.created_at), updated_at = now()
  where device_id = p_keep
  returning * into k;

 delete from wnb_players where device_id = p_drop;
 insert into wnb_aliases (device_id, target_device, reason) values (p_drop, p_keep, 'pi_merge') on conflict (device_id) do update set target_device = excluded.target_device, reason = excluded.reason;

 return jsonb_build_object('ok', true, 'merged', true, 'keep', p_keep, 'drop', p_drop, 'nickname', k.nickname, 'grade', k.best_grade, 'money', k.best_money, 'wins', k.wins, 'plays', k.plays, 'invites', k.invites, 'pi', k.pi_username, 'piVerified', k.pi_verified);
end; $fn$;

create or replace function public.wnb_pi_link(p_device text, p_username text, p_verified boolean default false) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare v_dev text; v_user text; v_other text; v_declared text; v_verified boolean := coalesce(p_verified, false); v_keep text; v_drop text; v_merged jsonb; v_row wnb_players;
begin
 if p_device is null or char_length(p_device) < 8 then return jsonb_build_object('ok', false, 'error', 'bad_device'); end if;
 v_dev := coalesce(wnb_resolve_device(p_device), lower(btrim(p_device)));
 v_user := left(btrim(coalesce(p_username, '')), 32);
 if v_user = '' then return jsonb_build_object('ok', false, 'error', 'bad_username'); end if;

 select device_id into v_other from wnb_players
  where lower(btrim(coalesce(pi_username, ''))) = lower(v_user) and pi_verified and device_id <> v_dev
  order by best_grade desc, best_money desc, wins desc, created_at asc limit 1;

 if v_other is not null and not v_verified then
  return jsonb_build_object('ok', false, 'error', 'verified_elsewhere', 'pi', v_user);
 end if;

 if v_verified then
  insert into wnb_players (device_id) values (v_dev) on conflict (device_id) do nothing;
  /* 아직 π 인증된 계정은 없다 — 같은 @을 '선언'만 해 둔 기존 계정이 있으면 그 계정을 승격해 합친다.
     단, 이 기기가 더 앞선 계정이면 남의 선언 기록을 끌어오지 않고 선언만 회수한다(사칭 방지). */
  if v_other is null then
   select device_id into v_declared from wnb_players
    where lower(btrim(coalesce(pi_username, ''))) = lower(v_user) and not pi_verified and device_id <> v_dev
    order by best_grade desc, best_money desc, wins desc, created_at asc limit 1;
   if v_declared is not null then
    if exists (select 1 from wnb_players d1, wnb_players d2 where d1.device_id = v_declared and d2.device_id = v_dev
      and (d1.best_grade, d1.best_money, d1.wins) >= (d2.best_grade, d2.best_money, d2.wins)) then
     v_other := v_declared;
    else
     update wnb_players set pi_username = null, pi_verified = false, updated_at = now() where device_id = v_declared;
     update wnb_seats set pi_username = null where device_id = v_declared;
    end if;
   end if;
  end if;
  select device_id into v_keep from wnb_players
   where device_id in (v_dev, v_other)
   order by best_grade desc, best_money desc, wins desc, created_at asc limit 1;
  if v_keep is null then v_keep := v_dev; end if;
  v_drop := case when v_keep = v_dev then v_other else v_dev end;
  if v_drop is not null and v_drop <> v_keep then
   v_merged := wnb_merge_devices(v_keep, v_drop);
  end if;
  update wnb_players set pi_username = v_user, pi_verified = true, updated_at = now() where device_id = v_keep returning * into v_row;
  update wnb_seats set pi_username = v_user, nickname = v_row.nickname where device_id = v_keep;
  return jsonb_build_object('ok', true, 'pi', v_user, 'piVerified', true, 'merged', coalesce(v_merged->>'merged', 'false') = 'true', 'device', v_keep,
    'nickname', v_row.nickname, 'grade', v_row.best_grade, 'money', v_row.best_money, 'wins', v_row.wins, 'plays', v_row.plays, 'invites', v_row.invites);
 end if;

 insert into wnb_players (device_id, pi_username, pi_verified) values (v_dev, v_user, false)
 on conflict (device_id) do update set pi_username = excluded.pi_username, updated_at = now()
 returning * into v_row;
 update wnb_seats set pi_username = v_user where device_id = v_dev;
 return jsonb_build_object('ok', true, 'pi', v_user, 'piVerified', v_row.pi_verified, 'merged', false, 'device', v_dev,
   'nickname', v_row.nickname, 'grade', v_row.best_grade, 'money', v_row.best_money, 'wins', v_row.wins, 'plays', v_row.plays, 'invites', v_row.invites);
end; $fn$;

create or replace function public.wnb_player_touch(p_device text, p_nickname text, p_grade int, p_money bigint, p_wins int, p_plays int) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare v_row wnb_players; v_nick text; v_dev text;
begin
 if p_device is null or char_length(p_device) < 8 or char_length(p_device) > 64 then return jsonb_build_object('ok', false, 'error', 'bad_device'); end if;
 v_dev := coalesce(wnb_resolve_device(p_device), lower(btrim(p_device)));
 v_nick := left(coalesce(nullif(btrim(coalesce(p_nickname, '')), ''), 'Player'), 16);
 insert into wnb_players (device_id, nickname, best_grade, best_money, wins, plays) values (v_dev, v_nick, greatest(0, least(7, coalesce(p_grade, 0))), greatest(0, coalesce(p_money, 0)), greatest(0, coalesce(p_wins, 0)), greatest(0, coalesce(p_plays, 0)))
 on conflict (device_id) do update set nickname = case when excluded.nickname = 'Player' and wnb_players.nickname <> 'Player' then wnb_players.nickname else excluded.nickname end, best_grade = greatest(wnb_players.best_grade, excluded.best_grade), best_money = greatest(wnb_players.best_money, excluded.best_money), wins = greatest(wnb_players.wins, excluded.wins), plays = greatest(wnb_players.plays, excluded.plays), updated_at = now()
 returning * into v_row;
 update wnb_seats set nickname = v_row.nickname where device_id = v_dev;
 return jsonb_build_object('ok', true, 'nickname', v_row.nickname, 'grade', v_row.best_grade, 'money', v_row.best_money, 'wins', v_row.wins, 'invites', v_row.invites, 'pi', v_row.pi_username, 'piVerified', v_row.pi_verified);
end; $fn$;

create or replace function public.wnb_seat_claim(p_device text, p_grade int, p_nickname text, p_pi text default null) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare v_existing int; v_taken int; v_cap int; v_nick text; v_dev text;
begin
 if p_grade is null or p_grade < 1 or p_grade > 7 then return jsonb_build_object('ok', false, 'error', 'bad_grade'); end if;
 if p_device is null or char_length(p_device) < 8 or char_length(p_device) > 64 then return jsonb_build_object('ok', false, 'error', 'bad_device'); end if;
 v_dev := coalesce(wnb_resolve_device(p_device), lower(btrim(p_device)));
 perform pg_advisory_xact_lock(hashtext('wnb_seat_' || v_dev || '_' || p_grade));
 select seat_no into v_existing from wnb_seats where grade = p_grade and device_id = v_dev;
 if v_existing is not null then
  select taken, capacity into v_taken, v_cap from wnb_seat_counter where grade = p_grade;
  return jsonb_build_object('ok', true, 'granted', false, 'grade', p_grade, 'seat', v_existing, 'taken', coalesce(v_taken, 0), 'capacity', coalesce(v_cap, 0));
 end if;
 update wnb_seat_counter set taken = taken + 1 where grade = p_grade and taken < capacity returning taken, capacity into v_taken, v_cap;
 if v_taken is null then
  select taken, capacity into v_taken, v_cap from wnb_seat_counter where grade = p_grade;
  return jsonb_build_object('ok', true, 'granted', false, 'full', true, 'grade', p_grade, 'seat', null, 'taken', coalesce(v_taken, 0), 'capacity', coalesce(v_cap, 0));
 end if;
 v_nick := left(coalesce(nullif(btrim(coalesce(p_nickname, '')), ''), 'Player'), 16);
 insert into wnb_seats (grade, seat_no, device_id, nickname, pi_username) values (p_grade, v_taken, v_dev, v_nick, nullif(btrim(coalesce(p_pi, '')), '')) on conflict (grade, device_id) do nothing;
 select seat_no into v_existing from wnb_seats where grade = p_grade and device_id = v_dev;
 return jsonb_build_object('ok', true, 'granted', true, 'grade', p_grade, 'seat', v_existing, 'taken', v_taken, 'capacity', v_cap);
end; $fn$;

create or replace function public.wnb_invite_credit(p_inviter text, p_invited text) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare v_inserted int := 0; v_count int := 0; v_a text; v_b text;
begin
 if p_inviter is null or p_invited is null or p_inviter = p_invited or char_length(p_inviter) < 8 or char_length(p_invited) < 8 then return jsonb_build_object('ok', false, 'error', 'bad_pair'); end if;
 v_a := coalesce(wnb_resolve_device(p_inviter), lower(btrim(p_inviter)));
 v_b := coalesce(wnb_resolve_device(p_invited), lower(btrim(p_invited)));
 if v_a = v_b then return jsonb_build_object('ok', false, 'error', 'bad_pair'); end if;
 insert into wnb_invites (invited_device, inviter_device) values (v_b, v_a) on conflict (invited_device) do nothing;
 get diagnostics v_inserted = row_count;
 if v_inserted > 0 then
  insert into wnb_players (device_id, invites) values (v_a, 1) on conflict (device_id) do update set invites = wnb_players.invites + 1, updated_at = now();
 end if;
 select coalesce(invites, 0) into v_count from wnb_players where device_id = v_a;
 return jsonb_build_object('ok', true, 'credited', v_inserted > 0, 'invites', coalesce(v_count, 0));
end; $fn$;

create or replace function public.wnb_board(p_device text default null, p_top int default 10) returns jsonb language sql security definer set search_path = public as $fn$
 select jsonb_build_object(
  'seats', coalesce((select jsonb_agg(jsonb_build_object('grade', grade, 'taken', taken, 'capacity', capacity) order by grade) from wnb_seat_counter), '[]'::jsonb),
  'top', coalesce((select jsonb_agg(row_to_json(t)::jsonb order by t.rank) from (
     select row_number() over (order by best_grade desc, best_money desc, wins desc, updated_at asc) as rank, nickname, best_grade as grade, best_money as money, wins, plays, invites, pi_username as pi, pi_verified as "piVerified"
     from wnb_players order by best_grade desc, best_money desc, wins desc, updated_at asc limit greatest(1, least(50, coalesce(p_top, 10)))
   ) t), '[]'::jsonb),
  'players', (select count(*) from wnb_players),
  'pioneers', (select count(*) from wnb_players where pi_username is not null),
  'me', case when p_device is null or char_length(p_device) < 8 then null else (
    select jsonb_build_object('nickname', p.nickname, 'grade', p.best_grade, 'money', p.best_money, 'wins', p.wins, 'plays', p.plays, 'invites', p.invites, 'pi', p.pi_username, 'piVerified', p.pi_verified, 'device', p.device_id,
      'rank', (select count(*) + 1 from wnb_players p2 where (p2.best_grade, p2.best_money, p2.wins) > (p.best_grade, p.best_money, p.wins)),
      'seats', coalesce((select jsonb_object_agg(grade, seat_no) from wnb_seats where device_id = p.device_id), '{}'::jsonb))
    from wnb_players p where p.device_id = coalesce(wnb_resolve_device(p_device), lower(btrim(p_device)))) end
 );
$fn$;

alter table public.wnb_aliases enable row level security;
revoke all on public.wnb_aliases from anon, authenticated;
revoke all on function public.wnb_resolve_device(text) from public, anon, authenticated;
revoke all on function public.wnb_merge_devices(text, text) from public, anon, authenticated;
revoke all on function public.wnb_pi_link(text, text, boolean) from public, anon, authenticated;
revoke all on function public.wnb_player_touch(text, text, int, bigint, int, int) from public, anon, authenticated;
revoke all on function public.wnb_seat_claim(text, int, text, text) from public, anon, authenticated;
revoke all on function public.wnb_invite_credit(text, text) from public, anon, authenticated;
revoke all on function public.wnb_board(text, int) from public, anon, authenticated;
$sql$; end $do$;
