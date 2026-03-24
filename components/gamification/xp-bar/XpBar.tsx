"use client";

import { xpProgress } from "@/lib/gamification/xp-engine";
import { Progress } from "@/components/ui/progress";
import { LevelBadge } from "@/components/gamification/xp-bar/LevelBadge";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/contexts/locale-context";

interface XpBarProps {
  totalXp: number;
  level: number;
  rank: string;
  rankColor: string;
  className?: string;
}

export function XpBar({ totalXp, level, rank, rankColor, className }: XpBarProps) {
  const { t } = useLocale();
  const { xpInLevel, xpNeeded, currentLevel } = xpProgress(totalXp);
  const displayLevel = level || currentLevel;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex h-12 items-center gap-3 border-t border-border bg-surface px-3 shadow-[0_-4px_24px_rgba(0,0,0,0.35)] sm:gap-4 sm:px-4",
        className
      )}
    >
      <LevelBadge level={displayLevel} rankColor={rankColor} />

      <div className="hidden min-w-0 sm:block sm:w-28">
        <p className="truncate text-xs font-medium text-foreground" style={{ color: rankColor }}>
          {rank}
        </p>
      </div>

      <div className="min-w-0 flex-1 px-1">
        <Progress
          value={xpInLevel}
          max={Math.max(1, xpNeeded)}
          className="h-2 bg-border"
          indicatorClassName="bg-accent shadow-[0_0_12px_rgba(0,233,106,0.45)]"
        />
      </div>

      <p className="shrink-0 text-xs tabular-nums text-muted sm:text-sm">
        <span className="text-foreground">{xpInLevel}</span>
        <span className="text-muted"> / </span>
        <span>{xpNeeded}</span>
        <span className="hidden sm:inline"> {t.xp.pts}</span>
      </p>
    </div>
  );
}
