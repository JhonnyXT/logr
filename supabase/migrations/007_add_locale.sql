-- ============================================================
-- 007: Agregar columna locale al perfil del usuario
-- ============================================================

alter table public.profiles
  add column if not exists locale text not null default 'es'
  check (locale in ('es', 'en'));
