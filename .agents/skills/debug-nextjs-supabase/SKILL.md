---
name: debug-nextjs-supabase
description: |
  Debugging sistemático para la app Logr (Next.js 16 + Supabase + Tailwind CSS v4).
  Checklist de verificación por capas: BD, auth, server, client, UI.
  Usar cuando algo no funciona, hay errores, datos no aparecen, o el usuario reporta
  bugs como "no se guardan los datos", "la página está en blanco", "sale un error".
license: MIT
metadata:
  project: logr
  stack: nextjs-supabase
---

## When to Use
- Algo no funciona, datos no se guardan, página en blanco
- Error de Supabase, error de auth, error de TypeScript
- El usuario reporta un bug o comportamiento inesperado
- La barra de XP muestra valores incorrectos

## Gotchas
- RLS en Supabase: si una query retorna `[]` y no hay error, probablemente falta `user_id` en el filtro o la policy está mal
- El trigger `recalculate_level` actualiza `profiles` automáticamente — si el nivel no sube, verificar que se está insertando en `xp_transactions`
- `xpForLevel(1) = 0` — si aparecen XP negativos, alguien sobrescribió esa función
- Edge Functions de Supabase usan Deno — errores de import son diferentes a Node
- `cookies()` en server components es async en Next.js 16

## Instructions

### Capa 1 — Base de datos (Supabase)

1. Verificar conexión:
```bash
# Abrir el SQL Editor de Supabase → ejecutar:
SELECT count(*) FROM profiles;
```

2. Verificar RLS:
```bash
# Con el service role key (ignora RLS):
SELECT * FROM habits WHERE user_id = 'uuid-del-usuario';
# Si retorna datos pero la app no los muestra → problema de RLS o auth
```

3. Verificar triggers:
```bash
# Insertar XP manualmente y verificar que recalculate_level funciona:
INSERT INTO xp_transactions (user_id, amount, source) VALUES ('uuid', 10, 'habit');
SELECT total_xp, current_level, current_rank FROM profiles WHERE id = 'uuid';
```

### Capa 2 — Autenticación

1. Verificar sesión en el cliente:
```typescript
const supabase = createClient();
const { data: { user }, error } = await supabase.auth.getUser();
console.log({ user, error });
// Si user es null → sesión expirada o cookie perdida
```

2. Verificar middleware:
- Abrir `middleware.ts` y `lib/supabase/middleware.ts`
- El middleware redirige a `/login` si no hay sesión en rutas protegidas
- Rutas públicas: `/`, `/login`, `/register`, `/p/*`, `/api/*`, `/pricing`

### Capa 3 — Server Components

1. Verificar que `createClient()` de `@/lib/supabase/server` se llama con `await`:
```typescript
const supabase = await createClient(); // AWAIT obligatorio
```

2. Verificar que `cookies()` se llama con `await` (Next.js 16):
```typescript
const cookieStore = await cookies(); // AWAIT obligatorio
```

### Capa 4 — Client Components y Hooks

1. Verificar TanStack Query:
```typescript
// En el DevTools del navegador → React Query Devtools
// Revisar si el queryKey tiene datos o está en error
```

2. Verificar que `invalidateQueries` se llama tras mutaciones:
```typescript
onSuccess: () => queryClient.invalidateQueries({ queryKey: ["modulo"] }),
```

### Capa 5 — UI y Estilos

1. Si algo no se ve:
- Verificar que los tokens de color existen en `globals.css`
- Verificar que `cn()` se usa correctamente (no concatenación manual)
- En Tailwind v4, las clases custom properties se definen en `@theme inline`

2. Si el idioma está mal:
- Verificar que el componente usa `useLocale()` y no strings hardcodeados
- Verificar que la clave existe en `messages/es.ts` Y `messages/en.ts`

### Tabla de errores comunes

| Señal | Causa probable | Solución |
|---|---|---|
| Datos vacíos sin error | RLS bloquea la query | Verificar policy con `auth.uid() = user_id` |
| `null` en `getUser()` | Sesión expirada | Verificar middleware y cookies |
| XP no sube | Falta insert en `xp_transactions` | Usar `useXp().awardXp()` |
| Nivel no cambia | Trigger deshabilitado | Verificar `recalculate_level` en Supabase |
| Texto en inglés/español mezclado | Falta traducción en messages/ | Agregar clave faltante |
| Página en blanco | Error de server component | Revisar logs de terminal (`npm run dev`) |
| Build falla | Error de tipos TS | Ejecutar `npx tsc --noEmit` para ver todos los errores |

### Verificación
- `npx tsc --noEmit` compila sin errores
- `npm run dev` sin errores de consola
- La funcionalidad reportada como rota ahora funciona
