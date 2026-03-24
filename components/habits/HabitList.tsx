"use client";

import { Repeat } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { HabitCard } from "./HabitCard";

function HabitListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-xl border border-border bg-surface/80"
        />
      ))}
    </div>
  );
}

export function HabitList() {
  const { habits, isLoading } = useHabits();

  if (isLoading) {
    return <HabitListSkeleton />;
  }

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Repeat className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Sin hábitos aún</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Agrega tu primer hábito con el botón de arriba. Los pequeños logros diarios se acumulan en cambios duraderos.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {habits.map((habit) => (
        <li key={habit.id}>
          <HabitCard habit={habit} />
        </li>
      ))}
    </ul>
  );
}
