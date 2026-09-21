-- Ask my CV: rate limiting + question log.
-- Isolated tables prefixed ask_cv_. RLS on with no policies: only the ask-cv Edge Function
-- (service_role) can touch them. "Day" means the UTC calendar day (current_date is UTC on Supabase).

create table if not exists public.ask_cv_rate (
  ip_hash text not null,
  day     date not null default current_date,
  count   int  not null default 0 check (count >= 0),
  primary key (ip_hash, day)
);
create index if not exists ask_cv_rate_day_idx on public.ask_cv_rate (day);

create table if not exists public.ask_cv_log (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  question   text not null,
  answer     text
);
create index if not exists ask_cv_log_created_at_idx on public.ask_cv_log (created_at);

alter table public.ask_cv_rate enable row level security;
alter table public.ask_cv_log  enable row level security;

-- Counts one question. Returns 'ok', 'ip_limit' or 'global_limit'.
-- An advisory lock serialises calls, so both limits are checked and incremented atomically.
-- Denied calls are not counted, so abuse cannot keep the counters pinned.
create or replace function public.ask_cv_hit(p_ip_hash text, p_ip_limit int, p_global_limit int)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  global_count int;
  ip_count int;
begin
  perform pg_advisory_xact_lock(hashtext('public.ask_cv_hit'));

  select coalesce(sum(r.count), 0) into global_count
  from public.ask_cv_rate r where r.day = current_date;
  if global_count >= p_global_limit then
    return 'global_limit';
  end if;

  select r.count into ip_count
  from public.ask_cv_rate r where r.ip_hash = p_ip_hash and r.day = current_date;
  if coalesce(ip_count, 0) >= p_ip_limit then
    return 'ip_limit';
  end if;

  insert into public.ask_cv_rate as r (ip_hash, day, count)
  values (p_ip_hash, current_date, 1)
  on conflict (ip_hash, day) do update set count = r.count + 1;

  return 'ok';
end;
$$;

-- Gives a question back when the upstream model failed, so outages don't burn the budget.
create or replace function public.ask_cv_refund(p_ip_hash text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.ask_cv_rate
  set count = greatest(count - 1, 0)
  where ip_hash = p_ip_hash and day = current_date;
$$;

revoke all on function public.ask_cv_hit(text, int, int) from public, anon, authenticated;
revoke all on function public.ask_cv_refund(text)        from public, anon, authenticated;
revoke all on table public.ask_cv_rate, public.ask_cv_log from public, anon, authenticated;

grant execute on function public.ask_cv_hit(text, int, int) to service_role;
grant execute on function public.ask_cv_refund(text)        to service_role;
grant select, insert, update, delete on public.ask_cv_rate to service_role;
grant insert, delete on public.ask_cv_log to service_role;

-- Retention: delete rate rows after 3 days and log rows after 90 days.
-- Runs on a schedule, so retention never depends on traffic.
create or replace function public.ask_cv_prune()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.ask_cv_rate where day < current_date - 2;
  delete from public.ask_cv_log  where created_at < now() - interval '90 days';
$$;

revoke all on function public.ask_cv_prune() from public, anon, authenticated;

-- Schedule it daily at 03:00 UTC. Requires the pg_cron extension (Supabase: Database > Extensions > pg_cron).
-- Safe to run this migration without pg_cron: the block warns instead of failing, and the
-- traffic-independent guarantee only holds once pg_cron is enabled and this runs.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('ask_cv_prune_daily', '0 3 * * *', 'select public.ask_cv_prune()');
  else
    raise warning 'pg_cron not installed: enable it, then run  select cron.schedule(''ask_cv_prune_daily'', ''0 3 * * *'', ''select public.ask_cv_prune()'');';
  end if;
end $$;
