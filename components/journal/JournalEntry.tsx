"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodSlider } from "@/components/journal/MoodSlider";
import { ReflectionPrompt } from "@/components/journal/ReflectionPrompt";
import { useJournal } from "@/hooks/useJournal";
import { useXp } from "@/hooks/useXp";
import { cn } from "@/lib/utils/cn";
import type { JournalEntry as JournalEntryRecord } from "@/types/journal";
import {
  EVENING_PROMPTS,
  MORNING_PROMPTS,
  type JournalEntryType,
} from "@/types/journal";

interface JournalEntryProps {
  entryType: JournalEntryType;
  className?: string;
}

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function findEntry(
  entries: JournalEntryRecord[],
  type: JournalEntryType
): (JournalEntryRecord & Record<string, unknown>) | undefined {
  for (const e of entries) {
    const row = e as unknown as Record<string, unknown>;
    const t = (row.entry_type ?? row.entryType) as string | undefined;
    if (t === type) return e as JournalEntryRecord & Record<string, unknown>;
  }
  return undefined;
}

function getMood(entry: Record<string, unknown> | undefined): number {
  const raw = entry?.mood_score ?? entry?.moodScore;
  if (typeof raw === "number" && raw >= 1 && raw <= 10) return raw;
  return 5;
}

function getContent(entry: Record<string, unknown> | undefined): string {
  const c = entry?.content;
  return typeof c === "string" ? c : "";
}

function getPromptUsed(entry: Record<string, unknown> | undefined): string | undefined {
  const p = entry?.prompt_used ?? entry?.promptUsed;
  return typeof p === "string" ? p : undefined;
}

export function JournalEntry({ entryType, className }: JournalEntryProps) {
  const prompts = entryType === "morning" ? MORNING_PROMPTS : EVENING_PROMPTS;
  const { entries, isLoading, saveEntry } = useJournal();
  const { awardXp } = useXp();

  const existing = useMemo(
    () => findEntry(entries, entryType),
    [entries, entryType]
  );

  const [mood, setMood] = useState(5);
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState(() => randomFrom(prompts));

  useEffect(() => {
    if (isLoading) return;
    if (!existing) return;
    const ex = existing as Record<string, unknown>;
    setMood(getMood(ex));
    setContent(getContent(ex));
    const saved = getPromptUsed(ex);
    setPrompt(saved ?? randomFrom(prompts));
  }, [isLoading, existing, prompts]);

  const handleSave = useCallback(async () => {
    await saveEntry.mutateAsync({
      entryType,
      moodScore: mood,
      content,
      promptUsed: prompt,
    });
    await awardXp(15, "journal", undefined, "¡Entrada guardada!");
  }, [saveEntry, entryType, mood, content, prompt, awardXp]);

  const Icon = entryType === "morning" ? Sun : Moon;
  const label =
    entryType === "morning" ? "Reflexión matutina" : "Reflexión nocturna";

  return (
    <Card
      className={cn(
        "border-border/80 bg-surface/90 shadow-none backdrop-blur-sm",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-base font-semibold tracking-tight">
              {label}
            </CardTitle>
            <p className="text-xs text-muted">
              {entryType === "morning"
                ? "Define tu intención del día"
                : "Cierra el día con gratitud y claridad"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReflectionPrompt
          prompts={prompts}
          prompt={prompt}
          onPromptChange={setPrompt}
        />

        <MoodSlider value={mood} onChange={setMood} disabled={isLoading} />

        <div className="space-y-2">
          <label
            htmlFor={`journal-${entryType}`}
            className="text-xs font-medium uppercase tracking-wider text-muted"
          >
            Tu reflexión
          </label>
          <textarea
            id={`journal-${entryType}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            rows={6}
            placeholder="Escribe tu reflexión..."
            className={cn(
              "w-full resize-y rounded-xl border border-border bg-background/60 px-4 py-3",
              "text-[15px] leading-relaxed text-foreground placeholder:text-muted",
              "focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="accent"
            size="md"
            disabled={isLoading || saveEntry.isPending}
            onClick={() => void handleSave()}
          >
            {saveEntry.isPending ? "Guardando…" : "Guardar entrada"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
