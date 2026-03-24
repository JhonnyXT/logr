-- ============================================================
-- 001: Core Schema — Profiles, XP Transactions, Activity Logs
-- ============================================================

create extension if not exists "vector" with schema "extensions";

-- ────────────────── PROFILES ──────────────────
create table public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  username             text unique not null,
  full_name            text,
  avatar_url           text,
  bio                  text,
  is_public            boolean default false,

  total_xp             integer default 0 not null,
  current_level        integer default 1 not null,
  current_rank         text default 'Newcomer' not null,
  longest_streak       integer default 0,
  current_streak       integer default 0,

  stripe_customer_id   text unique,
  subscription_tier    text default 'free' check (subscription_tier in ('free', 'pro')),
  subscription_ends_at timestamptz,

  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create index idx_profiles_username on public.profiles (username);

-- ────────────────── XP TRANSACTIONS ──────────────────
create table public.xp_transactions (
  id         bigserial primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  amount     integer not null,
  source     text not null check (source in (
    'habit', 'task', 'focus', 'journal',
    'weekly_reset', 'badge', 'streak_bonus', 'milestone'
  )),
  source_id  uuid,
  metadata   jsonb,
  created_at timestamptz default now()
);

create index idx_xp_transactions_user on public.xp_transactions (user_id);
create index idx_xp_transactions_created on public.xp_transactions (user_id, created_at desc);

-- ────────────────── ACTIVITY LOGS ──────────────────
create table public.activity_logs (
  id            bigserial primary key,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  date          date not null,
  xp_earned     integer default 0,
  actions_count integer default 0,
  unique(user_id, date)
);

create index idx_activity_logs_user_date on public.activity_logs (user_id, date desc);

-- ────────────────── AUTO-CREATE PROFILE ON SIGNUP ──────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
