"use client";

import { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { useXp } from "@/hooks/useXp";
import { Button } from "@/components/ui/button";
import type { GoalMilestone } from "@/types/goals";
import { useLocale } from "@/contexts/locale-context";

interface MilestoneListProps {
  goalId: string;
  milestones: GoalMilestone[];
}

export function MilestoneList({ goalId, milestones }: MilestoneListProps) {
  const { t } = useLocale();
  const { addMilestone, toggleMilestone } = useGoals();
  const { awardXp } = useXp();
  const [draft, setDraft] = useState("");

  async function handleToggle(m: GoalMilestone, nextDone: boolean) {
    const wasDone = m.isDone;
    await toggleMilestone.mutateAsync({
      goalId,
      milestoneId: m.id,
      isDone: nextDone,
    });
    if (!wasDone && nextDone) {
      await awardXp(30, "milestone", m.id, "¡Hito completado!");
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    await addMilestone.mutateAsync({ goalId, title: draft.trim() });
    setDraft("");
  }

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {t.goals.milestones}
      </p>
      <ul className="space-y-2">
        {milestones.length === 0 ? (
          <li className="text-sm text-muted">{t.goals.noMilestones}</li>
        ) : (
          milestones.map((m) => (
            <li key={m.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={m.isDone}
                onChange={(e) => void handleToggle(m, e.target.checked)}
                disabled={toggleMilestone.isPending}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-accent focus:ring-accent/40"
              />
              <span
                className={
                  m.isDone ? "text-sm text-muted line-through" : "text-sm text-foreground"
                }
              >
                {m.title}
              </span>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={(e) => void handleAdd(e)} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.goals.addMilestone}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={addMilestone.isPending || !draft.trim()}
        >
          {t.goals.addMilestone}
        </Button>
      </form>
    </div>
  );
}
