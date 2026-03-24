"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";

export default function FocusPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <PageHeader
        title="Temporizador"
        description="Trabajo profundo en bloques enfocados — elige una duración y mantén el ritmo."
      />
      <PomodoroTimer />
    </div>
  );
}
