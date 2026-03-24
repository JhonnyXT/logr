# Logr — Registra tu vida. Ve tu año.

**Logr** es una aplicación de productividad todo-en-uno que convierte la consistencia diaria en un juego de progresión personal. Cada acción gana puntos de experiencia (XP), desbloquea rangos y enciende tu cuadrícula de actividad anual.

> Stack: Next.js 16 · Supabase · Tailwind CSS v4 · TypeScript · Stripe

---

## Tabla de contenidos

- [Características](#características)
- [Sistema de gamificación](#sistema-de-gamificación)
- [Módulos](#módulos)
- [Stack técnico](#stack-técnico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Configuración del entorno](#configuración-del-entorno)
- [Base de datos](#base-de-datos)
- [Suscripciones](#suscripciones)
- [Internacionalización](#internacionalización)
- [Despliegue](#despliegue)

---

## Características

- **7 módulos integrados** bajo un único dashboard: Hábitos, Tareas, Temporizador, Diario, Metas, Vision Board y Notas.
- **Sistema de gamificación completo**: XP, 100 niveles, 12 rangos de prestigio, 75+ insignias coleccionables.
- **Cuadrícula de actividad estilo GitHub** que muestra tu consistencia durante todo el año.
- **Clasificación mensual** y perfiles públicos para compartir tu progreso.
- **Desbloqueo progresivo de funciones** para evitar el agobio inicial.
- **Soporte de idiomas**: Español (predeterminado) e Inglés, cambiable desde Ajustes.
- **Dos planes**: Gratis (generoso) y Pro (€4/mes o €33.60/año).

---

## Sistema de gamificación

### Puntos de experiencia (XP)

Cada acción completada otorga XP:

| Acción | XP |
|---|---|
| Completar un hábito | 10 XP |
| Completar una tarea | 15 XP |
| Completar la tarea principal del día | 25 XP |
| Terminar una sesión de enfoque | 20 XP |
| Escribir una entrada de diario | 15 XP |
| Completar un hito de meta | 30 XP |
| Completar el Reinicio Semanal | 50 XP |
| Racha de 7 días | 75 XP |
| Racha de 30 días | 200 XP |

### Niveles y fórmula de progresión

El sistema tiene **100 niveles**. El XP necesario para alcanzar cada nivel sigue una curva:

```
XP para nivel N = floor(100 × N^1.8)
```

- Nivel 1: 0 XP (punto de partida)
- Nivel 2: ~348 XP
- Nivel 5: ~1,380 XP
- Nivel 10: ~3,981 XP
- Nivel 50: ~57,000 XP
- Nivel 100: ~316,000 XP

### Rangos de prestigio (12 rangos)

| Rango | Niveles | Color |
|---|---|---|
| Novato | 1–11 | Gris |
| Devoto | 12–23 | Azul |
| Estrella | 24–35 | Violeta |
| Triunfador | 36–41 | Cian |
| Eterno | 42–53 | Verde |
| Leyenda | 54–63 | Ámbar |
| Mítico | 64–73 | Rojo |
| Trascendente | 74–82 | Rosa |
| Paradigma | 83–89 | Naranja |
| Ascendente | 90–94 | Verde azulado |
| Inmortal | 95–98 | Púrpura |
| Apex | 99–100 | Dorado |

### Desbloqueo progresivo de funciones

Para evitar el agobio inicial, algunas funciones se desbloquean con el nivel:

| Función | Nivel requerido |
|---|---|
| Vision Board | Nivel 3 (~2 días) |
| Metas | Nivel 5 (~1 semana) |
| Notas | Nivel 7 (~3 semanas) |

### Insignias

Más de 75 insignias coleccionables organizadas en 6 categorías:

| Categoría | Descripción |
|---|---|
| Hábito | Rachas, consistencia, primeros hábitos |
| Enfoque | Horas de trabajo profundo acumuladas |
| Tarea | Tareas completadas, main focus |
| Nivel | Hitos de progresión de nivel |
| Social | Perfiles públicos, clasificación |
| Especial | Logros únicos y eventos |

---

## Módulos

### Hábitos

Seguimiento de hábitos con programación flexible y protección de racha.

**Frecuencias disponibles:**
- Diario
- Días laborables (lunes a viernes)
- Semanal
- Días específicos (selección personalizada)

**Características:**
- Racha actual y racha más larga
- Días de vacaciones (omite sin perder la racha)
- Ícono y color personalizables por hábito
- Historial de completaciones diarias

---

### Tareas

Lista de tareas con gestión por prioridad y enfoque diario.

**Prioridades:**
- Baja · Media · Alta · Crítica

**Características:**
- **Enfoque principal**: una tarea destacada para el día
- **Matriz de Eisenhower**: vista de cuadrantes Urgente/Importante
- Etiquetas personalizadas
- Fecha límite con indicador de vencido
- Vinculación de tareas a metas
- Indicadores Urgente / Importante independientes

---

### Temporizador de Enfoque

Sesiones Pomodoro con seguimiento de trabajo profundo.

**Duraciones:** 15 · 25 · 45 · 60 · 90 minutos

**Temas visuales:**
- Minimal
- Cozy
- Developer
- Nature

**Características:**
- Vincula cada sesión a una tarea
- Estadísticas: sesiones hoy, tiempo total, racha de días
- Pausar y reanudar

---

### Diario

Registro de estado de ánimo y reflexión personal.

**Tipos de entrada:**
- Reflexión matutina
- Reflexión nocturna

**Características:**
- Escala de estado de ánimo del 1 al 10
- Prompts de reflexión aleatorios (5 prompts matutinos + 5 nocturnos)
- Historial de entradas por fecha
- Embeddings vectoriales para búsqueda semántica futura (pgvector)

---

### Metas

Definición de objetivos a largo plazo con hitos medibles.

> Requiere **Nivel 5** para desbloquear.

**Horizontes temporales:**
- Trimestral
- 1 año
- 3 años

**Categorías de vida:**
- Carrera · Salud · Finanzas · Relaciones · Crecimiento

**Características:**
- Barra de progreso del 0% al 100%
- Hitos con fecha objetivo (cada hito otorga 30 XP)
- Fecha objetivo de la meta
- Vinculación con tareas del módulo Tareas

---

### Vision Board

Herramientas de introspección y diseño de vida ideal.

> Requiere **Nivel 3** para desbloquear.

**6 ejercicios incluidos:**

| Ejercicio | Descripción |
|---|---|
| El Método Eulogy | Define cómo quieres ser recordado |
| Lista de deseos | Experiencias y logros que quieres vivir |
| Tu Misión | Tu propósito central en la vida |
| Define tu Éxito | Cómo se ve el éxito para ti |
| Plan Odyssey | Tres vidas paralelas posibles (Caminos 1, 2 y 3) |
| Calendario Futuro | Tu visión del futuro a largo plazo |

---

### Notas

Editor de texto enriquecido con organización jerárquica.

> Requiere **Nivel 7** para desbloquear.

**Características:**
- Árbol de páginas jerárquico (páginas anidadas)
- Guardado automático
- Ícono por página
- Embeddings vectoriales para búsqueda semántica (pgvector)
- Arrastrar y soltar (estructura preparada)

---

### Reinicio Semanal

Ritual semanal de revisión en 6 categorías que otorga **50 XP** al completarlo.

**Categorías:**

| Categoría | Acción |
|---|---|
| Hogar | Organiza y limpia tu espacio |
| Mente | Lee, aprende o medita |
| Cuerpo | Haz ejercicio y aliméntate bien |
| Digital | Limpia tu bandeja, actualiza apps |
| Finanzas | Revisa tu presupuesto y gastos |
| Social | Comunícate con alguien |

Solo se puede completar una vez por semana.

---

### Clasificación

Tabla de líderes mensual con los usuarios más consistentes.

**Características:**
- Podio top 3 con XP del mes
- Tabla completa con posición, usuario y nivel
- Feed de actividad reciente (rachas, subidas de nivel)

---

### Perfiles públicos

Cada usuario puede hacer su perfil público desde Ajustes.

**Visible públicamente:**
- Nombre, usuario y biografía
- Nivel y rango actual con color
- XP total
- Cuadrícula de actividad anual completa
- Insignias ganadas con categoría

URL: `/p/[username]`

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Base de datos | Supabase (PostgreSQL + pgvector) |
| Autenticación | Supabase Auth |
| Estado cliente | Zustand + TanStack Query v5 |
| Pagos | Stripe |
| Emails | Resend |
| Caché / Rate limiting | Upstash Redis |
| Edge Functions | Supabase Edge Functions (Deno) |
| Iconos | Lucide React |
| Fechas | date-fns v4 |
| Despliegue | Vercel |
| Analíticas | PostHog |
| Errores | Sentry |

---

## Estructura del proyecto

```
logr/
├── app/
│   ├── (auth)/           # Login, registro
│   ├── (dashboard)/      # Dashboard protegido
│   │   ├── dashboard/    # Inicio
│   │   ├── habits/       # Módulo hábitos
│   │   ├── tasks/        # Módulo tareas + Eisenhower
│   │   ├── focus/        # Temporizador Pomodoro
│   │   ├── journal/      # Diario
│   │   ├── goals/        # Metas (Nivel 5)
│   │   ├── vision-board/ # Vision Board (Nivel 3)
│   │   ├── notes/        # Notas (Nivel 7)
│   │   ├── leaderboard/  # Clasificación
│   │   └── settings/     # Ajustes + selector de idioma
│   ├── (marketing)/      # Landing page, precios
│   ├── api/
│   │   └── webhooks/stripe/ # Webhooks de Stripe
│   └── p/[username]/     # Perfiles públicos
│
├── components/
│   ├── focus/            # PomodoroTimer, TimerControls, FocusThemeSelector
│   ├── gamification/
│   │   ├── activity-grid/ # ActivityGrid, GridCell, GridTooltip
│   │   ├── leaderboard/   # LeaderboardPodium, LeaderboardTable, ActivityFeed
│   │   └── xp-bar/        # XpBar, LevelBadge
│   ├── goals/            # GoalCard, GoalForm, MilestoneList
│   ├── habits/           # HabitCard, HabitForm, HabitList, StreakCounter
│   ├── journal/          # JournalEntry, MoodSlider, ReflectionPrompt
│   ├── marketing/        # PricingSection
│   ├── notes/            # NoteEditor, NotesSidebar
│   ├── shared/           # Sidebar, DashboardShell, XpToast, LockedFeatureGate
│   ├── tasks/            # TaskCard, TaskForm, TaskList, EisenhowerMatrix, MainTaskBanner
│   ├── ui/               # Button, Card, Badge, Dialog, Progress
│   ├── vision-board/     # EulogyMethod, BucketList, MissionStatement, etc.
│   └── weekly-reset/     # WeeklyResetWizard
│
├── contexts/
│   └── locale-context.tsx # Proveedor de idioma (ES/EN)
│
├── hooks/                # useHabits, useTasks, useFocusTimer, useJournal, etc.
├── lib/
│   ├── gamification/     # xp-engine, rank-config, level-gates, badge-processor
│   ├── i18n/             # server.ts (helper getT para server components)
│   ├── supabase/         # client, server, middleware, admin
│   ├── stripe/           # checkout, portal de facturación
│   ├── redis/            # caché, rate limiting
│   ├── resend/           # emails transaccionales
│   └── utils/            # cn, format-xp, date
│
├── messages/
│   ├── es.ts             # Traducciones en español
│   └── en.ts             # Traducciones en inglés
│
├── stores/               # sidebar-store, focus-store, xp-notification-store
├── types/                # gamification, habits, tasks, focus, journal, etc.
│
└── supabase/
    ├── functions/
    │   └── award-xp/     # Edge Function para otorgar XP
    ├── migrations/       # 001–007 (schema, módulos, RLS, triggers, etc.)
    └── seed/
        └── badges.sql    # 75+ insignias predefinidas
```

---

## Configuración del entorno

### 1. Clonar e instalar

```bash
git clone https://github.com/JhonnyXT/logr.git
cd logr
npm install
```

### 2. Variables de entorno

Copia `.env.local` y completa los valores:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Resend
RESEND_API_KEY=re_...

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry
SENTRY_DSN=https://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Ejecutar migraciones en Supabase

En el SQL Editor de tu proyecto Supabase, ejecuta en orden:

```
supabase/migrations/001_schema_core.sql
supabase/migrations/002_schema_modules.sql
supabase/migrations/003_rls_policies.sql
supabase/migrations/004_functions_triggers.sql
supabase/migrations/005_badges_task_and_xp_system.sql
supabase/migrations/006_spanish_ranks.sql
supabase/migrations/007_add_locale.sql
```

Luego ejecuta el seed de insignias:

```
supabase/seed/badges.sql
```

### 4. Configurar autenticación en Supabase

En el dashboard de Supabase:
- **Authentication → Settings → Site URL**: `http://localhost:3000`
- **Authentication → Settings → Redirect URLs**: `http://localhost:3000/**`
- Habilitar proveedor **Email** con confirmación

### 5. Iniciar en desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`.

---

## Base de datos

### Tablas principales

| Tabla | Descripción |
|---|---|
| `profiles` | Perfil del usuario: nivel, XP, rango, suscripción |
| `xp_transactions` | Historial de todas las ganancias de XP |
| `activity_logs` | Registro diario de actividad para la cuadrícula |
| `habits` | Definición de hábitos |
| `habit_completions` | Registro de completaciones diarias |
| `tasks` | Tareas con prioridad y metadata |
| `focus_sessions` | Sesiones de enfoque completadas |
| `journal_entries` | Entradas de diario con embedding vectorial |
| `goals` | Metas a largo plazo |
| `goal_milestones` | Hitos de cada meta |
| `vision_board_items` | Items de los 6 ejercicios de Vision Board |
| `notes` | Notas con estructura jerárquica y embedding |
| `weekly_resets` | Registro de reinicios semanales |
| `badges` | Catálogo de 75+ insignias |
| `user_badges` | Insignias ganadas por cada usuario |

### Seguridad

Todas las tablas tienen **Row Level Security (RLS)** habilitado. Los usuarios solo pueden leer y escribir sus propios datos. Los perfiles públicos (`is_public = true`) son visibles para todos.

### Funciones y triggers

- `handle_new_user()` — crea el perfil automáticamente al registrarse
- `recalculate_level()` — recalcula nivel y rango tras cada transacción de XP
- `upsert_activity_log()` — actualiza la cuadrícula de actividad diaria
- `update_updated_at()` — actualiza timestamps automáticamente

### pgvector

Las tablas `journal_entries` y `notes` incluyen una columna `embedding vector(1536)` lista para búsqueda semántica con OpenAI Embeddings o similar.

---

## Suscripciones

### Plan Gratis

| Función | Límite |
|---|---|
| Hábitos | 3 |
| Tareas | 30 |
| Metas | 3 |
| Temporizador de Enfoque | Ilimitado |
| Diario | Ilimitado |
| Insignias y Clasificación | Incluido |
| Modo oscuro | Incluido |
| Vision Board | Nivel 3 (~2 días) |
| Metas completo | Nivel 5 (~1 semana) |
| Notas | Nivel 7 (~3 semanas) |

### Plan Pro — €4.00/mes (o €33.60/año)

Todo lo del plan Gratis, más:

- Hábitos, Tareas y Metas ilimitados
- Vision Board desbloqueado desde el inicio
- Metas y Notas desbloqueadas desde el inicio
- Temas Pro para el temporizador
- Analíticas y patrones de enfoque
- Capturas de Vision Board
- Exportación de datos
- Insignia Pro exclusiva
- Garantía de reembolso de 14 días

### Integración Stripe

- Checkout: `lib/stripe/index.ts`
- Webhook: `app/api/webhooks/stripe/route.ts`
  - Eventos manejados: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Portal de facturación: disponible desde Ajustes

---

## Internacionalización

Logr soporta dos idiomas: **Español** (predeterminado) e **Inglés**.

### Cambiar idioma

El usuario puede cambiar el idioma en cualquier momento desde **Ajustes → Idioma**.

La preferencia se guarda en:
1. `localStorage` (inmediato, sin latencia)
2. Cookie `logr-locale` (para server components)
3. Columna `locale` en `profiles` de Supabase (persistencia entre dispositivos)

### Para desarrolladores

**Componentes cliente** — usar el hook `useLocale`:

```tsx
import { useLocale } from "@/contexts/locale-context";

export function MyComponent() {
  const { t, locale, setLocale } = useLocale();
  return <p>{t.habits.pageTitle}</p>;
}
```

**Server components** — usar `getT`:

```tsx
import { getT } from "@/lib/i18n/server";

export default async function MyPage() {
  const t = await getT();
  return <PageHeader title={t.habits.pageTitle} />;
}
```

**Agregar traducciones** — editar `messages/es.ts` y `messages/en.ts` manteniendo las mismas claves.

---

## Despliegue

### Vercel (recomendado)

1. Conecta el repositorio de GitHub en [vercel.com](https://vercel.com)
2. Agrega todas las variables de entorno de `.env.local`
3. Cambia `NEXT_PUBLIC_APP_URL` a tu dominio de producción
4. Despliega

### Webhook de Stripe en producción

Registra el endpoint de Stripe apuntando a:

```
https://tu-dominio.com/api/webhooks/stripe
```

Eventos a escuchar:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### Supabase

Asegúrate de que las siguientes configuraciones estén activas en producción:
- URL del sitio apunta a tu dominio
- Redirect URLs incluyen `https://tu-dominio.com/**`
- RLS habilitado en todas las tablas (ya configurado en las migraciones)

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con Turbopack
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

---

## Repositorio

[github.com/JhonnyXT/logr](https://github.com/JhonnyXT/logr)
