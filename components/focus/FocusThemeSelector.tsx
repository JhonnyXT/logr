"use client";

import { Code2, Coffee, Leaf, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import type { FocusTheme } from "@/types/focus";
import { FOCUS_THEMES } from "@/types/focus";
import { useLocale } from "@/contexts/locale-context";

const THEME_ICONS: Record<FocusTheme, typeof Sparkles> = {
  minimal: Sparkles,
  cozy: Coffee,
  developer: Code2,
  nature: Leaf,
};

export function FocusThemeSelector() {
  const { theme, setTheme } = useFocusTimer();
  const { t } = useLocale();

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <p className="text-center text-sm font-medium text-muted">{t.focus.theme}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {FOCUS_THEMES.map(({ value, label }) => {
        const Icon = THEME_ICONS[value];
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
              active
                ? "border-accent bg-accent/10 shadow-[0_0_24px_-8px_rgba(0,233,106,0.35)]"
                : "border-border bg-background/40 hover:border-border/80 hover:bg-foreground/[0.03]"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                active ? "text-accent" : "text-muted"
              )}
              aria-hidden
            />
            <span
              className={cn(
                "text-sm font-medium",
                active ? "text-foreground" : "text-muted"
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
