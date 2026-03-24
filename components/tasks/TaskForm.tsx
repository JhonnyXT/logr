"use client";

import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useLocale } from "@/contexts/locale-context";
import type { TaskPriority } from "@/types/tasks";

interface TaskFormProps {
  onSuccess?: () => void;
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const { createTask } = useTasks();
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await createTask.mutateAsync({
      title: title.trim(),
      priority,
      isUrgent,
      isImportant,
      tags,
      dueDate: dueDate || undefined,
    });

    setTitle("");
    setPriority("medium");
    setIsUrgent(false);
    setIsImportant(false);
    setTagsInput("");
    setDueDate("");
    onSuccess?.();
  }

  const PRIORITIES: { value: TaskPriority; label: string }[] = [
    { value: "low", label: t.tasks.priorityLow },
    { value: "medium", label: t.tasks.priorityMedium },
    { value: "high", label: t.tasks.priorityHigh },
    { value: "critical", label: t.tasks.priorityCritical },
  ];

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 pt-1">
      <DialogTitle className="pr-8">{t.tasks.newTask}</DialogTitle>

      <div className="space-y-2">
        <label htmlFor="task-title" className="text-sm font-medium text-foreground">
          {t.tasks.titleLabel}
        </label>
        <input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="¿Qué hay que hacer?"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">{t.tasks.priority}</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="task-due" className="text-sm font-medium text-foreground">
            {t.tasks.dueDate}
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent/40"
          />
          <span className="text-sm text-foreground">{t.tasks.urgent}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent/40"
          />
          <span className="text-sm text-foreground">{t.tasks.important}</span>
        </label>
      </div>

      <div className="space-y-2">
        <label htmlFor="task-tags" className="text-sm font-medium text-foreground">
          {t.tasks.tags}
        </label>
        <input
          id="task-tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="separadas por comas"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="accent"
          disabled={createTask.isPending || !title.trim()}
        >
          {createTask.isPending ? t.common.saving : t.tasks.save}
        </Button>
      </div>
    </form>
  );
}
