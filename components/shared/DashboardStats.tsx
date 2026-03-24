"use client";

import { CheckSquare, Flame, Repeat, Timer } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/contexts/locale-context";

export interface DashboardStatsProps {
  streak: number;
  habitsToday: number;
  tasksToday: number;
  focusMinToday: number;
  className?: string;
}

export function DashboardStats({
  streak,
  habitsToday,
  tasksToday,
  focusMinToday,
  className,
}: DashboardStatsProps) {
  const { t } = useLocale();
  const items = [
    { label: t.stats.streak, value: streak, icon: Flame },
    { label: t.stats.habitsToday, value: habitsToday, icon: Repeat },
    { label: t.stats.tasksToday, value: tasksToday, icon: CheckSquare },
    { label: t.stats.focusMin, value: focusMinToday, icon: Timer },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3",
        className
      )}
    >
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex flex-col gap-2 rounded-lg border border-border/80 bg-foreground/[0.04] px-3 py-3 transition-colors hover:bg-foreground/[0.06]"
        >
          <div className="flex items-center gap-2 text-muted">
            <Icon className="h-4 w-4 shrink-0 text-accent/90" aria-hidden />
            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
          </div>
          <p className="text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
