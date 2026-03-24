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

export function EulogyMethod() {
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
      title="El Método Eulogy"
      subtitle="¿Cómo quieres ser recordado?"
      saveStatus={visionSaveLabel(saveStatus)}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!hydrated || isLoading}
        rows={10}
        placeholder="Escribe la historia que esperas que otros cuenten sobre tu vida…"
        className="min-h-[200px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
      />
    </VisionBoardCard>
  );
}
