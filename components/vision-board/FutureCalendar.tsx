"use client";

import { Calendar } from "lucide-react";
import {
  VisionBoardCard,
  visionSaveLabel,
} from "@/components/vision-board/VisionBoardCard";
import {
  useStableSaveCallback,
  useVisionBoardItem,
  useVisionTextField,
} from "@/hooks/useVisionBoard";
import { useLocale } from "@/contexts/locale-context";

export function FutureCalendar() {
  const { t } = useLocale();
  const { save, row, isLoading } = useVisionBoardItem("future_calendar");
  const stableSave = useStableSaveCallback(save);
  const { text, setText, saveStatus, hydrated } = useVisionTextField(
    row ?? null,
    isLoading,
    stableSave
  );

  return (
    <VisionBoardCard
      icon={Calendar}
      title={t.vision.futureTitle}
      subtitle={t.vision.futureDesc}
      saveStatus={visionSaveLabel(saveStatus, t.vision)}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!hydrated || isLoading}
        rows={8}
        placeholder={t.vision.placeholder}
        className="min-h-[180px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
      />
    </VisionBoardCard>
  );
}
