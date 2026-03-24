"use client";

import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useHabits } from "@/hooks/useHabits";
import type { HabitFrequency } from "@/types/habits";

const COLOR_PRESETS = [
  "#00e96a",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#e2e8f0",
];

const FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: "daily", label: "Diario" },
  { value: "weekdays", label: "Días de semana" },
  { value: "weekly", label: "Semanal" },
  { value: "specific_days", label: "Días específicos" },
];

function targetDaysForFrequency(frequency: HabitFrequency): number[] {
  switch (frequency) {
    case "daily":
      return [];
    case "weekdays":
      return [1, 2, 3, 4, 5];
    case "weekly":
      return [1];
    case "specific_days":
      return [1, 2, 3, 4, 5];
    default:
      return [];
  }
}

interface HabitFormProps {
  onSuccess?: () => void;
}

export function HabitForm({ onSuccess }: HabitFormProps) {
  const { createHabit } = useHabits();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("✅");
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [vacationPause, setVacationPause] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    await createHabit.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
      icon: icon.trim() || "✅",
      color,
      frequency,
      targetDays: targetDaysForFrequency(frequency),
      xpReward: 10,
      githubSync: false,
      isActive: !vacationPause,
    });

    setTitle("");
    setDescription("");
    setIcon("✅");
    setColor(COLOR_PRESETS[0]);
    setFrequency("daily");
    setVacationPause(false);
    onSuccess?.();
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 pt-1">
      <DialogTitle className="pr-8">Nuevo hábito</DialogTitle>

      <div className="space-y-2">
        <label htmlFor="habit-title" className="text-sm font-medium text-foreground">
          Título
        </label>
        <input
          id="habit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Carrera matutina"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="habit-desc" className="text-sm font-medium text-foreground">
          Descripción
        </label>
        <textarea
          id="habit-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Detalles opcionales"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="habit-icon" className="text-sm font-medium text-foreground">
            Ícono
          </label>
          <input
            id="habit-icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            maxLength={8}
            placeholder="✅"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Frecuencia</span>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Color</span>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "h-9 w-9 rounded-lg border-2 transition-transform hover:scale-105",
                color === c ? "border-foreground ring-2 ring-accent/50" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-background/50 px-3 py-2.5">
        <input
          type="checkbox"
          checked={vacationPause}
          onChange={(e) => setVacationPause(e.target.checked)}
          className="h-4 w-4 rounded border-border text-accent focus:ring-accent/40"
        />
        <span className="text-sm text-foreground">
          Protección de racha (vacaciones) — el hábito queda inactivo hasta que lo reactives
        </span>
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          variant="accent"
          disabled={createHabit.isPending || !title.trim()}
        >
          {createHabit.isPending ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
