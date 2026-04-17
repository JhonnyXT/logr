# AGENTS.md — app/ (Rutas y páginas)

Directorio de rutas del App Router de Next.js 16. Usa route groups `(auth)`, `(dashboard)`, `(marketing)`.

## Estructura de route groups

- `(auth)/` — login y registro. Sin protección de middleware (público).
- `(dashboard)/` — todas las páginas protegidas. El layout (`layout.tsx`) es un **server component** que:
  1. Verifica auth con `createClient()` de `@/lib/supabase/server`
  2. Redirige a `/login` si no hay sesión
  3. Carga perfil del usuario (nivel, XP, rango)
  4. Renderiza `DashboardShell` con sidebar + XP bar
- `(marketing)/` — landing page y precios. Público. Layout propio con nav y footer de marketing.
- `api/` — solo `webhooks/stripe/route.ts`. Runtime Node.js (no Edge).
- `p/[username]/` — perfil público. Server component que consulta `profiles` con `is_public = true`.

## Crear una nueva página de dashboard

1. Crear carpeta en `app/(dashboard)/[nombre-modulo]/`
2. Crear `page.tsx` — puede ser client o server component
3. Si es client: `"use client"` + `useLocale()` + `PageHeader` con `t.*`
4. Si es server: `import { getT }` + `const t = await getT()`
5. Agregar entrada en `components/shared/Sidebar.tsx` → array `NAV_MAIN`
6. Si tiene gate de nivel: agregar `minLevel: N` en el nav item
7. Agregar traducciones en `messages/es.ts` y `messages/en.ts`

## Patrón de página tipo (client component)

Referencia: `app/(dashboard)/habits/page.tsx`
```tsx
"use client";
import { PageHeader } from "@/components/shared/PageHeader";
import { useLocale } from "@/contexts/locale-context";

export default function NombrePage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader title={t.modulo.pageTitle} description={t.modulo.pageDesc} />
      {/* contenido */}
    </div>
  );
}
```

## Gotchas

- Las rutas del dashboard NO tienen prefijo `/dashboard/` excepto `/dashboard` (home). Hábitos es `/habits`, no `/dashboard/habits`.
- El middleware redirige a `/login` cualquier ruta que no sea `/`, `/login`, `/register`, `/p/*`, `/api/*`, `/pricing`.
- `layout.tsx` del dashboard pasa `profile` y `stats` a `DashboardShell` — no hay context de usuario global, se propaga por props.
