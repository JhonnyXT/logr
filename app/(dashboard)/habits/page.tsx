"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { HabitList } from "@/components/habits/HabitList";
import { HabitForm } from "@/components/habits/HabitForm";
import { useLocale } from "@/contexts/locale-context";

export default function HabitsPage() {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title={t.habits.pageTitle}
        description={t.habits.pageDesc}
        action={
          <Button type="button" variant="accent" size="md" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            {t.habits.newHabit}
          </Button>
        }
      />

      <HabitList />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <HabitForm onSuccess={() => setOpen(false)} />
      </Dialog>
    </div>
  );
}
