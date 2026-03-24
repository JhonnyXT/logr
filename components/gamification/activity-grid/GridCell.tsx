"use client";

import { cn } from "@/lib/utils/cn";

export type IntensityLevel = 0 | 1 | 2 | 3 | 4;

interface GridCellProps {
  date: string;
  actionsCount: number;
  xpEarned: number;
  intensity: IntensityLevel;
  onHover?: (data: { date: string; actionsCount: number; xpEarned: number } | null) => void;
}

const intensityColors: Record<IntensityLevel, string> = {
  0: "bg-grid-empty",
  1: "bg-grid-1",
  2: "bg-grid-2",
  3: "bg-grid-3",
  4: "bg-grid-4",
};

export function GridCell({ date, actionsCount, xpEarned, intensity, onHover }: GridCellProps) {
  return (
    <div
      className={cn(
        "h-[13px] w-[13px] rounded-[3px] transition-all duration-150",
        "hover:ring-2 hover:ring-foreground/30 hover:scale-125",
        intensityColors[intensity]
      )}
      data-date={date}
      data-count={actionsCount}
      onMouseEnter={() => onHover?.({ date, actionsCount, xpEarned })}
      onMouseLeave={() => onHover?.(null)}
    />
  );
}

export function getIntensity(actionsCount: number): IntensityLevel {
  if (actionsCount === 0) return 0;
  if (actionsCount <= 2) return 1;
  if (actionsCount <= 5) return 2;
  if (actionsCount <= 9) return 3;
  return 4;
}
