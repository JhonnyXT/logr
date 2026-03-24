"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export function StreakCounter({ streak, className }: StreakCounterProps) {
  const active = streak > 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums",
        active ? "text-amber-400" : "text-muted",
        className
      )}
      title={active ? `${streak} días de racha` : "Sin racha aún"}
    >
      <Flame
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.35)]" : "text-muted"
        )}
        aria-hidden
      />
      <span>{streak}</span>
    </span>
  );
}
