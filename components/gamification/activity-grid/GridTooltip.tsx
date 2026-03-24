"use client";

import { formatDate } from "@/lib/utils/date";

interface GridTooltipProps {
  date: string;
  actionsCount: number;
  xpEarned: number;
  position: { x: number; y: number };
}

export function GridTooltip({ date, actionsCount, xpEarned, position }: GridTooltipProps) {
  return (
    <div
      className="pointer-events-none fixed z-[100] rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-xl"
      style={{
        left: position.x,
        top: position.y - 48,
        transform: "translateX(-50%)",
      }}
    >
      <p className="font-semibold text-foreground">
        {actionsCount} {actionsCount === 1 ? "acción" : "acciones"}
      </p>
      <p className="text-muted">
        {xpEarned} XP &middot; {formatDate(date, "MMM d, yyyy")}
      </p>
    </div>
  );
}
