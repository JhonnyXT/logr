"use client";

import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { FeatureKey } from "@/types/gamification";
import { FEATURE_GATES } from "@/lib/gamification/level-gates";
import { useLocale } from "@/contexts/locale-context";

interface LockedFeatureGateProps {
  featureKey: FeatureKey;
  userLevel: number;
  children: ReactNode;
  className?: string;
}

export function LockedFeatureGate({
  featureKey,
  userLevel,
  children,
  className,
}: LockedFeatureGateProps) {
  const { t } = useLocale();
  const requiredLevel = FEATURE_GATES[featureKey];
  const isUnlocked = userLevel >= requiredLevel;

  if (isUnlocked) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none blur-sm opacity-30">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-surface">
          <Lock className="h-7 w-7 text-muted" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {t.xp.lockedTitle}
          </p>
          <p className="mt-1 text-sm text-muted">
            {t.xp.lockedDescPre} <span className="font-semibold text-accent">Nivel {requiredLevel}</span> {t.xp.lockedDescPost}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {t.xp.currentLevelPre} {userLevel}
          </p>
        </div>
      </div>
    </div>
  );
}
