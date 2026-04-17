# /nuevo-modulo

Crea un módulo completo del dashboard: página, componentes, hook, tipos, traducciones y navegación.

## Objective

Generar toda la infraestructura para un nuevo módulo del dashboard de Logr.

## Requirements

Pregunta al usuario:
1. ¿Nombre del módulo? (ej: "challenges", "achievements")
2. ¿Qué entidad gestiona? (ej: "Challenge con título, descripción, fecha límite")
3. ¿Requiere gate de nivel? Si sí, ¿qué nivel?
4. ¿Icono para el sidebar? (de lucide-react)

## Steps

1. Leer la skill `add-dashboard-module` para seguir el patrón completo.
2. Crear tipos en `types/[modulo].ts`.
3. Crear migración SQL en `supabase/migrations/` con tabla + RLS.
4. Crear hook en `hooks/use[Modulo].ts` con TanStack Query.
5. Crear componentes en `components/[modulo]/`:
   - `[Entidad]Card.tsx`
   - `[Entidad]Form.tsx`
   - `[Entidad]List.tsx`
6. Crear página en `app/(dashboard)/[modulo]/page.tsx`.
7. Agregar entrada en el sidebar (`components/shared/Sidebar.tsx`).
8. Agregar traducciones en `messages/es.ts` y `messages/en.ts`.
9. Verificar con `npx tsc --noEmit`.

## Output

- Todos los archivos del módulo creados
- Sidebar actualizado
- Traducciones completas en ES y EN
- Sin errores de TypeScript
