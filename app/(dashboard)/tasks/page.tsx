"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { MainTaskBanner } from "@/components/tasks/MainTaskBanner";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { cn } from "@/lib/utils/cn";

export default function TasksPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Tareas"
        description="Prioriza, completa y gana XP — tu tarea principal da extra."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/tasks/eisenhower"
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Matriz de Eisenhower
            </Link>
            <Button type="button" variant="accent" size="md" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Nueva tarea
            </Button>
          </div>
        }
      />

      <MainTaskBanner />

      <TaskList />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <TaskForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </div>
  );
}
