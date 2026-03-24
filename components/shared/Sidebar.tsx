"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Repeat,
  Settings,
  Target,
  Timer,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { DashboardUserProfile } from "@/types/dashboard";
import { useLocale } from "@/contexts/locale-context";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  minLevel?: number;
}

interface SidebarProps {
  userLevel: number;
  profile: DashboardUserProfile;
}

export function Sidebar({ userLevel, profile }: SidebarProps) {
  const { t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isOpen = useSidebarStore((s) => s.isOpen);
  const toggle = useSidebarStore((s) => s.toggle);

  const NAV_MAIN: NavItem[] = [
    { href: "/dashboard", label: t.nav.home, icon: LayoutDashboard },
    { href: "/habits", label: t.nav.habits, icon: Repeat },
    { href: "/tasks", label: t.nav.tasks, icon: CheckSquare },
    { href: "/focus", label: t.nav.focus, icon: Timer },
    { href: "/journal", label: t.nav.journal, icon: BookOpen },
    { href: "/goals", label: t.nav.goals, icon: Target, minLevel: 5 },
    { href: "/vision-board", label: t.nav.vision, icon: Eye, minLevel: 3 },
    { href: "/notes", label: t.nav.notes, icon: FileText, minLevel: 7 },
  ];

  const NAV_BOTTOM: NavItem[] = [
    { href: "/leaderboard", label: t.nav.leaderboard, icon: Trophy },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  const expanded = isOpen;
  const widthClass = expanded ? "w-[240px]" : "w-16";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName =
    profile.full_name?.trim() ||
    profile.username?.trim() ||
    "Cuenta";

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const locked = item.minLevel != null && userLevel < item.minLevel;
    const Icon = item.icon;

    const content = (
      <>
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <Icon
            className={cn(
              "h-[18px] w-[18px] transition-colors",
              active ? "text-accent" : "text-muted group-hover:text-foreground",
              locked && "opacity-60"
            )}
          />
          {locked ? (
            <Lock
              className="absolute -right-0.5 -top-0.5 h-3 w-3 text-muted"
              aria-hidden
            />
          ) : null}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm font-medium transition-colors",
            active ? "text-foreground" : "text-muted group-hover:text-foreground",
            expanded ? "opacity-100" : "sr-only"
          )}
        >
          {item.label}
        </span>
      </>
    );

    const className = cn(
      "group flex min-h-10 w-full items-center gap-3 rounded-r-lg border-l-2 border-transparent py-1.5 pl-2 pr-2 text-left transition-colors",
      active && "border-accent bg-accent/10 text-foreground",
      !active && "hover:bg-foreground/[0.04]",
      locked && "cursor-not-allowed opacity-80"
    );

    if (locked) {
      return (
        <span
          className={className}
          title={`${t.xp.lockedDescPre} ${item.minLevel} ${t.xp.lockedDescPost}`}
          aria-disabled
        >
          {content}
        </span>
      );
    }

    return (
      <Link href={item.href} className={className} prefetch>
        {content}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "relative z-40 flex h-full shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-300 ease-out",
        widthClass
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-border px-2",
          expanded ? "justify-between gap-2" : "justify-center"
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex min-w-0 items-center gap-2 font-semibold tracking-tight text-foreground",
            !expanded && "justify-center"
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-sm font-bold text-accent">
            L
          </span>
          {expanded ? <span className="truncate text-sm">Logr</span> : null}
        </Link>
        {expanded ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={toggle}
            aria-label={t.nav.collapse}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden py-3 pr-1">
        {NAV_MAIN.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <div className="my-2 h-px bg-border" role="separator" />

        {NAV_BOTTOM.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="mt-auto border-t border-border p-2">
        {expanded ? (
          <p className="mb-2 truncate px-2 text-xs text-muted" title={displayName}>
            {displayName}
          </p>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted hover:text-foreground",
            !expanded && "justify-center px-0"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span className={cn("text-sm font-medium", expanded ? "" : "sr-only")}>
            {t.nav.signOut}
          </span>
        </Button>
      </div>

      {!expanded ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-14 flex h-9 w-9 translate-x-1/2 rounded-full border border-border bg-surface shadow-md"
          onClick={toggle}
          aria-label={t.nav.expand}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : null}
    </aside>
  );
}
