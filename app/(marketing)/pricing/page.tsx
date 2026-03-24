import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "@/components/marketing/pricing-section";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Gratis para siempre o Pro por €4/mes. Compara hábitos, tareas, metas, enfoque, diario, vision y notas — elige lo que encaje contigo.",
};

export default function PricingPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#1e2d40]/80 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-40%,rgba(0,233,106,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00e96a]">Precios</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#e2e8f0] sm:text-5xl">
            Planes simples. Impulso serio.
          </h1>
          <p className="mt-6 text-lg text-[#4a5568]">
            Empieza gratis con límites generosos. Pasa a Pro cuando quieras hábitos y tareas ilimitados,
            analíticas avanzadas y acabado premium — cancela cuando quieras.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-[#4a5568]">
            <span className="rounded-full border border-[#1e2d40] bg-[#0d1526]/60 px-4 py-2">
              Sin tarjeta en Gratis
            </span>
            <span className="rounded-full border border-[#1e2d40] bg-[#0d1526]/60 px-4 py-2">
              Reembolso 14 días en Pro
            </span>
            <Link href="/register" className="font-medium text-[#00e96a] hover:underline">
              Crea tu cuenta →
            </Link>
          </div>
        </div>
      </section>

      <PricingSection variant="full" showPricingLink={false} />

      <section className="border-t border-[#1e2d40]/60 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#e2e8f0]">¿Aún decidiendo?</h2>
          <p className="mt-3 text-[#4a5568]">
            Explora el producto desde la página principal y vuelve cuando estés listo — tu plan Gratis no
            va a desaparecer.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#1e2d40] px-6 py-3 text-sm font-semibold text-[#e2e8f0] transition hover:border-[#00e96a]/40 hover:bg-[#0d1526]"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </div>
  );
}
