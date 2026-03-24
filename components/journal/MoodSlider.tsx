"use client";

import { MOOD_EMOJIS } from "@/types/journal";
import { cn } from "@/lib/utils/cn";

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function MoodSlider({
  value,
  onChange,
  disabled,
  className,
}: MoodSliderProps) {
  const emoji = MOOD_EMOJIS[value] ?? MOOD_EMOJIS[5];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-6">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          Estado de ánimo
        </span>
        <div className="flex items-center gap-4">
          <span
            className="text-5xl leading-none transition-transform duration-200"
            aria-hidden
          >
            {emoji}
          </span>
          <div className="text-center sm:text-right">
            <p className="font-mono text-3xl font-semibold tabular-nums text-accent">
              {value}
              <span className="text-lg font-medium text-muted">/10</span>
            </p>
            <p className="text-xs text-muted">¿Cómo te sientes?</p>
          </div>
        </div>
      </div>

      <div className="relative pt-1">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "h-2 w-full cursor-pointer appearance-none rounded-full bg-border",
            "accent-accent",
            "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(0,233,106,0.45)]",
            "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent",
            disabled && "cursor-not-allowed opacity-50"
          )}
          style={{
            background: `linear-gradient(to right, rgb(0 233 106 / 0.45) 0%, rgb(0 233 106 / 0.45) ${((value - 1) / 9) * 100}%, rgb(30 45 64) ${((value - 1) / 9) * 100}%, rgb(30 45 64) 100%)`,
          }}
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={value}
          aria-label="Estado de ánimo del 1 al 10"
        />
        <div className="mt-2 flex justify-between px-0.5 text-[10px] font-medium text-muted">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
