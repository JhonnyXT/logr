-- ============================================================
-- 004: Functions & Triggers
-- ============================================================

-- ────────────────── RECALCULATE LEVEL ON XP INSERT ──────────────────
create or replace function public.recalculate_level()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  new_xp integer;
  new_level integer;
  new_rank text;
begin
  select total_xp + NEW.amount into new_xp
    from public.profiles where id = NEW.user_id;

  new_level := greatest(1, floor(power(new_xp::float / 100, 1.0 / 1.8))::integer);
  new_level := least(new_level, 100);

  new_rank := case
    when new_level >= 99 then 'Apex'
    when new_level >= 95 then 'Immortal'
    when new_level >= 90 then 'Ascendant'
    when new_level >= 83 then 'Paragon'
    when new_level >= 74 then 'Transcendent'
    when new_level >= 64 then 'Mythic'
    when new_level >= 54 then 'Legend'
    when new_level >= 42 then 'Eternal'
    when new_level >= 36 then 'Achiever'
    when new_level >= 24 then 'Rising Star'
    when new_level >= 12 then 'Devoted'
    else 'Newcomer'
  end;

  update public.profiles set
    total_xp = new_xp,
    current_level = new_level,
    current_rank = new_rank,
    updated_at = now()
  where id = NEW.user_id;

  return NEW;
end;
$$;

create trigger on_xp_transaction
  after insert on public.xp_transactions
  for each row execute function public.recalculate_level();

-- ────────────────── UPSERT ACTIVITY LOG ──────────────────
create or replace function public.upsert_activity_log()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.activity_logs (user_id, date, xp_earned, actions_count)
  values (NEW.user_id, current_date, NEW.amount, 1)
  on conflict (user_id, date)
  do update set
    xp_earned = public.activity_logs.xp_earned + NEW.amount,
    actions_count = public.activity_logs.actions_count + 1;
  return NEW;
end;
$$;

create trigger on_xp_update_activity
  after insert on public.xp_transactions
  for each row execute function public.upsert_activity_log();

-- ────────────────── UPDATE TIMESTAMP HELPER ──────────────────
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

create trigger notes_updated_at
  before update on public.notes
  for each row execute function public.update_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();
