"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { useTasks } from "@/hooks/useTasks";
import { useLocale } from "@/contexts/locale-context";

export function MainTaskBanner() {
  const { tasks } = useTasks();
  const { t } = useLocale();
  const mainTask = tasks.find((task) => task.isMainTask) ?? null;
  if (!mainTask) {
    return (
      <div className="rounded-xl border border-border bg-surface/80 p-4 pl-5 shadow-sm">
        <div className="border-l-4 border-accent pl-4">
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Star className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                {t.tasks.mainFocusTitle}
              </p>
              <p className="text-base text-foreground">
                {t.tasks.mainFocusEmpty}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-border/80 p-0 shadow-lg shadow-black/20">
      <div className="flex border-l-4 border-accent bg-gradient-to-r from-accent/10 to-transparent pl-5 pr-4 py-4">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-amber-400">
            <Star className="h-6 w-6 fill-amber-400/25" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {t.tasks.mainFocusTitle}
            </p>
            <p className="text-lg font-semibold leading-snug text-foreground">
              {mainTask.title}
            </p>
            {mainTask.tags.length > 0 ? (
              <p className="text-sm text-muted">{mainTask.tags.join(" · ")}</p>
            ) : null}
          </div>
        </div>
        <Link
          href="/tasks/eisenhower"
          className={cn(
            "inline-flex h-8 shrink-0 items-center justify-center self-start rounded-md px-3 text-sm font-medium text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
          )}
        >
          {t.tasks.eisenhower}
        </Link>
      </div>
    </Card>
  );
}
