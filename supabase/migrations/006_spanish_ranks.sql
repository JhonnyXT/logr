-- ============================================================
-- 006: Actualizar nombres de rangos a español
-- ============================================================

-- Actualizar el valor por defecto del rango inicial
alter table public.profiles
  alter column current_rank set default 'Novato';

-- Actualizar rangos existentes en perfiles
update public.profiles set current_rank = case current_rank
  when 'Newcomer'     then 'Novato'
  when 'Devoted'      then 'Devoto'
  when 'Rising Star'  then 'Estrella'
  when 'Achiever'     then 'Triunfador'
  when 'Eternal'      then 'Eterno'
  when 'Legend'       then 'Leyenda'
  when 'Mythic'       then 'Mítico'
  when 'Transcendent' then 'Trascendente'
  when 'Paragon'      then 'Paradigma'
  when 'Ascendant'    then 'Ascendente'
  when 'Immortal'     then 'Inmortal'
  else current_rank
end
where current_rank in (
  'Newcomer','Devoted','Rising Star','Achiever','Eternal',
  'Legend','Mythic','Transcendent','Paragon','Ascendant','Immortal'
);

-- Actualizar el trigger recalculate_level con los nuevos nombres
create or replace function public.recalculate_level()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  new_xp   integer;
  new_level integer;
  new_rank  text;
begin
  select total_xp + NEW.amount into new_xp
    from public.profiles where id = NEW.user_id;

  new_level := greatest(1, floor(power(new_xp::float / 100, 1.0 / 1.8))::integer);
  new_level := least(new_level, 100);

  new_rank := case
    when new_level >= 99 then 'Apex'
    when new_level >= 95 then 'Inmortal'
    when new_level >= 90 then 'Ascendente'
    when new_level >= 83 then 'Paradigma'
    when new_level >= 74 then 'Trascendente'
    when new_level >= 64 then 'Mítico'
    when new_level >= 54 then 'Leyenda'
    when new_level >= 42 then 'Eterno'
    when new_level >= 36 then 'Triunfador'
    when new_level >= 24 then 'Estrella'
    when new_level >= 12 then 'Devoto'
    else 'Novato'
  end;

  update public.profiles set
    total_xp      = new_xp,
    current_level = new_level,
    current_rank  = new_rank,
    updated_at    = now()
  where id = NEW.user_id;

  return NEW;
end;
$$;
