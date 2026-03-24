import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registra tu vida. Ve tu año.",
  description:
    "Hábitos, tareas, metas, temporizador, diario — todo en un solo lugar. Cada acción gana XP. Mira cómo tu año se ilumina.",
};

function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1e2d40]/80 bg-[#0a0f1a]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0f1a]/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-[#e2e8f0]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00e96a]/15 text-sm font-bold text-[#00e96a]">
            L
          </span>
          <span className="text-base">Logr</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#4a5568] transition-colors hover:bg-[#0d1526] hover:text-[#e2e8f0]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#00e96a] px-4 py-2 text-sm font-semibold text-[#0a0f1a] shadow-lg shadow-[#00e96a]/20 transition hover:bg-[#00b853]"
          >
            Comenzar gratis <span aria-hidden>→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t border-[#1e2d40] bg-[#0d1526]/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-[#e2e8f0]">Logr</p>
            <p className="mt-1 max-w-sm text-sm text-[#4a5568]">
              Logr · Registra tu vida. Un gráfico.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link href="/#features" className="text-[#4a5568] hover:text-[#00e96a]">
              Herramientas gratis
            </Link>
            <Link href="/pricing" className="text-[#4a5568] hover:text-[#00e96a]">
              Precios
            </Link>
            <Link href="#" className="text-[#4a5568] hover:text-[#00e96a]">
              Privacidad
            </Link>
            <Link href="#" className="text-[#4a5568] hover:text-[#00e96a]">
              Términos
            </Link>
            <Link href="#" className="text-[#4a5568] hover:text-[#00e96a]">
              Soporte
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-center text-xs text-[#4a5568] sm:text-left">
          © 2026 Logr. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-[#e2e8f0]">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
