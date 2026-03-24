"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PageHeader } from "@/components/shared/PageHeader";
import { JournalEntry } from "@/components/journal/JournalEntry";
import { useLocale } from "@/contexts/locale-context";

export default function JournalPage() {
  const { t } = useLocale();
  const today = new Date();
  const dateLabel = format(today, "EEEE, d MMMM yyyy", { locale: es });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <div className="space-y-2">
        <PageHeader
          title={t.journal.pageTitle}
          description={t.journal.pageDesc}
        />
        <p className="text-sm font-medium text-accent">{dateLabel}</p>
      </div>

      <section className="space-y-4">
        <JournalEntry entryType="morning" />
      </section>

      <section className="space-y-4">
        <JournalEntry entryType="evening" />
      </section>
    </div>
  );
}
