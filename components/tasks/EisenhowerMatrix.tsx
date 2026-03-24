"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import { useTasks } from "@/hooks/useTasks";
import { useLocale } from "@/contexts/locale-context";
import { getQuadrant, type EisenhowerQuadrant, type Task } from "@/types/tasks";
import { TaskCard } from "./TaskCard";

const QUADRANT_HEADER_CLASSES: Record<EisenhowerQuadrant, string> = {
  do_first: "bg-destructive/15 text-destructive border-b border-destructive/25",
  schedule: "bg-info/15 text-info border-b border-info/25",
  delegate: "bg-warning/15 text-warning border-b border-warning/25",
  eliminate: "bg-muted/30 text-muted border-b border-border",
};

const QUADRANT_ORDER: EisenhowerQuadrant[] = ["do_first", "schedule", "delegate", "eliminate"];

function groupByQuadrant(tasks: Task[]) {
  const map = new Map<EisenhowerQuadrant, Task[]>();
  for (const q of QUADRANT_ORDER) {
    map.set(q, []);
  }
  for (const task of tasks) {
    const q = getQuadrant(task);
    map.get(q)?.push(task);
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
  const { t } = useLocale();

  const byQuadrant = useMemo(() => groupByQuadrant(tasks), [tasks]);

  const QUADRANTS: {
    id: EisenhowerQuadrant;
    title: string;
    subtitle: string;
    headerClass: string;
  }[] = [
    {
      id: "do_first",
      title: t.tasks.doFirst,
      subtitle: t.tasks.urgentImportant,
      headerClass: QUADRANT_HEADER_CLASSES.do_first,
    },
    {
      id: "schedule",
      title: t.tasks.schedule,
      subtitle: t.tasks.importantNotUrgent,
      headerClass: QUADRANT_HEADER_CLASSES.schedule,
    },
    {
      id: "delegate",
      title: t.tasks.delegate,
      subtitle: t.tasks.urgentNotImportant,
      headerClass: QUADRANT_HEADER_CLASSES.delegate,
    },
    {
      id: "eliminate",
      title: t.tasks.eliminate,
      subtitle: t.tasks.notUrgentNotImportant,
      headerClass: QUADRANT_HEADER_CLASSES.eliminate,
    },
  ];

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
                <p className="py-6 text-center text-xs text-muted">{t.tasks.noTasksQuadrant}</p>
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
