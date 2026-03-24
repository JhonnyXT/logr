-- ============================================================
-- 005: Extend badge categories (task) and XP source (system)
-- ============================================================

alter table public.badges drop constraint if exists badges_category_check;

alter table public.badges
  add constraint badges_category_check
  check (category in ('habit', 'focus', 'task', 'level', 'social', 'special'));

alter table public.xp_transactions drop constraint if exists xp_transactions_source_check;

alter table public.xp_transactions
  add constraint xp_transactions_source_check
  check (source in (
    'habit', 'task', 'focus', 'journal',
    'weekly_reset', 'badge', 'streak_bonus', 'milestone', 'system'
  ));
