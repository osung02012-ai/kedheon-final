-- ============================================================================
-- Kedheon.pi Pass (30일) — 통합 이용권 스키마
--   2026-11-23 · 대상: Kedheon · FactFilter · Hangang (같은 kedheon-db, 같은 배포)
--
--   실행 방법 (주군 또는 콘솔 권한자):
--     1) Supabase 대시보드 → kedheon-db(서울) → SQL Editor → 이 파일 전체 붙여넣기 → Run
--     2) 또는 psql "$SUPABASE_DB_URL" -f 2026-11-23_kedheon_pass.sql
--   이 파일은 **한 번만** 실행하면 된다(모두 if not exists / on conflict).
--   앱은 이 테이블이 없으면 패스 UI를 숨기고 기존 기능만 동작한다(안전).
--
--   설계 요점
--     · 전역 키 = username. Pi uid는 앱마다 다른 값이라 (app_id, uid) 링크 표가 3앱을 잇는다.
--     · 회원번호는 시퀀스가 아니라 카운터 행 UPDATE … RETURNING 으로 발급한다(중복·결번 없음).
--     · 30일 부여는 pass_redeem 하나로만. payment_id UNIQUE + 멱등으로 이중 지급 불가.
--     · 모든 접근은 서버(service_role) API 경유. anon·authenticated는 RLS로 전면 차단.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. 회원번호 카운터 (단일 행)
-- ---------------------------------------------------------------------------
create table if not exists public.pass_counter (
  id            int primary key default 1 check (id = 1),
  last_number   bigint not null default 0,
  genesis_limit int    not null default 3141,
  early_limit   int    not null default 31415,
  updated_at    timestamptz not null default now()
);
insert into public.pass_counter (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. 통합 패스 계정 (전역 키 username)
-- ---------------------------------------------------------------------------
create table if not exists public.pass_accounts (
  id              uuid primary key default gen_random_uuid(),
  username        text not null,
  username_key    text not null unique,                 -- lower(username)
  member_number   bigint unique,                        -- 1,2,3 … (원자 발급)
  tier            text generated always as (
                    case when member_number is null    then 'pending'
                         when member_number <= 3141    then 'genesis'
                         when member_number <= 31415   then 'early'
                         else 'standard' end) stored,
  genesis_number  bigint generated always as (
                    case when member_number between 1 and 3141
                         then member_number else null end) stored,
  pass_expires_at timestamptz,
  pass_source     text,           -- 'genesis_claim' | 'one_time_30d' | 'onchain_subscription'
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. 앱별 Pi uid 링크 (앱마다 uid가 다르므로 이 표가 '3앱 공통'을 잇는다)
-- ---------------------------------------------------------------------------
create table if not exists public.pass_app_links (
  app_id        text not null check (app_id in ('kedheon','factfilter','hangang')),
  uid           text not null,
  account_id    uuid not null references public.pass_accounts(id) on delete cascade,
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),
  primary key (app_id, uid)
);
create index if not exists pass_app_links_account_idx on public.pass_app_links(account_id);

-- ---------------------------------------------------------------------------
-- 4. 견적 (서버가 가격을 고정 · 15분 유효) — 클라 금액 위조 차단의 기준점
-- ---------------------------------------------------------------------------
create table if not exists public.pass_quotes (
  id              uuid primary key default gen_random_uuid(),
  account_id      uuid not null references public.pass_accounts(id) on delete cascade,
  app_id          text not null,
  product_id      text not null default 'pass_30d',
  tier            text not null,
  amount_pi       numeric(18,7) not null,
  expires_at      timestamptz not null default (now() + interval '15 minutes'),
  used_payment_id text,
  created_at      timestamptz not null default now()
);
create index if not exists pass_quotes_account_idx on public.pass_quotes(account_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 5. 결제·부여 원장 (한 행 = 한 번의 이용권 부여)
-- ---------------------------------------------------------------------------
create table if not exists public.pass_orders (
  id               uuid primary key default gen_random_uuid(),
  account_id       uuid not null references public.pass_accounts(id) on delete cascade,
  app_id           text not null,
  product_id       text not null default 'pass_30d',
  payment_type     text not null default 'one_time_30d'
                   check (payment_type in ('genesis_claim','one_time_30d','onchain_subscription')),
  amount_pi        numeric(18,7) not null default 0,
  tier_at_purchase text not null,
  days_added       int  not null default 30,
  payment_id       text unique,          -- Pi payment identifier. 무료 부여는 null
  txid             text,
  network          text not null default 'mainnet' check (network in ('mainnet','testnet')),
  status           text not null default 'approved'
                   check (status in ('approved','completed','cancelled','failed','refunded')),
  expires_before   timestamptz,
  expires_after    timestamptz,
  quote_id         uuid references public.pass_quotes(id),
  subscription_id  text,                 -- 향후 PiRC2 온체인 구독 계약 id
  chain_contract   text,
  created_at       timestamptz not null default now(),
  completed_at     timestamptz
);
create index if not exists pass_orders_account_idx on public.pass_orders(account_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 6. FactFilter 우선 검증 요청 큐 (패스 = priority 1)
-- ---------------------------------------------------------------------------
create table if not exists public.fact_requests (
  id          uuid primary key default gen_random_uuid(),
  uid         text not null,             -- FactFilter 앱의 Pi uid
  username    text,
  app_id      text not null default 'factfilter',
  country     text not null default 'GLOBAL',
  query       text not null,
  note        text,
  priority    int  not null default 0,   -- 1 = 패스 우선, 0 = 일반
  status      text not null default 'queued'
              check (status in ('queued','reviewing','done','rejected')),
  created_at  timestamptz not null default now()
);
create index if not exists fact_requests_queue_idx on public.fact_requests(status, priority desc, created_at);
create index if not exists fact_requests_uid_idx on public.fact_requests(uid, created_at desc);

-- ---------------------------------------------------------------------------
-- 7. pass_touch — 로그인 시 계정 확보 + 원자적 회원번호 발급 + Genesis 첫 30일 무료
-- ---------------------------------------------------------------------------
create or replace function public.pass_touch(
  p_app_id text, p_uid text, p_username text, p_network text default 'mainnet'
) returns public.pass_accounts
language plpgsql security definer set search_path = public as $$
declare acc public.pass_accounts; n bigint; g int;
begin
  if coalesce(p_uid,'') = '' or coalesce(p_username,'') = '' then
    raise exception 'pass_touch: uid and username required';
  end if;
  if p_app_id not in ('kedheon','factfilter','hangang') then
    raise exception 'pass_touch: unknown app %', p_app_id;
  end if;

  -- 1) 이 앱에서 이미 본 uid → 같은 계정 (정상 로그인 경로는 읽기만)
  select a.* into acc
    from public.pass_app_links l
    join public.pass_accounts a on a.id = l.account_id
   where l.app_id = p_app_id and l.uid = p_uid;
  if found then
    if acc.username_key <> lower(p_username) then            -- Pi 아이디 변경 대응
      update public.pass_accounts
         set username = p_username, username_key = lower(p_username), updated_at = now()
       where id = acc.id returning * into acc;
    end if;
    update public.pass_app_links set last_seen_at = now()
     where app_id = p_app_id and uid = p_uid;
    return acc;
  end if;

  -- 2) 전역 키(username)로 찾기/만들기 — 동시 요청은 ON CONFLICT가 직렬화
  insert into public.pass_accounts (username, username_key)
  values (p_username, lower(p_username))
  on conflict (username_key) do update set updated_at = now()
  returning * into acc;

  -- 3) 번호 미발급이면 원자 발급 (카운터 행 잠금 → 중복·결번 없음)
  if acc.member_number is null then
    update public.pass_counter
       set last_number = last_number + 1, updated_at = now()
     where id = 1 returning last_number into n;

    update public.pass_accounts
       set member_number = n, updated_at = now()
     where id = acc.id returning * into acc;

    select genesis_limit into g from public.pass_counter where id = 1;

    if n <= g then   -- Tier 1 Genesis: 첫 30일 무료 + 원장 기록
      update public.pass_accounts
         set pass_expires_at = now() + interval '30 days',
             pass_source = 'genesis_claim', updated_at = now()
       where id = acc.id returning * into acc;
      insert into public.pass_orders
        (account_id, app_id, product_id, payment_type, amount_pi, tier_at_purchase,
         days_added, network, status, expires_before, expires_after, completed_at)
      values
        (acc.id, p_app_id, 'pass_30d', 'genesis_claim', 0, 'genesis',
         30, p_network, 'completed', null, acc.pass_expires_at, now());
    end if;
  end if;

  -- 4) 앱별 uid 연결
  insert into public.pass_app_links (app_id, uid, account_id)
  values (p_app_id, p_uid, acc.id)
  on conflict (app_id, uid) do update set last_seen_at = now();

  return acc;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. pass_redeem — 결제 완료 → +30일 부여 (멱등)
-- ---------------------------------------------------------------------------
create or replace function public.pass_redeem(
  p_account_id uuid, p_app_id text, p_payment_id text, p_txid text,
  p_amount numeric, p_network text default 'mainnet', p_quote_id uuid default null
) returns public.pass_accounts
language plpgsql security definer set search_path = public as $$
declare acc public.pass_accounts; before timestamptz; after timestamptz;
begin
  select * into acc from public.pass_accounts where id = p_account_id for update;
  if not found then raise exception 'pass_redeem: account not found'; end if;

  if exists (select 1 from public.pass_orders
              where payment_id = p_payment_id and status = 'completed') then
    return acc;                       -- 같은 결제 재호출: 만료일 변화 없음
  end if;

  before := acc.pass_expires_at;
  after  := greatest(coalesce(before, now()), now()) + interval '30 days';

  update public.pass_accounts
     set pass_expires_at = after, pass_source = 'one_time_30d', updated_at = now()
   where id = acc.id returning * into acc;

  update public.pass_orders
     set status='completed', txid=p_txid, amount_pi=p_amount,
         expires_before=before, expires_after=after, completed_at=now()
   where payment_id = p_payment_id;

  if not found then
    insert into public.pass_orders
      (account_id, app_id, product_id, payment_type, amount_pi, tier_at_purchase,
       days_added, payment_id, txid, network, status,
       expires_before, expires_after, quote_id, completed_at)
    values
      (acc.id, p_app_id, 'pass_30d', 'one_time_30d', p_amount, acc.tier,
       30, p_payment_id, p_txid, p_network, 'completed',
       before, after, p_quote_id, now());
  end if;

  if p_quote_id is not null then
    update public.pass_quotes set used_payment_id = p_payment_id
     where id = p_quote_id and used_payment_id is null;
  end if;

  return acc;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. RLS · 권한 — anon·authenticated 직접 접근 금지. 모든 읽기·쓰기는 서버 API(service key).
-- ---------------------------------------------------------------------------
alter table public.pass_counter   enable row level security;
alter table public.pass_accounts  enable row level security;
alter table public.pass_app_links enable row level security;
alter table public.pass_quotes    enable row level security;
alter table public.pass_orders    enable row level security;
alter table public.fact_requests  enable row level security;

revoke all on table public.pass_counter   from anon, authenticated;
revoke all on table public.pass_accounts  from anon, authenticated;
revoke all on table public.pass_app_links from anon, authenticated;
revoke all on table public.pass_quotes    from anon, authenticated;
revoke all on table public.pass_orders    from anon, authenticated;
revoke all on table public.fact_requests  from anon, authenticated;

revoke all on function public.pass_touch(text,text,text,text) from anon, authenticated;
revoke all on function public.pass_redeem(uuid,text,text,text,numeric,text,uuid) from anon, authenticated;
grant execute on function public.pass_touch(text,text,text,text) to service_role;
grant execute on function public.pass_redeem(uuid,text,text,text,numeric,text,uuid) to service_role;

-- ---------------------------------------------------------------------------
-- 10. 기존 가입자 백필 (1회) — pi_users → pass_accounts, 가입 순으로 1번부터
--     · 이미 회원번호가 있는 계정은 건드리지 않는다(재실행 안전).
--     · Genesis(1~3,141번)에게 창립 무료 30일을 함께 부여한다(설계 D4).
-- ---------------------------------------------------------------------------
insert into public.pass_accounts (username, username_key, created_at)
select u.username, lower(u.username), coalesce(u.first_seen_at, now())
  from public.pi_users u
 where coalesce(u.username,'') <> ''
 order by coalesce(u.first_seen_at, now())
on conflict (username_key) do nothing;

do $$
declare r record; n bigint;
begin
  for r in
    select id from public.pass_accounts
     where member_number is null
     order by created_at, id
  loop
    update public.pass_counter
       set last_number = last_number + 1, updated_at = now()
     where id = 1 returning last_number into n;
    update public.pass_accounts
       set member_number = n, updated_at = now()
     where id = r.id;
  end loop;
end $$;

update public.pass_accounts
   set pass_expires_at = now() + interval '30 days',
       pass_source = 'genesis_claim',
       updated_at = now()
 where member_number <= 3141
   and pass_expires_at is null;

insert into public.pass_orders
  (account_id, app_id, product_id, payment_type, amount_pi, tier_at_purchase,
   days_added, network, status, expires_before, expires_after, completed_at)
select a.id, 'kedheon', 'pass_30d', 'genesis_claim', 0, 'genesis',
       30, 'mainnet', 'completed', null, a.pass_expires_at, now()
  from public.pass_accounts a
 where a.pass_source = 'genesis_claim'
   and not exists (select 1 from public.pass_orders o
                    where o.account_id = a.id and o.payment_type = 'genesis_claim');

-- ---------------------------------------------------------------------------
-- 11. 검증 쿼리 (실행 후 눈으로 확인)
-- ---------------------------------------------------------------------------
-- select * from public.pass_counter;
-- select count(*), min(member_number), max(member_number) from public.pass_accounts;
-- select tier, count(*) from public.pass_accounts group by tier order by tier;
-- select * from public.pass_accounts order by member_number limit 5;
