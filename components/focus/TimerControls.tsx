"use client";

import { Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { FOCUS_DURATIONS } from "@/types/focus";
import type { FocusDuration } from "@/types/focus";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  duration: FocusDuration;
  onDurationChange: (d: FocusDuration) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  duration,
  onDurationChange,
  onPause,
  onResume,
  onStop,
}: TimerControlsProps) {
  if (!isRunning) {
    return (
      <div className="flex w-full max-w-xl flex-col items-center gap-3">
        <p className="text-sm font-medium text-muted">Seleccionar duración</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
        {FOCUS_DURATIONS.map(({ value, label }) => (
          <Button
            key={value}
            type="button"
            variant={duration === value ? "accent" : "outline"}
            size="sm"
            className={cn(
              "min-w-[4.5rem]",
              duration === value && "shadow-[0_0_20px_-4px_rgba(0,233,106,0.45)]"
            )}
            onClick={() => onDurationChange(value)}
          >
            {label}
          </Button>
        ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {isPaused ? (
        <Button
          type="button"
          variant="accent"
          size="lg"
          className="gap-2"
          onClick={onResume}
        >
          <Play className="h-5 w-5" aria-hidden />
          Continuar
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={onPause}
        >
          <Pause className="h-5 w-5" aria-hidden />
          Pausar
        </Button>
      )}
      <Button
        type="button"
        variant="destructive"
        size="lg"
        className="gap-2"
        onClick={onStop}
      >
        <Square className="h-4 w-4 fill-current" aria-hidden />
        Detener
      </Button>
    </div>
  );
}
