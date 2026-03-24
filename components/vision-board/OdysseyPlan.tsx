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
import { useLocale } from "@/contexts/locale-context";

export function OdysseyPlan() {
  const { t } = useLocale();
  const { save, row, isLoading } = useVisionBoardItem("odyssey_plan");
  const stableSave = useStableSaveCallback(save);
  const { paths, setPaths, saveStatus, hydrated } = useOdysseyFields(
    row ?? null,
    isLoading,
    stableSave
  );

  const LABELS = [t.vision.path1, t.vision.path2, t.vision.path3] as const;

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
      title={t.vision.odysseyTitle}
      subtitle="Tres trayectos de cinco años que puedes imaginar"
      saveStatus={visionSaveLabel(saveStatus, t.vision)}
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
              placeholder={t.vision.placeholder}
              className="min-h-[100px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
            />
          </div>
        ))}
      </div>
    </VisionBoardCard>
  );
}
