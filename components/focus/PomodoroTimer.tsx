"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startOfDay, endOfDay } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { FocusThemeSelector } from "@/components/focus/FocusThemeSelector";
import { TimerControls } from "@/components/focus/TimerControls";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import { useXp } from "@/hooks/useXp";
import { cn } from "@/lib/utils/cn";
import type { FocusTheme } from "@/types/focus";
import { useLocale } from "@/contexts/locale-context";

const FOCUS_STATS_KEY = ["focus-stats-today"] as const;

const THEME_BACKDROP: Record<FocusTheme, string> = {
  minimal:
    "bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,233,106,0.06),transparent_55%)]",
  cozy:
    "bg-[radial-gradient(ellipse_70%_50%_at_50%_45%,rgba(251,191,36,0.08),transparent_55%)]",
  developer:
    "bg-[linear-gradient(rgba(30,41,59,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.35)_1px,transparent_1px)] bg-[size:24px_24px]",
  nature:
    "bg-[radial-gradient(ellipse_75%_55%_at_50%_42%,rgba(16,185,129,0.1),transparent_58%)]",
};

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

async function fetchFocusStatsToday(): Promise<{
  sessions: number;
  totalMin: number;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { sessions: 0, totalMin: 0 };

  const start = startOfDay(new Date()).toISOString();
  const end = endOfDay(new Date()).toISOString();

  const { data, error } = await supabase
    .from("focus_sessions")
    .select("duration_min")
    .eq("user_id", user.id)
    .eq("is_completed", true)
    .gte("started_at", start)
    .lte("started_at", end);

  if (error) throw error;
  const rows = data ?? [];
  return {
    sessions: rows.length,
    totalMin: rows.reduce((acc, r) => acc + (r.duration_min ?? 0), 0),
  };
}

export function PomodoroTimer() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const completionHandled = useRef(false);
  const {
    isRunning,
    isPaused,
    duration,
    secondsRemaining,
    theme,
    sessionId,
    startSession,
    completeSession,
    pause,
    resume,
    stop,
    setDuration,
  } = useFocusTimer();
  const { awardXp } = useXp();

  const { data: stats } = useQuery({
    queryKey: FOCUS_STATS_KEY,
    queryFn: fetchFocusStatsToday,
  });

  const displaySeconds = useMemo(() => {
    if (isRunning) return secondsRemaining;
    if (secondsRemaining > 0) return secondsRemaining;
    return duration * 60;
  }, [isRunning, secondsRemaining, duration]);

  const totalSeconds = duration * 60;
  const progress = useMemo(() => {
    if (!isRunning) return 1;
    return Math.max(0, Math.min(1, secondsRemaining / totalSeconds));
  }, [isRunning, secondsRemaining, totalSeconds]);

  const size = 280;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - progress);

  useEffect(() => {
    if (secondsRemaining !== 0 || isRunning || !sessionId) {
      if (secondsRemaining > 0 || isRunning) {
        completionHandled.current = false;
      }
      return;
    }
    if (completionHandled.current) return;
    completionHandled.current = true;

    const sid = sessionId;
    void (async () => {
      await completeSession();
      await awardXp(20, "focus", sid ?? undefined, "¡Sesión de enfoque completada!");
      await queryClient.invalidateQueries({ queryKey: FOCUS_STATS_KEY });
    })();
  }, [
    secondsRemaining,
    isRunning,
    sessionId,
    completeSession,
    awardXp,
    queryClient,
  ]);

  const sessionsToday = stats?.sessions ?? 0;
  const totalFocusMinToday = stats?.totalMin ?? 0;

  return (
    <div className="relative flex flex-col items-center gap-10">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-[2rem] opacity-90 transition-opacity duration-500",
          THEME_BACKDROP[theme]
        )}
        aria-hidden
      />

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 transform"
            aria-hidden
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              className="text-border"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={dashOffset}
              className="text-accent transition-[stroke-dashoffset] duration-1000 ease-linear"
              style={{
                filter: "drop-shadow(0 0 12px rgba(0, 233, 106, 0.35))",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span
              className="font-mono text-5xl font-semibold tabular-nums tracking-tight text-foreground sm:text-6xl"
              aria-live="polite"
            >
              {formatClock(displaySeconds)}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              {isRunning
                ? isPaused
                  ? t.focus.statePaused
                  : t.focus.stateFocusing
                : t.focus.stateReady}
            </span>
          </div>
        </div>

        {!isRunning ? (
          <Button
            type="button"
            variant="accent"
            size="lg"
            className="min-w-[200px] shadow-[0_0_32px_-8px_rgba(0,233,106,0.55)]"
            onClick={() => startSession(duration)}
          >
            {t.focus.startSession}
          </Button>
        ) : null}

        <TimerControls
          isRunning={isRunning}
          isPaused={isPaused}
          duration={duration}
          onDurationChange={setDuration}
          onPause={pause}
          onResume={resume}
          onStop={stop}
        />

        {!isRunning ? <FocusThemeSelector /> : null}
      </div>

      <div className="grid w-full max-w-md grid-cols-2 gap-4 text-center">
        <div className="rounded-xl border border-border bg-surface/80 px-4 py-3 backdrop-blur-sm">
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {sessionsToday}
          </p>
          <p className="text-xs font-medium text-muted">{t.focus.sessionsToday}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface/80 px-4 py-3 backdrop-blur-sm">
          <p className="text-2xl font-semibold tabular-nums text-accent">
            {totalFocusMinToday}
            <span className="text-sm font-medium text-muted"> min</span>
          </p>
          <p className="text-xs font-medium text-muted">{t.focus.focusTime}</p>
        </div>
      </div>
    </div>
  );
}
