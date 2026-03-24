"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LockedFeatureGate } from "@/components/shared/LockedFeatureGate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalForm } from "@/components/goals/GoalForm";
import { useGoals } from "@/hooks/useGoals";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useLocale } from "@/contexts/locale-context";

function GoalsLockedPreview() {
  const { t } = useLocale();
  return (
    <div className="space-y-8">
      <PageHeader
        title={t.goals.pageTitle}
        description={t.goals.pageDesc}
        action={
          <Button type="button" variant="accent" size="md" disabled>
            <Plus className="h-4 w-4" />
            {t.goals.newGoal}
          </Button>
        }
      />
      <div className="grid gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="space-y-4">
            <div className="h-6 w-2/5 max-w-xs rounded bg-border" />
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full w-1/3 rounded-full bg-accent/40" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-border/80" />
              <div className="h-4 w-4/5 rounded bg-border/80" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GoalsContent() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const { goals, isLoading } = useGoals(true);

  return (
    <div className="space-y-8">
      <PageHeader
        title={t.goals.pageTitle}
        description={t.goals.pageDesc}
        action={
          <Button type="button" variant="accent" size="md" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            {t.goals.newGoal}
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted">Cargando metas…</p>
      ) : goals.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          Sin metas aún. Crea tu primera meta para seguir hitos y progreso.
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <GoalForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </div>
  );
}

export default function GoalsPage() {
  const { data: level, isLoading } = useUserLevel();

  if (isLoading || level === undefined) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-border" />
        <div className="h-32 animate-pulse rounded-xl bg-border/60" />
      </div>
    );
  }

  if (level < 5) {
    return (
      <div className="mx-auto max-w-3xl">
        <LockedFeatureGate featureKey="goals" userLevel={level}>
          <GoalsLockedPreview />
        </LockedFeatureGate>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <GoalsContent />
    </div>
  );
}
