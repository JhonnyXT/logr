"use client";

import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useGoals } from "@/hooks/useGoals";
import type { GoalCategory, GoalHorizon } from "@/types/goals";
import { useLocale } from "@/contexts/locale-context";

interface GoalFormProps {
  onSuccess?: () => void;
}

export function GoalForm({ onSuccess }: GoalFormProps) {
  const { t } = useLocale();
  const { createGoal } = useGoals();
  const [title, setTitle] = useState("");

  const CATEGORIES: { value: GoalCategory; label: string }[] = [
    { value: "career", label: t.goals.catCareer },
    { value: "health", label: t.goals.catHealth },
    { value: "financial", label: t.goals.catFinancial },
    { value: "relationships", label: t.goals.catRelationships },
    { value: "growth", label: t.goals.catGrowth },
  ];

  const HORIZONS: { value: GoalHorizon; label: string }[] = [
    { value: "quarterly", label: t.goals.quarterly },
    { value: "1year", label: t.goals.oneYear },
    { value: "3years", label: t.goals.threeYears },
  ];
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GoalCategory>("career");
  const [horizon, setHorizon] = useState<GoalHorizon>("quarterly");
  const [targetDate, setTargetDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    await createGoal.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      horizon,
      targetDate: targetDate || undefined,
    });

    setTitle("");
    setDescription("");
    setCategory("career");
    setHorizon("quarterly");
    setTargetDate("");
    onSuccess?.();
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 pt-1">
      <DialogTitle className="pr-8">{t.goals.newGoal}</DialogTitle>

      <div className="space-y-2">
        <label htmlFor="goal-title" className="text-sm font-medium text-foreground">
          {t.goals.titleLabel}
        </label>
        <input
          id="goal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Lanza el proyecto paralelo"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="goal-desc" className="text-sm font-medium text-foreground">
          {t.goals.descriptionLabel}
        </label>
        <textarea
          id="goal-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Por qué importa"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">{t.goals.category}</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === c.value
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">{t.goals.horizon}</legend>
        <div className="flex flex-wrap gap-3">
          {HORIZONS.map((h) => (
            <label
              key={h.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                horizon === h.value
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border text-muted hover:border-foreground/20"
              )}
            >
              <input
                type="radio"
                name="horizon"
                value={h.value}
                checked={horizon === h.value}
                onChange={() => setHorizon(h.value)}
                className="h-4 w-4 border-border text-accent focus:ring-accent/40"
              />
              {h.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="goal-target" className="text-sm font-medium text-foreground">
          {t.goals.targetDate}
        </label>
        <input
          id="goal-target"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          variant="accent"
          disabled={createGoal.isPending || !title.trim()}
        >
          {createGoal.isPending ? t.goals.saving : t.goals.createGoal}
        </Button>
      </div>
    </form>
  );
}
