-- ============================================================
-- 003: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.activity_logs enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.journal_entries enable row level security;
alter table public.goals enable row level security;
alter table public.goal_milestones enable row level security;
alter table public.vision_board_items enable row level security;
alter table public.notes enable row level security;
alter table public.weekly_resets enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

-- ────────────────── PROFILES ──────────────────
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or is_public = true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ────────────────── XP TRANSACTIONS ──────────────────
create policy "xp_select_own" on public.xp_transactions
  for select using (auth.uid() = user_id);

create policy "xp_insert_own" on public.xp_transactions
  for insert with check (auth.uid() = user_id);

-- ────────────────── ACTIVITY LOGS ──────────────────
create policy "activity_select" on public.activity_logs
  for select using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles where id = user_id and is_public = true)
  );

create policy "activity_upsert_own" on public.activity_logs
  for insert with check (auth.uid() = user_id);

create policy "activity_update_own" on public.activity_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── HABITS ──────────────────
create policy "habits_all_own" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── HABIT COMPLETIONS ──────────────────
create policy "habit_completions_all_own" on public.habit_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── TASKS ──────────────────
create policy "tasks_all_own" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── FOCUS SESSIONS ──────────────────
create policy "focus_all_own" on public.focus_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── JOURNAL ENTRIES ──────────────────
create policy "journal_all_own" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── GOALS ──────────────────
create policy "goals_all_own" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── GOAL MILESTONES ──────────────────
create policy "milestones_all_own" on public.goal_milestones
  for all using (
    exists (select 1 from public.goals where id = goal_id and user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.goals where id = goal_id and user_id = auth.uid())
  );

-- ────────────────── VISION BOARD ──────────────────
create policy "vision_all_own" on public.vision_board_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── NOTES ──────────────────
create policy "notes_all_own" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── WEEKLY RESETS ──────────────────
create policy "weekly_resets_all_own" on public.weekly_resets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ────────────────── BADGES (readable by all authenticated) ──────────────────
create policy "badges_select_all" on public.badges
  for select using (true);

-- ────────────────── USER BADGES ──────────────────
create policy "user_badges_select" on public.user_badges
  for select using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles where id = user_id and is_public = true)
  );

create policy "user_badges_insert_own" on public.user_badges
  for insert with check (auth.uid() = user_id);
