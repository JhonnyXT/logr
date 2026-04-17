# AGENTS.md — Logr

App de productividad gamificada todo-en-uno. Hábitos, tareas, temporizador Pomodoro, diario, metas, vision board y notas bajo un sistema de XP con 100 niveles, 12 rangos y 75+ insignias. Cuadrícula de actividad estilo GitHub.

---

## Setup y arranque

### Requisitos previos
- Node.js >= 20
- npm
- Cuenta de Supabase con proyecto creado (PostgreSQL + pgvector habilitado)
- Variables de entorno configuradas en `.env.local`

### Instalación
```bash
npm install
```

### Arrancar en desarrollo
```bash
npm run dev
# http://localhost:3000
```

### Build de producción
```bash
npm run build && npm start
```

### Tests
No hay framework de testing configurado. Ver skill `setup-testing`.

### Lint
```bash
npm run lint
# Usa eslint-config-next (core-web-vitals + typescript)
```

---

## Stack técnico

| Capa | Tecnología | Versión |
|---|---|---|
| Lenguaje | TypeScript (strict) | ^5 |
| Framework | Next.js (App Router) | 16.2.1 |
| Bundler | Turbopack (integrado en Next.js) | — |
| Estilos | Tailwind CSS v4 + CSS custom properties | ^4 |
| Componentes UI | Sistema propio (components/ui/) | — |
| Routing | Next.js App Router (route groups) | — |
| Estado cliente | Zustand (stores/) + TanStack Query (hooks/) | 5.x / 5.x |
| HTTP/Fetch | Supabase JS client (@supabase/ssr) | ^0.9 / ^2.99 |
| Base de datos | Supabase PostgreSQL + pgvector | — |
| ORM | Sin ORM — queries directas a Supabase | — |
| Auth | Supabase Auth + middleware SSR | — |
| Pagos | Stripe (subscriptions + webhooks) | ^17 |
| Emails | Resend | ^4 |
| Caché | Upstash Redis | ^1.37 |
| Testing | Sin configurar | — |
| Package manager | npm | — |
| CI/CD | Sin configurar | — |
| i18n | Sistema propio (messages/ + contexts/locale-context) | ES/EN |
| Iconos | Lucide React | ^0.577 |
| Fechas | date-fns v4 | ^4.1 |

**Tipo de proyecto:** Fullstack — framework integrado (Next.js App Router).

---

## Estructura del proyecto

```
logr/
├── app/
│   ├── (auth)/           # Login y registro (Supabase Auth)
│   ├── (dashboard)/      # Dashboard protegido por middleware
│   │   ├── dashboard/    # Inicio
│   │   ├── habits/       # Hábitos (streak, frecuencia)
│   │   ├── tasks/        # Tareas + Eisenhower matrix
│   │   ├── focus/        # Temporizador Pomodoro (15-90 min)
│   │   ├── journal/      # Diario (mañana/noche, mood 1-10)
│   │   ├── goals/        # Metas (gate: nivel 5)
│   │   ├── vision-board/ # Vision Board (gate: nivel 3)
│   │   ├── notes/        # Notas jerárquicas (gate: nivel 7)
│   │   ├── leaderboard/  # Clasificación mensual
│   │   └── settings/     # Ajustes + selector idioma
│   ├── (marketing)/      # Landing page y precios
│   ├── api/webhooks/stripe/ # Webhook de Stripe
│   └── p/[username]/     # Perfiles públicos
├── components/
│   ├── ui/               # Button, Card, Badge, Dialog, Progress
│   ├── shared/           # Sidebar, DashboardShell, XpBar, PageHeader
│   ├── gamification/     # ActivityGrid, Leaderboard, XpBar
│   ├── habits/           # HabitCard, HabitForm, HabitList
│   ├── tasks/            # TaskCard, TaskForm, EisenhowerMatrix
│   ├── focus/            # PomodoroTimer, TimerControls
│   ├── journal/          # JournalEntry, MoodSlider
│   ├── goals/            # GoalCard, GoalForm, MilestoneList
│   ├── vision-board/     # 7 componentes (Eulogy, BucketList, etc.)
│   ├── notes/            # NoteEditor, NotesSidebar
│   ├── weekly-reset/     # WeeklyResetWizard
│   └── marketing/        # PricingSection
├── contexts/             # LocaleProvider (i18n ES/EN)
├── hooks/                # useHabits, useTasks, useXp, etc.
├── lib/
│   ├── gamification/     # xp-engine, rank-config, level-gates, badge-processor
│   ├── i18n/             # getT() para server components
│   ├── supabase/         # client, server, middleware, admin
│   ├── stripe/           # checkout, billing portal
│   ├── redis/            # caché, rate limiting
│   ├── resend/           # emails
│   └── utils/            # cn, format-xp, date
├── messages/             # es.ts, en.ts (traducciones tipadas)
├── stores/               # Zustand: sidebar, focus, xp-notification
├── types/                # TypeScript interfaces por módulo
└── supabase/
    ├── functions/        # Edge Function award-xp (Deno)
    ├── migrations/       # 001-007 SQL
    └── seed/             # badges.sql (75+ insignias)
```

---

## Rutas de la aplicación

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Marketing | Landing page |
| `/pricing` | Marketing | Página de precios |
| `/login` | Auth | Formulario login |
| `/register` | Auth | Formulario registro |
| `/dashboard` | Dashboard | Inicio (protegido) |
| `/habits` | Dashboard | Módulo hábitos |
| `/tasks` | Dashboard | Módulo tareas |
| `/tasks/eisenhower` | Dashboard | Matriz Eisenhower |
| `/focus` | Dashboard | Temporizador Pomodoro |
| `/journal` | Dashboard | Diario (mañana/noche) |
| `/goals` | Dashboard | Metas (nivel 5) |
| `/vision-board` | Dashboard | Vision Board (nivel 3) |
| `/notes` | Dashboard | Notas (nivel 7) |
| `/leaderboard` | Dashboard | Clasificación mensual |
| `/settings` | Dashboard | Ajustes + idioma |
| `/p/[username]` | Público | Perfil público |

## Endpoint API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/webhooks/stripe` | Webhook de Stripe (checkout, subscription update/delete) |

---

## Patrones del proyecto

### Data fetching (cliente)
TanStack Query con Supabase client. Ver `hooks/useHabits.ts` como referencia:
- `useQuery` con `queryKey` → `queryFn` llama a Supabase
- `useMutation` con `invalidateQueries` en `onSuccess`

### Data fetching (servidor)
Server components en layouts y algunas páginas. Ver `app/(dashboard)/layout.tsx`:
- `createClient()` de `@/lib/supabase/server` → queries directas → redirect si no auth

### Estado global
Zustand (sin persist). Ver `stores/sidebar-store.ts`:
- `create<Interface>((set) => ({ ... }))`

### XP y gamificación
- `hooks/useXp.ts` → `awardXp(amount, source, sourceId?, message?)`
- Insert en `xp_transactions` → trigger BD `recalculate_level` actualiza `profiles`
- Toast vía `stores/xp-notification-store.ts`

### i18n
- Componentes cliente: `const { t } = useLocale()` → `t.namespace.key`
- Server components: `const t = await getT()` de `@/lib/i18n/server`
- Traducciones en `messages/es.ts` y `messages/en.ts`

### UI components
Sistema propio en `components/ui/`. Patrón: `forwardRef` + `cn()` + variantes como objetos.

---

## Gotchas críticos

- **Sin `.env.example`**: las variables necesarias están documentadas en README pero no existe archivo ejemplo.
- **Supabase Edge Functions excluidas de tsconfig**: `"exclude": ["supabase/functions"]` — usan Deno, no Node.
- **RLS obligatorio**: todas las tablas tienen Row Level Security. Queries sin auth fallarán silenciosamente (retornan `[]`).
- **Triggers de BD**: `recalculate_level` actualiza `profiles` automáticamente tras cada insert en `xp_transactions`. No actualizar `total_xp` manualmente.
- **`xpForLevel(1) = 0`**: el nivel 1 arranca en 0 XP, no en 100. Fix aplicado en xp-engine.
- **Rangos en español en BD**: la migración 006 cambió los rangos a español. El default de `current_rank` es `'Novato'`.
- **`date-fns` usa locale `es`**: `lib/utils/date.ts` importa `{ es }` de `date-fns/locale`. Formateo de fechas en español por defecto.
- **Hook `useXp` tiene default message en español**: `"¡Acción completada!"` — debe pasarse `t.xp.actionComplete` o `t.habits.xpComplete` desde el componente que lo llama.
- **`next.config.ts` vacío**: sin configuración custom, todo es defaults de Next.js 16.
- **Sin testing**: no hay jest, vitest, ni playwright configurados.
- **Sin CI/CD**: no hay GitHub Actions ni Dockerfile.
- **Sin prettier**: solo ESLint con config de Next.js.

---

## Deuda técnica documentada

- [ ] Sin framework de testing → skill `setup-testing`
- [ ] Sin `.env.example` → crear archivo con nombres de variables sin valores
- [ ] Sin CI/CD (GitHub Actions) → configurar workflow de lint + build
- [ ] Sin Prettier → configurar para consistencia de formato
- [ ] `hooks/useXp.ts` tiene mensaje default hardcodeado en español → pasar siempre `t.*` desde el componente
- [ ] `lib/utils/date.ts` hardcodea locale `es` → debería leer locale del contexto
- [ ] Landing page y pricing no usan sistema i18n (strings hardcodeados en español)
- [ ] `components/ui/` no tienen tests unitarios
