-- ============================================================================
-- 월남뽕 · 명예의 전당 / 왕좌 좌석(등급별 선착순 고유 번호) — XAEA12
--   2026-11-27 · 대상: kedheon-db (서울) — xaea12.kedheon.com/wolnambbong.html
--   상태: **이미 운영 DB에 적용 완료**(2026-11-27, Vercel → Storage → kedheon-db → Query).
--         아래 문장이 적용된 그대로다. 다시 돌려도 안전하다(if not exists / create or replace).
--
--   실행 방법
--     1) Supabase SQL Editor (또는 Vercel → Storage → kedheon-db → Query)
--     2) 이 파일의 `do $do$ begin execute $sql$ ... $sql$; end $do$;` 한 덩어리를 그대로 실행
--        — 편집기가 "한 번에 한 문장"만 받기 때문에 DO 블록으로 묶었다.
--
--   설계 요점
--     · 좌석은 등급별 피라미드 정원(파이 숫자)으로 선착순 발급한다.
--         1등급 31,415 · 2등급 15,707 · 3등급 6,283 · 4등급 3,141
--         5등급 1,570 · 6등급 628 · 7등급('신') 314   (총 59,058석)
--     · 번호는 wnb_seat_counter 한 행을 UPDATE … RETURNING 으로 원자 발급한다
--       (중복·결번 없음, 정원이 차면 더 이상 발급하지 않는다).
--     · 한 기기(device_id)는 등급마다 좌석 1개 — unique(grade, device_id).
--     · 기록(wnb_players)은 내려가지 않는다(greatest) — 클라이언트가 값을 낮춰도 유지.
--     · 초대(개척자)는 초대받은 기기 1개당 1회만 집계된다(primary key).
--     · 모든 접근은 서버(service_role) API 경유. anon·authenticated는 RLS + 권한 회수로 차단.
--     · 환금성 없음: 돈·코인·현금 필드가 없고, 좌석·랭킹은 명예 표시일 뿐이다.
-- ============================================================================

do $do$ begin execute $sql$
create table if not exists public.wnb_seat_counter (grade int primary key, taken int not null default 0, capacity int not null);
insert into public.wnb_seat_counter values (1,0,31415),(2,0,15707),(3,0,6283),(4,0,3141),(5,0,1570),(6,0,628),(7,0,314) on conflict (grade) do nothing;
create table if not exists public.wnb_players (device_id text primary key, nickname text not null default 'Player', best_grade int not null default 0, best_money bigint not null default 0, wins int not null default 0, plays int not null default 0, invites int not null default 0, pi_username text, pi_verified boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create index if not exists wnb_players_rank_idx on public.wnb_players (best_grade desc, best_money desc, wins desc, updated_at asc);
create table if not exists public.wnb_seats (grade int not null, seat_no int not null, device_id text not null, nickname text not null, pi_username text, granted_at timestamptz not null default now(), primary key (grade, seat_no), unique (grade, device_id));
create index if not exists wnb_seats_device_idx on public.wnb_seats (device_id);
create table if not exists public.wnb_invites (invited_device text primary key, inviter_device text not null, created_at timestamptz not null default now());
create index if not exists wnb_invites_inviter_idx on public.wnb_invites (inviter_device);

create or replace function public.wnb_seat_claim(p_device text, p_grade int, p_nickname text, p_pi text default null) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare v_existing int; v_taken int; v_cap int; v_nick text;
begin
 if p_grade is null or p_grade < 1 or p_grade > 7 then return jsonb_build_object('ok', false, 'error', 'bad_grade'); end if;
 if p_device is null or char_length(p_device) < 8 or char_length(p_device) > 64 then return jsonb_build_object('ok', false, 'error', 'bad_device'); end if;
 perform pg_advisory_xact_lock(hashtext('wnb_seat_' || p_device || '_' || p_grade));
 select seat_no into v_existing from wnb_seats where grade = p_grade and device_id = p_device;
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
 insert into wnb_seats (grade, seat_no, device_id, nickname, pi_username) values (p_grade, v_taken, p_device, v_nick, nullif(btrim(coalesce(p_pi, '')), '')) on conflict (grade, device_id) do nothing;
 select seat_no into v_existing from wnb_seats where grade = p_grade and device_id = p_device;
 return jsonb_build_object('ok', true, 'granted', true, 'grade', p_grade, 'seat', v_existing, 'taken', v_taken, 'capacity', v_cap);
end; $fn$;

create or replace function public.wnb_player_touch(p_device text, p_nickname text, p_grade int, p_money bigint, p_wins int, p_plays int) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare v_row wnb_players; v_nick text;
begin
 if p_device is null or char_length(p_device) < 8 or char_length(p_device) > 64 then return jsonb_build_object('ok', false, 'error', 'bad_device'); end if;
 v_nick := left(coalesce(nullif(btrim(coalesce(p_nickname, '')), ''), 'Player'), 16);
 insert into wnb_players (device_id, nickname, best_grade, best_money, wins, plays) values (p_device, v_nick, greatest(0, least(7, coalesce(p_grade, 0))), greatest(0, coalesce(p_money, 0)), greatest(0, coalesce(p_wins, 0)), greatest(0, coalesce(p_plays, 0)))
 on conflict (device_id) do update set nickname = excluded.nickname, best_grade = greatest(wnb_players.best_grade, excluded.best_grade), best_money = greatest(wnb_players.best_money, excluded.best_money), wins = greatest(wnb_players.wins, excluded.wins), plays = greatest(wnb_players.plays, excluded.plays), updated_at = now()
 returning * into v_row;
 update wnb_seats set nickname = v_row.nickname where device_id = p_device;
 return jsonb_build_object('ok', true, 'nickname', v_row.nickname, 'grade', v_row.best_grade, 'money', v_row.best_money, 'wins', v_row.wins, 'invites', v_row.invites, 'pi', v_row.pi_username, 'piVerified', v_row.pi_verified);
end; $fn$;

create or replace function public.wnb_pi_link(p_device text, p_username text, p_verified boolean default false) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare v_user text;
begin
 if p_device is null or char_length(p_device) < 8 then return jsonb_build_object('ok', false, 'error', 'bad_device'); end if;
 v_user := left(btrim(coalesce(p_username, '')), 32);
 if v_user = '' then return jsonb_build_object('ok', false, 'error', 'bad_username'); end if;
 insert into wnb_players (device_id, pi_username, pi_verified) values (p_device, v_user, coalesce(p_verified, false))
 on conflict (device_id) do update set pi_username = excluded.pi_username, pi_verified = wnb_players.pi_verified or excluded.pi_verified, updated_at = now();
 update wnb_seats set pi_username = v_user where device_id = p_device;
 return jsonb_build_object('ok', true, 'pi', v_user, 'piVerified', (select pi_verified from wnb_players where device_id = p_device));
end; $fn$;

create or replace function public.wnb_invite_credit(p_inviter text, p_invited text) returns jsonb language plpgsql security definer set search_path = public as $fn$
declare v_inserted int := 0; v_count int := 0;
begin
 if p_inviter is null or p_invited is null or p_inviter = p_invited or char_length(p_inviter) < 8 or char_length(p_invited) < 8 then return jsonb_build_object('ok', false, 'error', 'bad_pair'); end if;
 insert into wnb_invites (invited_device, inviter_device) values (p_invited, p_inviter) on conflict (invited_device) do nothing;
 get diagnostics v_inserted = row_count;
 if v_inserted > 0 then
  insert into wnb_players (device_id, invites) values (p_inviter, 1) on conflict (device_id) do update set invites = wnb_players.invites + 1, updated_at = now();
 end if;
 select coalesce(invites, 0) into v_count from wnb_players where device_id = p_inviter;
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
    select jsonb_build_object('nickname', p.nickname, 'grade', p.best_grade, 'money', p.best_money, 'wins', p.wins, 'plays', p.plays, 'invites', p.invites, 'pi', p.pi_username, 'piVerified', p.pi_verified,
      'rank', (select count(*) + 1 from wnb_players p2 where (p2.best_grade, p2.best_money, p2.wins) > (p.best_grade, p.best_money, p.wins)),
      'seats', coalesce((select jsonb_object_agg(grade, seat_no) from wnb_seats where device_id = p.device_id), '{}'::jsonb))
    from wnb_players p where p.device_id = p_device) end
 );
$fn$;

alter table public.wnb_seat_counter enable row level security;
alter table public.wnb_players enable row level security;
alter table public.wnb_seats enable row level security;
alter table public.wnb_invites enable row level security;
revoke all on public.wnb_seat_counter from anon, authenticated;
revoke all on public.wnb_players from anon, authenticated;
revoke all on public.wnb_seats from anon, authenticated;
revoke all on public.wnb_invites from anon, authenticated;
revoke all on function public.wnb_seat_claim(text, int, text, text) from public, anon, authenticated;
revoke all on function public.wnb_player_touch(text, text, int, bigint, int, int) from public, anon, authenticated;
revoke all on function public.wnb_pi_link(text, text, boolean) from public, anon, authenticated;
revoke all on function public.wnb_invite_credit(text, text) from public, anon, authenticated;
revoke all on function public.wnb_board(text, int) from public, anon, authenticated;
$sql$; end $do$;
