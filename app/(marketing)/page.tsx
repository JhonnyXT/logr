import Link from "next/link";
import { PricingSection } from "@/components/marketing/pricing-section";

const testimonials = [
  {
    quote: "Vi una mejora al instante en productividad en cuanto empecé a usar Logr.",
  },
  {
    quote: "De verdad me ayudó mientras lo usaba.",
  },
  {
    quote: "Tuve una gran primera impresión de tu servicio, y me veo usándolo de ahora en adelante.",
    note: "Traducido del rumano",
  },
  {
    quote: "Buen trabajo con la app: se siente bastante pulida, la verdad.",
  },
  {
    quote: "Me encanta lo que estás construyendo aquí, sigue así.",
  },
  {
    quote: "Honestamente, me encanta la idea que trajiste…",
  },
  {
    quote: "Vi el changelog reciente y son mejoras muy sólidas.",
  },
  {
    quote: "Esto va a ser enorme pronto.",
  },
  {
    quote: "Gracias otra vez por construir esta app.",
  },
] as const;

const modules = [
  {
    name: "Hábitos",
    title: "Construye rachas inquebrantables",
    desc: "Registra hábitos diarios con horarios flexibles. Omite días de vacaciones sin perder tu racha. Mira cómo la consistencia se convierte en cambio real.",
    bullets: [
      "Horarios diarios, entre semana o personalizados",
      "Seguimiento de rachas con protección al omitir",
      "Cuadrículas anuales de revisión",
    ],
  },
  {
    name: "Tareas",
    title: "Haz las cosas, a tu manera",
    desc: "Una lista de pendientes más inteligente con prioridades, etiquetas y un Enfoque principal diario para mantenerte alineado.",
    bullets: [
      'Define una tarea de "Enfoque principal" cada día',
      "Vista matriz de Eisenhower",
      "Etiquetas y prioridades con color",
    ],
  },
  {
    name: "Temporizador",
    title: "Enfócate sin distracciones",
    desc: "Temporizador Pomodoro con modos a pantalla completa. Registra trabajo profundo y mira cómo crece tu tiempo enfocado.",
    bullets: ["Sesiones de 15–90 minutos", "Temas inmersivos", "Vincula sesiones a tareas"],
  },
  {
    name: "Diario",
    title: "Reflexiona y crece cada día",
    desc: "Planificación matutina, reflexión nocturna y seguimiento del estado de ánimo. Ve patrones con el tiempo.",
    bullets: [
      "Indicaciones de mañana y tarde",
      "Estado de ánimo del 1 al 10",
      "Revisa ayer antes de planificar hoy",
    ],
  },
  {
    name: "Metas",
    title: "Sueña en grande, mide el progreso",
    desc: "Define metas de trimestre a 3 años. Divídelas en hitos y vincula el trabajo diario a grandes sueños.",
    bullets: ["Hitos y métricas", "Cinco áreas de la vida", "Vincula tareas a metas"],
  },
  {
    name: "Vision",
    title: "Diseña tu vida ideal",
    desc: "Seis ejercicios para aclarar el rumbo — elogio, lista de deseos, misión, definición de éxito y más.",
    bullets: ["Elogio y lista de deseos", "Misión y definición de éxito", "Plan odisea y calendario futuro"],
  },
  {
    name: "Notas",
    title: "Captura cada idea",
    desc: "Texto enriquecido con árbol jerárquico, comandos con barra y búsqueda instantánea.",
    bullets: ["Páginas anidadas", "Comandos con barra", "Organización con arrastrar y soltar"],
  },
] as const;

function HeroMockDashboard() {
  const grid = Array.from({ length: 42 }, (_, i) => i);
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#00e96a]/20 via-transparent to-[#00e96a]/5 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-[#1e2d40] bg-[#0d1526] shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-[#1e2d40] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00e96a]" />
            <span className="text-xs font-medium text-[#e2e8f0]">Actividad 2026</span>
          </div>
          <span className="rounded-md bg-[#00e96a]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00e96a]">
            Nv. 12
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 p-4">
          {grid.map((i) => (
            <div
              key={i}
              className={
                i % 5 === 0
                  ? "aspect-square rounded-sm bg-[#39d353]/90"
                  : i % 7 === 0
                    ? "aspect-square rounded-sm bg-[#26a641]/80"
                    : "aspect-square rounded-sm bg-[#161b22]"
              }
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-[#1e2d40] px-4 py-3">
          <div className="rounded-lg border border-[#1e2d40] bg-[#0a0f1a]/80 px-2 py-2 text-center">
            <p className="text-[10px] text-[#4a5568]">Racha</p>
            <p className="text-lg font-bold text-[#00e96a]">14</p>
          </div>
          <div className="rounded-lg border border-[#1e2d40] bg-[#0a0f1a]/80 px-2 py-2 text-center">
            <p className="text-[10px] text-[#4a5568]">Hábitos</p>
            <p className="text-lg font-bold text-[#e2e8f0]">3/4</p>
          </div>
          <div className="rounded-lg border border-[#1e2d40] bg-[#0a0f1a]/80 px-2 py-2 text-center">
            <p className="text-[10px] text-[#4a5568]">Enfoque</p>
            <p className="text-lg font-bold text-[#e2e8f0]">1h 40m</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketingHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#1e2d40]/80">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(0,233,106,0.14),transparent_55%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#e2e8f0] sm:text-5xl lg:text-6xl">
                Registra tu vida.
                <br />
                <span className="bg-gradient-to-r from-[#00e96a] to-[#39d353] bg-clip-text text-transparent">
                  Ve tu año.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#4a5568] sm:text-xl">
                Hábitos, tareas, metas, temporizador, diario — todo en un solo lugar. Cada acción gana XP. Mira cómo tu
                año se ilumina.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00e96a] px-6 py-3.5 text-base font-semibold text-[#0a0f1a] shadow-lg shadow-[#00e96a]/25 transition hover:bg-[#00b853]"
                >
                  Comenzar gratis <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/#features"
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-medium text-[#4a5568] transition hover:bg-[#0d1526] hover:text-[#e2e8f0]"
                >
                  Probar sin registrarse
                </Link>
              </div>
              <p className="mt-6 text-sm text-[#4a5568]">Gratis para siempre · Sin tarjeta de crédito</p>
            </div>
            <HeroMockDashboard />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-[#1e2d40]/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#00e96a]">
            EL PROBLEMA REAL
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center text-3xl font-bold tracking-tight text-[#e2e8f0] sm:text-4xl">
            No te falta motivación.
            <br />
            <span className="text-[#4a5568]">Te falta un sistema que funcione.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-relaxed text-[#4a5568]">
            Has probado apps. Has probado hojas de cálculo. Has probado la fuerza de voluntad. Nada funciona porque
            nada te muestra que realmente estás progresando.
          </p>
          <div className="mx-auto mt-14 max-w-3xl space-y-6">
            {[
              {
                pain: "No puedes ser consistente",
                fix: "Las rachas, puntos y niveles hacen que la consistencia se sienta como un juego",
              },
              {
                pain: "Demasiadas apps, sin vista unificada",
                fix: "Hábitos, tareas, metas, temporizador, diario — todo en un lugar",
              },
              {
                pain: "Sin idea de si estás mejorando",
                fix: "La cuadrícula anual muestra cada día que te presentaste",
              },
            ].map((row) => (
              <div
                key={row.pain}
                className="flex flex-col gap-4 rounded-2xl border border-[#1e2d40] bg-[#0d1526]/50 p-6 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
              >
                <p className="text-lg font-semibold text-[#e2e8f0]">{row.pain}</p>
                <div className="hidden h-px w-8 shrink-0 bg-[#1e2d40] sm:block" aria-hidden />
                <p className="text-base leading-relaxed text-[#4a5568] sm:max-w-md sm:text-right">{row.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 border-b border-[#1e2d40]/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#e2e8f0] sm:text-4xl">Todas las herramientas que necesitas</h2>
            <p className="mt-4 text-lg text-[#4a5568]">Siete módulos potentes, un dashboard unificado</p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((m) => (
              <article
                key={m.name}
                className="group flex flex-col rounded-2xl border border-[#1e2d40] bg-gradient-to-b from-[#0d1526]/90 to-[#0a0f1a] p-6 shadow-xl transition hover:border-[#00e96a]/30 hover:shadow-[#00e96a]/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#e2e8f0]">{m.title}</h3>
                  <span className="rounded-full bg-[#00e96a]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00e96a]">
                    {m.name}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4a5568]">{m.desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#e2e8f0]/90">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00e96a]" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 h-28 overflow-hidden rounded-xl border border-[#1e2d40]/80 bg-[#0a0f1a]/60 p-3">
                  <div className="flex h-full flex-col justify-between opacity-90">
                    <div className="h-2 w-1/3 rounded bg-[#1e2d40]" />
                    <div className="space-y-1.5">
                      <div className="h-2 rounded bg-[#00e96a]/30" />
                      <div className="h-2 w-5/6 rounded bg-[#1e2d40]" />
                      <div className="h-2 w-2/3 rounded bg-[#1e2d40]" />
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-6 flex-1 rounded-sm bg-[#161b22]" />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-b border-[#1e2d40]/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#e2e8f0] sm:text-4xl">
            Por qué realmente lo mantendrás
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-[#4a5568]">
            La mayoría de las apps de hábitos se sienten como tarea. Logr se siente como un juego que quieres ganar.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Compite con amigos",
                desc: "Rankings mensuales. Ve quién está logrando sus metas. La competencia amigable te mantiene motivado.",
                tag: "Clasificación",
              },
              {
                title: "Logros comunitarios",
                desc: "Mira cómo llegan las rachas, subidas de nivel y desbloqueos de insignias. Celebra los logros juntos.",
                tag: "Insignias",
              },
              {
                title: "Muestra tu progreso",
                desc: "Perfiles públicos con cuadrículas de actividad. 100 niveles, 75+ insignias, 12 rangos para desbloquear.",
                tag: "Perfiles",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-[#1e2d40] bg-[#0d1526]/60 p-8 shadow-lg shadow-black/20"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-[#00e96a]">{card.tag}</span>
                <h3 className="mt-3 text-xl font-semibold text-[#e2e8f0]">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4a5568]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-[#1e2d40]/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#e2e8f0] sm:text-4xl">Lo que dicen los usuarios</h2>
            <p className="mt-4 text-[#4a5568]">Retroalimentación real de soporte. Sin editar.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="flex flex-col rounded-2xl border border-[#1e2d40] bg-[#0d1526]/40 p-6 shadow-md"
              >
                <p className="text-sm leading-relaxed text-[#e2e8f0]">&ldquo;{t.quote}&rdquo;</p>
                {"note" in t && t.note ? (
                  <p className="mt-3 text-xs text-[#4a5568]">{t.note}</p>
                ) : null}
              </blockquote>
            ))}
          </div>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-[#1e2d40] py-6 text-center text-sm text-[#4a5568]">
            <span>Más de 1,000 miembros</span>
            <span className="hidden sm:inline" aria-hidden>
              |
            </span>
            <span>18K+ hábitos registrados</span>
            <span className="hidden sm:inline" aria-hidden>
              |
            </span>
            <span>1.1K+ tareas completadas</span>
            <span className="hidden sm:inline" aria-hidden>
              |
            </span>
            <span>500+ horas de enfoque</span>
          </div>
        </div>
      </section>

      <PricingSection variant="compact" />

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00e96a] via-[#00c255] to-[#0a0f1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-[#0a0f1a] sm:text-4xl">¿Listo para ser consistente de una vez?</h2>
          <ol className="mt-8 flex flex-col gap-3 text-left text-base font-medium text-[#0a0f1a]/90 sm:mx-auto sm:max-w-md">
            <li className="flex items-center gap-3 rounded-xl bg-[#0a0f1a]/10 px-4 py-3 backdrop-blur-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a0f1a] text-sm font-bold text-[#00e96a]">
                1
              </span>
              Crea tu cuenta
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-[#0a0f1a]/10 px-4 py-3 backdrop-blur-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a0f1a] text-sm font-bold text-[#00e96a]">
                2
              </span>
              Agrega tu primer hábito
            </li>
            <li className="flex items-center gap-3 rounded-xl bg-[#0a0f1a]/10 px-4 py-3 backdrop-blur-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a0f1a] text-sm font-bold text-[#00e96a]">
                3
              </span>
              Construye rachas
            </li>
          </ol>
          <Link
            href="/register"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a0f1a] px-8 py-4 text-lg font-semibold text-[#00e96a] shadow-xl transition hover:bg-[#0d1526]"
          >
            Comenzar gratis <span aria-hidden>→</span>
          </Link>
          <p className="mt-6 text-sm font-medium text-[#0a0f1a]/80">
            Sin tarjeta de crédito · Gratis para siempre · Configura en 2 minutos
          </p>
        </div>
      </section>
    </>
  );
}
