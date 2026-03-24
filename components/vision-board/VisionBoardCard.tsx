"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type VisionSaveStatus = "idle" | "saving" | "saved" | "error";

export function visionSaveLabel(status: VisionSaveStatus): string {
  switch (status) {
    case "saving":
      return "Guardando…";
    case "saved":
      return "Guardado";
    case "error":
      return "No se pudo guardar";
    default:
      return "Guardado automático activo";
  }
}

interface VisionBoardCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  saveStatus: string;
  children: ReactNode;
  className?: string;
}

export function VisionBoardCard({
  icon: Icon,
  title,
  subtitle,
  saveStatus,
  children,
  className,
}: VisionBoardCardProps) {
  return (
    <Card className={cn("flex flex-col gap-4", className)}>
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
        </div>
      </div>
      <div className="min-w-0">{children}</div>
      <p className="text-xs text-muted">{saveStatus}</p>
    </Card>
  );
}
