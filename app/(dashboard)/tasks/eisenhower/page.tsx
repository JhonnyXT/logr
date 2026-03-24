"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EisenhowerMatrix } from "@/components/tasks/EisenhowerMatrix";
import { cn } from "@/lib/utils/cn";

export default function EisenhowerPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <Link
          href="/tasks"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Tareas
        </Link>
        <PageHeader
          title="Matriz de Eisenhower"
          description="Ordena el trabajo por urgencia e importancia — haz primero lo que realmente importa."
        />
      </div>

      <EisenhowerMatrix />
    </div>
  );
}
