---
name: add-dashboard-module
description: |
  Crea un nuevo módulo completo del dashboard de Logr: página, componentes, hook de datos,
  tipos TypeScript, traducciones i18n y entrada en el sidebar. Sigue los patrones exactos
  del proyecto. Usar cuando el usuario pida agregar un nuevo módulo, sección o funcionalidad
  al dashboard como "agrega un módulo de X", "crea una nueva sección de Y".
license: MIT
metadata:
  project: logr
  stack: nextjs-supabase
---

## When to Use
- El usuario pide agregar un nuevo módulo o sección al dashboard
- Se necesita una nueva página con formularios, listados y lógica de datos
- Se quiere integrar una nueva entidad con el sistema de gamificación (XP)

## Gotchas
- Las rutas del dashboard NO tienen prefijo `/dashboard/` (ej: `/habits`, no `/dashboard/habits`)
- El sidebar se define dentro de `components/shared/Sidebar.tsx` — los nav items se construyen dentro de la función (no fuera) porque dependen de `t` (i18n)
- Si el módulo tiene gate de nivel, agregar `minLevel: N` en el nav item
- SIEMPRE agregar traducciones en `messages/es.ts` Y `messages/en.ts`
- El hook `useXp().awardXp()` necesita recibir el mensaje traducido como cuarto argumento

## Instructions

### Paso 1 — Crear tipos en `types/[modulo].ts`

Basado en `@/types/habits.ts`:
```typescript
export interface NuevoItem {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}
```

### Paso 2 — Crear migración SQL en `supabase/migrations/`

Siguiente número disponible (ej: `008_schema_modulo.sql`):
```sql
create table public.nuevo_modulo (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  created_at timestamptz default now()
);

create index idx_nuevo_modulo_user on public.nuevo_modulo (user_id);

alter table public.nuevo_modulo enable row level security;

create policy "Users can CRUD own data" on public.nuevo_modulo
  for all using (auth.uid() = user_id);
```

### Paso 3 — Crear hook en `hooks/useModulo.ts`

Basado en `@/hooks/useHabits.ts`:
- `useQuery` con queryKey `["modulo"]`
- `useMutation` con `invalidateQueries`
- Función `mapRow()` para snake_case → camelCase

### Paso 4 — Crear componentes en `components/[modulo]/`

Como mínimo: `ModuloList.tsx` + `ModuloCard.tsx` + `ModuloForm.tsx`
- Usar `useLocale()` para textos
- Usar `useXp()` para otorgar XP en acciones

### Paso 5 — Crear página en `app/(dashboard)/[modulo]/page.tsx`

```tsx
"use client";
import { PageHeader } from "@/components/shared/PageHeader";
import { useLocale } from "@/contexts/locale-context";

export default function ModuloPage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title={t.modulo.pageTitle} description={t.modulo.pageDesc} />
    </div>
  );
}
```

### Paso 6 — Agregar al sidebar

En `components/shared/Sidebar.tsx`, dentro de la función `Sidebar`, agregar al array `NAV_MAIN`:
```tsx
{ href: "/modulo", label: t.nav.modulo, icon: IconName, minLevel: N },
```

### Paso 7 — Agregar traducciones

En `messages/es.ts` y `messages/en.ts`, agregar:
- `nav.modulo` — nombre para el sidebar
- `modulo.pageTitle` — título de la página
- `modulo.pageDesc` — descripción
- Todas las cadenas visibles del módulo

### Verificación
1. `npx tsc --noEmit` sin errores
2. `npm run dev` → navegar a la ruta → ver la página
3. El sidebar muestra el módulo (bloqueado si tiene minLevel mayor al nivel actual)
