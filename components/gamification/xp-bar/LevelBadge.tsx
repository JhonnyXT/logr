"use client";

import { cn } from "@/lib/utils/cn";

interface LevelBadgeProps {
  level: number;
  rankColor: string;
  className?: string;
}

export function LevelBadge({ level, rankColor, className }: LevelBadgeProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-background text-sm font-bold tabular-nums text-foreground",
        className
      )}
      style={{
        borderColor: rankColor,
        boxShadow: `0 0 14px ${rankColor}55`,
      }}
    >
      {level}
    </div>
  );
}
