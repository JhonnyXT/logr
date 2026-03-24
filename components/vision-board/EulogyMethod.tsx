"use client";

import { Scroll } from "lucide-react";
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

export function EulogyMethod() {
  const { t } = useLocale();
  const { save, row, isLoading } = useVisionBoardItem("eulogy");
  const stableSave = useStableSaveCallback(save);
  const { text, setText, saveStatus, hydrated } = useVisionTextField(
    row ?? null,
    isLoading,
    stableSave
  );

  return (
    <VisionBoardCard
      icon={Scroll}
      title={t.vision.eulogyTitle}
      subtitle={t.vision.eulogyDesc}
      saveStatus={visionSaveLabel(saveStatus, t.vision)}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!hydrated || isLoading}
        rows={10}
        placeholder={t.vision.placeholder}
        className="min-h-[200px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
      />
    </VisionBoardCard>
  );
}
