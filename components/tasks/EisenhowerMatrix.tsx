"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import { useTasks } from "@/hooks/useTasks";
import { getQuadrant, type EisenhowerQuadrant, type Task } from "@/types/tasks";
import { TaskCard } from "./TaskCard";

const QUADRANTS: {
  id: EisenhowerQuadrant;
  title: string;
  subtitle: string;
  headerClass: string;
}[] = [
  {
    id: "do_first",
    title: "Hacer primero",
    subtitle: "Urgente e Importante",
    headerClass: "bg-destructive/15 text-destructive border-b border-destructive/25",
  },
  {
    id: "schedule",
    title: "Programar",
    subtitle: "Importante, No Urgente",
    headerClass: "bg-info/15 text-info border-b border-info/25",
  },
  {
    id: "delegate",
    title: "Delegar",
    subtitle: "Urgente, No Importante",
    headerClass: "bg-warning/15 text-warning border-b border-warning/25",
  },
  {
    id: "eliminate",
    title: "Eliminar",
    subtitle: "Ni Urgente Ni Importante",
    headerClass: "bg-muted/30 text-muted border-b border-border",
  },
];

function groupByQuadrant(tasks: Task[]) {
  const map = new Map<EisenhowerQuadrant, Task[]>();
  for (const q of QUADRANTS) {
    map.set(q.id, []);
  }
  for (const t of tasks) {
    const q = getQuadrant(t);
    map.get(q)?.push(t);
  }
  return map;
}

function MatrixSkeleton() {
  return (
    <div className="grid min-h-[420px] grid-cols-1 gap-3 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border bg-surface/60" />
      ))}
    </div>
  );
}

export function EisenhowerMatrix() {
  const { tasks, isLoading } = useTasks();

  const byQuadrant = useMemo(() => groupByQuadrant(tasks), [tasks]);

  if (isLoading) {
    return <MatrixSkeleton />;
  }

  return (
    <div className="grid min-h-[min(70vh,560px)] grid-cols-1 gap-3 md:grid-cols-2">
      {QUADRANTS.map((q) => {
        const list = byQuadrant.get(q.id) ?? [];
        return (
          <div
            key={q.id}
            className={cn(
              "flex min-h-[200px] flex-col overflow-hidden rounded-xl border border-border bg-surface/50 shadow-sm"
            )}
          >
            <div className={cn("px-4 py-3", q.headerClass)}>
              <h3 className="text-sm font-semibold tracking-tight">{q.title}</h3>
              <p className="text-xs opacity-90">{q.subtitle}</p>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
              {list.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted">Sin tareas aún</p>
              ) : (
                <ul className="space-y-2">
                  {list.map((task) => (
                    <li key={task.id}>
                      <TaskCard task={task} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
