"use client";

import { useState } from "react";
import { Check, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useHabits } from "@/hooks/useHabits";
import { useXp } from "@/hooks/useXp";
import type { HabitFrequency, HabitWithCompletions } from "@/types/habits";
import { useLocale } from "@/contexts/locale-context";
import { StreakCounter } from "./StreakCounter";

interface HabitCardProps {
  habit: HabitWithCompletions;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { toggleHabit } = useHabits();
  const { awardXp } = useXp();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);

  const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
    daily: t.habits.daily,
    weekdays: t.habits.weekdays,
    weekly: t.habits.weekly,
    specific_days: t.habits.specificDays,
  };

  const done = habit.isCompletedToday;
  const pending = toggleHabit.isPending && busy;

  async function handleToggle() {
    setBusy(true);
    try {
      await toggleHabit.mutateAsync({
        habitId: habit.id,
        completed: habit.isCompletedToday,
      });
      if (!habit.isCompletedToday) {
        await awardXp(10, "habit", habit.id, t.habits.xpComplete);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/80 p-4 transition-colors",
        "hover:border-border"
      )}
      style={{
        borderLeftWidth: 3,
        borderLeftColor: habit.color,
      }}
    >
      <div className="flex gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background text-2xl"
          aria-hidden
        >
          {habit.icon || "✅"}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <h3 className="truncate font-semibold text-foreground">{habit.title}</h3>
              <p className="text-xs text-muted">{FREQUENCY_LABELS[habit.frequency]}</p>
            </div>
            <StreakCounter streak={habit.currentStreak} />
          </div>

          {habit.description ? (
            <p className="line-clamp-2 text-sm text-muted">{habit.description}</p>
          ) : null}

          <div className="flex items-center justify-end pt-1">
            <Button
              type="button"
              variant={done ? "accent" : "outline"}
              size="icon"
              className={cn(
                "shrink-0",
                done && "shadow-[0_0_12px_rgba(0,233,106,0.25)]"
              )}
              disabled={pending}
              onClick={() => void handleToggle()}
              aria-label={
                done ? "Marcar hábito como no hecho hoy" : t.habits.complete
              }
            >
              {done ? (
                <Check className="h-5 w-5 text-background" strokeWidth={2.5} />
              ) : (
                <Circle className="h-5 w-5 text-muted" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
