-- ============================================================
-- 002: Module Schemas — Habits, Tasks, Focus, Journal, Goals,
--      Vision Board, Notes, Weekly Reset, Badges
-- ============================================================

-- ────────────────── HABITS ──────────────────
create table public.habits (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  title          text not null,
  description    text,
  icon           text default '✅',
  color          text default '#00e96a',
  frequency      text not null check (frequency in ('daily', 'weekdays', 'weekly', 'specific_days')),
  target_days    integer[] default '{}',
  xp_reward      integer default 10,
  github_sync    boolean default false,
  current_streak integer default 0,
  longest_streak integer default 0,
  is_active      boolean default true,
  created_at     timestamptz default now()
);

create index idx_habits_user on public.habits (user_id);

create table public.habit_completions (
  id           bigserial primary key,
  habit_id     uuid not null references public.habits(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  completed_at date not null default current_date,
  is_vacation  boolean default false,
  unique(habit_id, completed_at)
);

create index idx_habit_completions_user on public.habit_completions (user_id, completed_at desc);

-- ────────────────── TASKS ──────────────────
create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text,
  priority     text default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  is_urgent    boolean default false,
  is_important boolean default false,
  is_main_task boolean default false,
  tags         text[] default '{}',
  due_date     date,
  goal_id      uuid,
  xp_reward    integer default 15,
  completed_at timestamptz,
  created_at   timestamptz default now()
);

create index idx_tasks_user on public.tasks (user_id);
create index idx_tasks_incomplete on public.tasks (user_id) where completed_at is null;

-- ────────────────── FOCUS SESSIONS ──────────────────
create table public.focus_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  task_id      uuid references public.tasks(id) on delete set null,
  duration_min integer not null check (duration_min in (15, 25, 45, 60, 90)),
  theme        text default 'minimal' check (theme in ('minimal', 'cozy', 'developer', 'nature')),
  is_completed boolean default false,
  started_at   timestamptz not null,
  ended_at     timestamptz,
  xp_reward    integer default 20
);

create index idx_focus_user on public.focus_sessions (user_id);

-- ────────────────── JOURNAL ENTRIES ──────────────────
create table public.journal_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  entry_date   date not null,
  entry_type   text not null check (entry_type in ('morning', 'evening')),
  mood_score   smallint check (mood_score between 1 and 10),
  content      text,
  prompt_used  text,
  embedding    vector(1536),
  xp_reward    integer default 15,
  created_at   timestamptz default now(),
  unique(user_id, entry_date, entry_type)
);

create index idx_journal_user on public.journal_entries (user_id, entry_date desc);

-- ────────────────── GOALS ──────────────────
create table public.goals (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text,
  category     text check (category in ('career', 'health', 'financial', 'relationships', 'growth')),
  horizon      text check (horizon in ('quarterly', '1year', '3years')),
  progress     integer default 0 check (progress between 0 and 100),
  target_date  date,
  is_completed boolean default false,
  created_at   timestamptz default now()
);

create index idx_goals_user on public.goals (user_id);

create table public.goal_milestones (
  id         uuid primary key default gen_random_uuid(),
  goal_id    uuid not null references public.goals(id) on delete cascade,
  title      text not null,
  is_done    boolean default false,
  due_date   date,
  xp_reward  integer default 30,
  created_at timestamptz default now()
);

alter table public.tasks
  add constraint tasks_goal_id_fkey
  foreign key (goal_id) references public.goals(id) on delete set null;

-- ────────────────── VISION BOARD ──────────────────
create table public.vision_board_items (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in (
    'eulogy', 'bucket_list', 'mission_statement',
    'definition_of_success', 'odyssey_plan', 'future_calendar'
  )),
  title      text,
  content    text,
  image_url  text,
  is_done    boolean default false,
  position   integer default 0,
  created_at timestamptz default now()
);

create index idx_vision_user on public.vision_board_items (user_id);

-- ────────────────── NOTES ──────────────────
create table public.notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  parent_id   uuid references public.notes(id) on delete cascade,
  title       text not null default 'Untitled',
  icon        text default '📄',
  content     jsonb,
  position    integer default 0,
  is_archived boolean default false,
  embedding   vector(1536),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index idx_notes_user on public.notes (user_id);
create index idx_notes_parent on public.notes (parent_id);

-- ────────────────── WEEKLY RESETS ──────────────────
create table public.weekly_resets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  week_start   date not null,
  categories   jsonb not null default '{}',
  xp_awarded   integer default 0,
  completed_at timestamptz default now(),
  unique(user_id, week_start)
);

-- ────────────────── BADGES ──────────────────
create table public.badges (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  icon_url    text,
  category    text check (category in ('habit', 'focus', 'level', 'social', 'special')),
  condition   jsonb
);

create table public.user_badges (
  user_id   uuid references public.profiles(id) on delete cascade,
  badge_id  uuid references public.badges(id) on delete cascade,
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);
