import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const rows = [
  { feature: "Hábitos", free: "3", pro: "Ilimitado" },
  { feature: "Tareas", free: "30", pro: "Ilimitado" },
  { feature: "Metas", free: "3", pro: "Ilimitado" },
  { feature: "Temporizador", free: "✓", pro: "✓" },
  { feature: "Reflexiones diarias", free: "✓", pro: "✓" },
  { feature: "Insignias y clasificación", free: "✓", pro: "✓" },
  { feature: "Modo oscuro", free: "✓", pro: "✓" },
  {
    feature: "Vision",
    free: "Nivel 3 (~2 días)",
    pro: "Desbloqueado",
  },
  {
    feature: "Metas (completo)",
    free: "Nivel 5 (~1 semana)",
    pro: "Desbloqueado",
  },
  {
    feature: "Notas",
    free: "Nivel 7 (~3 semanas)",
    pro: "Desbloqueado",
  },
  { feature: "Temas Pro", free: "—", pro: "✓" },
  { feature: "Analíticas y patrones de enfoque", free: "—", pro: "✓" },
  { feature: "Capturas de Vision", free: "—", pro: "✓" },
  { feature: "Exportar datos e insignia Pro", free: "—", pro: "✓" },
];

type PricingSectionProps = {
  variant?: "compact" | "full";
  className?: string;
  showPricingLink?: boolean;
};

export function PricingSection({
  variant = "compact",
  className,
  showPricingLink = true,
}: PricingSectionProps) {
  const isFull = variant === "full";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-[#1e2d40] bg-gradient-to-b from-[#0d1526]/50 to-transparent py-20 sm:py-28",
        className
      )}
      aria-labelledby="pricing-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,233,106,0.12),transparent)]" />

      <div className="pricing-billing-root relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <input
          type="radio"
          name="marketing-billing"
          id="marketing-bill-monthly"
          className="sr-only"
          defaultChecked
        />
        <input type="radio" name="marketing-billing" id="marketing-bill-yearly" className="sr-only" />

        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="pricing-heading"
            className="text-3xl font-bold tracking-tight text-[#e2e8f0] sm:text-4xl"
          >
            Construye hábitos con personas que lo entienden.
          </h2>
          {isFull ? (
            <p className="mt-4 text-lg text-[#4a5568]">
              Más de 1,000 miembros animándose mutuamente. Competencias. Diversión. Y sí, resultados reales.
              Elige el plan que encaje con cómo quieres crecer — mejora cuando quieras.
            </p>
          ) : (
            <p className="mt-4 text-[#4a5568]">
              Más de 1,000 miembros animándose mutuamente. Competencias. Diversión. Y sí, resultados reales.
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="billing-pill relative flex items-center justify-center gap-1 rounded-full border border-[#1e2d40] bg-[#0d1526] p-1">
            <label
              htmlFor="marketing-bill-monthly"
              className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition hover:text-[#e2e8f0]"
            >
              Mensual
            </label>
            <label
              htmlFor="marketing-bill-yearly"
              className="cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition hover:text-[#e2e8f0]"
            >
              Anual
            </label>
            <span className="absolute -right-2 -top-2 rounded-full bg-[#00e96a]/20 px-2 py-0.5 text-[10px] font-semibold text-[#00e96a]">
              -43%
            </span>
          </div>

          <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-[#1e2d40] bg-[#0d1526]/80 p-8 shadow-xl shadow-black/20">
              <p className="text-sm font-medium uppercase tracking-wider text-[#4a5568]">Gratis</p>
              <p className="mt-2 text-4xl font-bold text-[#e2e8f0]">€0</p>
              <p className="text-sm text-[#4a5568]">Gratis para siempre</p>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center justify-center rounded-lg border border-[#1e2d40] bg-transparent px-5 py-3 text-center text-sm font-semibold text-[#e2e8f0] transition hover:border-[#00e96a]/50 hover:bg-[#00e96a]/5"
              >
                Comenzar gratis
              </Link>
              <p className="mt-3 text-center text-xs text-[#4a5568]">Sin tarjeta · Garantía de 14 días</p>
            </div>

            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#00e96a]/40 bg-gradient-to-br from-[#0d1526] to-[#0a0f1a] p-8 shadow-2xl shadow-[#00e96a]/10">
              <div className="absolute right-4 top-4 rounded-full bg-[#00e96a]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#00e96a]">
                Popular
              </div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#00e96a]">Pro</p>

              <div className="relative mt-2 min-h-[4.5rem]">
                <div className="pp-monthly-block">
                  <p className="text-4xl font-bold text-[#e2e8f0]">
                    €4.00<span className="text-lg font-normal text-[#4a5568]">/mes</span>
                  </p>
                  <p className="text-sm text-[#4a5568]">Facturación mensual · cancela cuando quieras</p>
                </div>
                <div className="pp-yearly-block">
                  <p className="text-4xl font-bold text-[#e2e8f0]">
                    €2.80<span className="text-lg font-normal text-[#4a5568]">/mes</span>
                  </p>
                  <p className="text-sm text-[#4a5568]">€33.60 al año · mejor valor</p>
                </div>
              </div>

              <Link
                href="/register?plan=pro"
                className="mt-6 inline-flex min-h-[3rem] items-center justify-center rounded-lg bg-[#00e96a] px-5 py-3 text-center text-sm font-semibold text-[#0a0f1a] shadow-lg shadow-[#00e96a]/25 transition hover:bg-[#00b853]"
              >
                <span className="pp-cta-monthly">Obtener Pro — €4.00/mes</span>
                <span className="pp-cta-yearly">Obtener Pro — €33.60/año</span>
              </Link>
              <p className="mt-3 text-center text-xs text-[#4a5568]">
                Sin tarjeta de crédito · Garantía de reembolso de 14 días
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 overflow-x-auto rounded-2xl border border-[#1e2d40] bg-[#0d1526]/40">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#1e2d40] bg-[#0a0f1a]/80">
                <th className="px-4 py-4 font-semibold text-[#e2e8f0]">Función</th>
                <th className="px-4 py-4 font-semibold text-[#4a5568]">Gratis</th>
                <th className="px-4 py-4 font-semibold text-[#00e96a]">Pro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-[#1e2d40]/60 last:border-0">
                  <td className="px-4 py-3 text-[#e2e8f0]">{row.feature}</td>
                  <td className="px-4 py-3 text-[#4a5568]">{row.free}</td>
                  <td className="px-4 py-3 text-[#e2e8f0]">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isFull ? (
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#1e2d40] bg-[#0d1526]/30 p-6">
              <h3 className="font-semibold text-[#e2e8f0]">¿Puedo cambiar de plan después?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a5568]">
                Sí. Pasa a Pro cuando estés listo o vuelve a Gratis si necesitas un descanso. Tus datos se
                quedan contigo.
              </p>
            </div>
            <div className="rounded-xl border border-[#1e2d40] bg-[#0d1526]/30 p-6">
              <h3 className="font-semibold text-[#e2e8f0]">¿Qué métodos de pago aceptáis?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a5568]">
                Tarjetas principales y opciones regionales donde estén disponibles. Facturas para equipos bajo
                solicitud.
              </p>
            </div>
            <div className="rounded-xl border border-[#1e2d40] bg-[#0d1526]/30 p-6">
              <h3 className="font-semibold text-[#e2e8f0]">¿Hay política de reembolso?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a5568]">
                Pro incluye garantía de reembolso de 14 días. Si no encaja, lo arreglamos.
              </p>
            </div>
            <div className="rounded-xl border border-[#1e2d40] bg-[#0d1526]/30 p-6">
              <h3 className="font-semibold text-[#e2e8f0]">¿Necesito tarjeta para Gratis?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4a5568]">
                No. Empieza gratis, explora todos los módulos principales y añade Pro cuando quieras los extras.
              </p>
            </div>
          </div>
        ) : null}

        {showPricingLink && !isFull ? (
          <p className="mt-12 text-center text-sm text-[#4a5568]">
            ¿Quieres más detalle?{" "}
            <Link href="/pricing" className="font-medium text-[#00e96a] hover:underline">
              Ver desglose completo de precios
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
