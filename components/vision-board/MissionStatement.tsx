"use client";

import { Compass } from "lucide-react";
import {
  VisionBoardCard,
  visionSaveLabel,
} from "@/components/vision-board/VisionBoardCard";
import {
  useStableSaveCallback,
  useVisionBoardItem,
  useVisionTextField,
} from "@/hooks/useVisionBoard";

export function MissionStatement() {
  const { save, row, isLoading } = useVisionBoardItem("mission_statement");
  const stableSave = useStableSaveCallback(save);
  const { text, setText, saveStatus, hydrated } = useVisionTextField(
    row ?? null,
    isLoading,
    stableSave
  );

  return (
    <VisionBoardCard
      icon={Compass}
      title="Tu Misión"
      subtitle="Tu propósito en la vida"
      saveStatus={visionSaveLabel(saveStatus)}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!hydrated || isLoading}
        rows={6}
        placeholder="Tu misión personal en uno o dos párrafos…"
        className="min-h-[140px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
      />
    </VisionBoardCard>
  );
}
