"use client";

import { useMemo } from "react";
import { CheckSquare } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskPriority } from "@/types/tasks";
import { TaskCard } from "./TaskCard";

const PRIORITY_ORDER: TaskPriority[] = ["critical", "high", "medium", "low"];

const PRIORITY_HEADINGS: Record<TaskPriority, string> = {
  critical: "Crítica",
  high: "Prioridad alta",
  medium: "Media",
  low: "Prioridad baja",
};

function sortWithinPriority(a: Task, b: Task): number {
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
  if (a.dueDate) return -1;
  if (b.dueDate) return 1;
  return a.title.localeCompare(b.title);
}

function TaskListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, g) => (
        <div key={g} className="space-y-3">
          <div className="h-5 w-32 animate-pulse rounded bg-border" />
          {Array.from({ length: 2 }).map((__, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border bg-surface/80"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function TaskList() {
  const { tasks, isLoading } = useTasks();

  const { grouped, restCount } = useMemo(() => {
    const main = tasks.find((t) => t.isMainTask);
    const list = main ? tasks.filter((t) => t.id !== main.id) : tasks;

    const byPriority = new Map<TaskPriority, Task[]>();
    for (const p of PRIORITY_ORDER) {
      byPriority.set(p, []);
    }
    for (const t of list) {
      const bucket = byPriority.get(t.priority);
      if (bucket) bucket.push(t);
    }
    for (const p of PRIORITY_ORDER) {
      const bucket = byPriority.get(p);
      if (bucket) bucket.sort(sortWithinPriority);
    }

    return { grouped: byPriority, restCount: list.length };
  }, [tasks]);

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <CheckSquare className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Sin tareas aún</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Agrega una tarea con el botón de arriba. Marca la más importante como principal para ganar XP extra.
        </p>
      </div>
    );
  }

  if (restCount === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-surface/30 px-4 py-8 text-center text-sm text-muted">
        No hay más tareas abiertas — tu enfoque principal está resaltado arriba.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {PRIORITY_ORDER.map((priority) => {
        const section = grouped.get(priority) ?? [];
        if (section.length === 0) return null;

        return (
          <section key={priority} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              {PRIORITY_HEADINGS[priority]}
            </h2>
            <ul className="space-y-3">
              {section.map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
