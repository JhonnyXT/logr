"use client";

import { useState } from "react";
import { ListChecks } from "lucide-react";
import { VisionBoardCard } from "@/components/vision-board/VisionBoardCard";
import { Button } from "@/components/ui/button";
import { useBucketListItems } from "@/hooks/useVisionBoard";
import { useLocale } from "@/contexts/locale-context";

export function BucketList() {
  const { t } = useLocale();
  const { items, isLoading, addItem, toggleDone } = useBucketListItems();
  const [draft, setDraft] = useState("");

  const doneCount = items.filter((i) => i.is_done).length;
  const total = items.length;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    await addItem.mutateAsync(draft);
    setDraft("");
  }

  return (
    <VisionBoardCard
      icon={ListChecks}
      title={t.vision.bucketTitle}
      subtitle={`${doneCount}/${total} ${t.vision.completedOf}`}
      saveStatus="Los cambios se guardan al instante"
    >
      <ul className="space-y-2">
        {isLoading ? (
          <li className="text-sm text-muted">Cargando…</li>
        ) : items.length === 0 ? (
          <li className="text-sm text-muted">Añade experiencias que quieras vivir.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={item.is_done}
                onChange={(e) =>
                  void toggleDone.mutateAsync({
                    id: item.id,
                    isDone: e.target.checked,
                  })
                }
                disabled={toggleDone.isPending}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-accent focus:ring-accent/40"
              />
              <span
                className={
                  item.is_done
                    ? "text-sm text-muted line-through"
                    : "text-sm text-foreground"
                }
              >
                {item.title ?? "Sin título"}
              </span>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={(e) => void handleAdd(e)} className="flex gap-2 pt-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.vision.bucketAdd}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={addItem.isPending || !draft.trim()}
        >
          {t.vision.bucketAddBtn}
        </Button>
      </form>
    </VisionBoardCard>
  );
}
