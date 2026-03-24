"use client";

import { MapPin } from "lucide-react";
import {
  VisionBoardCard,
  visionSaveLabel,
} from "@/components/vision-board/VisionBoardCard";
import {
  useOdysseyFields,
  useStableSaveCallback,
  useVisionBoardItem,
} from "@/hooks/useVisionBoard";

const LABELS = [
  "Camino 1",
  "Camino 2",
  "Camino 3",
] as const;

export function OdysseyPlan() {
  const { save, row, isLoading } = useVisionBoardItem("odyssey_plan");
  const stableSave = useStableSaveCallback(save);
  const { paths, setPaths, saveStatus, hydrated } = useOdysseyFields(
    row ?? null,
    isLoading,
    stableSave
  );

  function setPath(idx: 0 | 1 | 2, value: string) {
    setPaths((prev) => {
      const next: [string, string, string] = [...prev];
      next[idx] = value;
      return next;
    });
  }

  return (
    <VisionBoardCard
      icon={MapPin}
      title="Plan Odyssey - Tres vidas paralelas"
      subtitle="Tres trayectos de cinco años que puedes imaginar"
      saveStatus={visionSaveLabel(saveStatus)}
    >
      <div className="space-y-4">
        {LABELS.map((label, i) => (
          <div key={label} className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-muted">
              {label}
            </label>
            <textarea
              value={paths[i]}
              onChange={(e) => setPath(i as 0 | 1 | 2, e.target.value)}
              disabled={!hydrated || isLoading}
              rows={4}
              placeholder="Describe este camino…"
              className="min-h-[100px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
            />
          </div>
        ))}
      </div>
    </VisionBoardCard>
  );
}
