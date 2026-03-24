"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import type { GoalCategory, GoalWithMilestones } from "@/types/goals";
import { MilestoneList } from "@/components/goals/MilestoneList";

const CATEGORY_LABEL: Record<GoalCategory, string> = {
  career: "Carrera",
  health: "Salud",
  financial: "Finanzas",
  relationships: "Relaciones",
  growth: "Crecimiento",
};

const CATEGORY_BADGE: Record<GoalCategory, string> = {
  career: "border border-info/40 bg-info/15 text-info",
  health: "border border-accent/40 bg-accent/10 text-accent",
  financial: "border border-warning/40 bg-warning/15 text-warning",
  relationships: "border border-pink-500/40 bg-pink-500/10 text-pink-300",
  growth: "border border-purple-500/40 bg-purple-500/10 text-purple-300",
};

const HORIZON_LABEL: Record<GoalWithMilestones["horizon"], string> = {
  quarterly: "Trimestral",
  "1year": "1 año",
  "3years": "3 años",
};

function progressPercent(goal: GoalWithMilestones): number {
  const { milestones } = goal;
  if (milestones.length > 0) {
    const done = milestones.filter((m) => m.isDone).length;
    return Math.round((done / milestones.length) * 100);
  }
  return Math.min(100, Math.max(0, goal.progress));
}

function formatTargetDate(iso?: string) {
  if (!iso) return "Sin fecha objetivo";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

interface GoalCardProps {
  goal: GoalWithMilestones;
}

export function GoalCard({ goal }: GoalCardProps) {
  const pct = progressPercent(goal);

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{goal.title}</h3>
          {goal.description ? (
            <p className="text-sm text-muted">{goal.description}</p>
          ) : null}
        </div>
        <Badge
          variant="outline"
          className={cn("shrink-0 capitalize", CATEGORY_BADGE[goal.category])}
        >
          {CATEGORY_LABEL[goal.category]}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="rounded-md bg-foreground/5 px-2 py-1 font-medium text-foreground/90">
          {HORIZON_LABEL[goal.horizon]}
        </span>
        <span>{formatTargetDate(goal.targetDate)}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted">
          <span>Progreso</span>
          <span className="font-medium text-foreground">{pct}%</span>
        </div>
        <Progress value={pct} />
      </div>

      <MilestoneList goalId={goal.id} milestones={goal.milestones} />
    </Card>
  );
}
