"use client";

import { useCallback } from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/contexts/locale-context";

interface ReflectionPromptProps {
  prompts: string[];
  prompt: string;
  onPromptChange: (next: string) => void;
  className?: string;
}

function pickRandom(prompts: string[], avoid?: string): string {
  if (prompts.length === 0) return "";
  if (prompts.length === 1) return prompts[0]!;
  let next = prompts[Math.floor(Math.random() * prompts.length)]!;
  let guard = 0;
  while (next === avoid && guard < 32) {
    next = prompts[Math.floor(Math.random() * prompts.length)]!;
    guard += 1;
  }
  return next;
}

export function ReflectionPrompt({
  prompts,
  prompt,
  onPromptChange,
  className,
}: ReflectionPromptProps) {
  const { t } = useLocale();
  const shuffle = useCallback(() => {
    onPromptChange(pickRandom(prompts, prompt));
  }, [prompts, prompt, onPromptChange]);

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-background/50 px-4 py-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <blockquote className="flex-1 border-l-2 border-accent/50 pl-4">
          <p className="text-xs font-medium text-muted">{t.journal.promptToday}</p>
          <p className="mt-1 text-sm italic leading-relaxed text-foreground/90">
            &ldquo;{prompt}&rdquo;
          </p>
        </blockquote>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1.5 text-muted hover:text-accent"
          onClick={shuffle}
        >
          <Shuffle className="h-4 w-4" aria-hidden />
          {t.journal.shufflePrompt}
        </Button>
      </div>
    </div>
  );
}
