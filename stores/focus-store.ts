import { create } from "zustand";
import type { FocusDuration, FocusTheme } from "@/types/focus";

interface FocusState {
  isRunning: boolean;
  isPaused: boolean;
  duration: FocusDuration;
  secondsRemaining: number;
  theme: FocusTheme;
  taskId: string | null;
  sessionId: string | null;

  start: (duration: FocusDuration, taskId?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: () => void;
  setTheme: (theme: FocusTheme) => void;
  setSessionId: (id: string) => void;
  setDuration: (duration: FocusDuration) => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  isRunning: false,
  isPaused: false,
  duration: 25,
  secondsRemaining: 25 * 60,
  theme: "minimal",
  taskId: null,
  sessionId: null,

  start: (duration, taskId) =>
    set({
      isRunning: true,
      isPaused: false,
      duration,
      secondsRemaining: duration * 60,
      taskId: taskId ?? null,
    }),

  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
  stop: () =>
    set({
      isRunning: false,
      isPaused: false,
      secondsRemaining: 0,
      taskId: null,
      sessionId: null,
    }),

  tick: () =>
    set((state) => {
      if (!state.isRunning || state.isPaused) return state;
      if (state.secondsRemaining <= 1) {
        return { secondsRemaining: 0, isRunning: false };
      }
      return { secondsRemaining: state.secondsRemaining - 1 };
    }),

  setTheme: (theme) => set({ theme }),
  setSessionId: (id) => set({ sessionId: id }),

  setDuration: (duration) =>
    set((state) => {
      if (state.isRunning) return state;
      return { duration, secondsRemaining: duration * 60 };
    }),
}));
