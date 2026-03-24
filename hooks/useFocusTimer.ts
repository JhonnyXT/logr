"use client";

import { useEffect, useRef, useCallback } from "react";
import { useFocusStore } from "@/stores/focus-store";
import { createClient } from "@/lib/supabase/client";
import type { FocusDuration } from "@/types/focus";

export function useFocusTimer() {
  const store = useFocusStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (store.isRunning && !store.isPaused) {
      intervalRef.current = setInterval(() => {
        store.tick();
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [store.isRunning, store.isPaused, store]);

  const startSession = useCallback(
    async (duration: FocusDuration, taskId?: string) => {
      const supabase = createClient();
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data } = await supabase
        .from("focus_sessions")
        .insert({
          user_id: user.id,
          task_id: taskId ?? null,
          duration_min: duration,
          theme: store.theme,
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (data) store.setSessionId(data.id);
      store.start(duration, taskId);
    },
    [store]
  );

  const completeSession = useCallback(async () => {
    if (!store.sessionId) return;
    const supabase = createClient();
    await supabase
      .from("focus_sessions")
      .update({
        is_completed: true,
        ended_at: new Date().toISOString(),
      })
      .eq("id", store.sessionId);
    store.stop();
  }, [store]);

  return {
    ...store,
    startSession,
    completeSession,
    formattedTime: formatTime(store.secondsRemaining),
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
