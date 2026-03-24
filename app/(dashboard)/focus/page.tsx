"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";
import { useLocale } from "@/contexts/locale-context";

export default function FocusPage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <PageHeader
        title={t.focus.pageTitle}
        description={t.focus.pageDesc}
      />
      <PomodoroTimer />
    </div>
  );
}
