"use client";

import { useState } from "react";
import { AlertCircle, Calendar, Check, Star, Tag } from "lucide-react";
import { isBefore, parseISO, startOfDay } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/date";
import { useTasks } from "@/hooks/useTasks";
import { useXp } from "@/hooks/useXp";
import { useLocale } from "@/contexts/locale-context";
import type { Task, TaskPriority } from "@/types/tasks";

const PRIORITY_VARIANT: Record<
  TaskPriority,
  "default" | "accent" | "warning" | "destructive" | "outline"
> = {
  low: "outline",
  medium: "default",
  high: "warning",
  critical: "destructive",
};

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  const d = startOfDay(parseISO(dueDate));
  return isBefore(d, startOfDay(new Date()));
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { completeTask, setMainTask } = useTasks();
  const { awardXp } = useXp();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);
  const [starBusy, setStarBusy] = useState(false);

  const PRIORITY_LABELS: Record<TaskPriority, string> = {
    low: t.tasks.priorityLow,
    medium: t.tasks.priorityMedium,
    high: t.tasks.priorityHigh,
    critical: t.tasks.priorityCritical,
  };

  const overdue = task.dueDate ? isOverdue(task.dueDate) : false;

  async function handleComplete() {
    setBusy(true);
    try {
      await completeTask.mutateAsync(task.id);
      const xp = task.isMainTask ? 25 : 15;
      await awardXp(
        xp,
        "task",
        task.id,
        task.isMainTask ? t.tasks.xpMainComplete : t.tasks.xpComplete
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSetMain(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (task.isMainTask) return;
    setStarBusy(true);
    try {
      await setMainTask.mutateAsync(task.id);
    } finally {
      setStarBusy(false);
    }
  }

  return (
    <Card className="border-border/80 p-4 transition-colors hover:border-border">
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="mt-0.5 h-9 w-9 shrink-0 border-border"
          disabled={busy}
          onClick={() => void handleComplete()}
          aria-label="Completar"
        >
          <Check
            className={cn(
              "h-4 w-4 text-muted transition-opacity",
              busy && "animate-pulse opacity-50"
            )}
          />
        </Button>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="min-w-0 flex-1 font-medium leading-snug text-foreground">
              {task.title}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              <Badge variant={PRIORITY_VARIANT[task.priority]} className="capitalize">
                {PRIORITY_LABELS[task.priority]}
              </Badge>
              <button
                type="button"
                onClick={(e) => void handleSetMain(e)}
                disabled={starBusy}
                className={cn(
                  "rounded-md p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                  task.isMainTask
                    ? "text-amber-400"
                    : "text-muted hover:text-amber-400/90"
                )}
                aria-label={
                  task.isMainTask ? t.tasks.mainFocusTitle : t.tasks.setMainFocus
                }
                title={
                  task.isMainTask ? t.tasks.mainFocusTitle : t.tasks.setMainFocus
                }
              >
                <Star
                  className={cn("h-4 w-4", task.isMainTask && "fill-amber-400/30")}
                />
              </button>
            </div>
          </div>

          {task.tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-foreground/5 px-1.5 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {task.dueDate ? (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs",
                overdue ? "font-medium text-destructive" : "text-muted"
              )}
            >
              {overdue ? (
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              ) : (
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              )}
              <span>{formatDate(task.dueDate, "PP")}</span>
              {overdue ? <span className="text-destructive">{t.tasks.overdue}</span> : null}
            </div>
          ) : null}
        </div>

      </div>
    </Card>
  );
}
