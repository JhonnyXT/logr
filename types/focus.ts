export type FocusDuration = 15 | 25 | 45 | 60 | 90;
export type FocusTheme = "minimal" | "cozy" | "developer" | "nature";

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  durationMin: FocusDuration;
  theme: FocusTheme;
  isCompleted: boolean;
  startedAt: string;
  endedAt?: string;
  xpReward: number;
}

export const FOCUS_DURATIONS: { value: FocusDuration; label: string }[] = [
  { value: 15, label: "15 min" },
  { value: 25, label: "25 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
];

export const FOCUS_THEMES: { value: FocusTheme; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "cozy", label: "Cozy" },
  { value: "developer", label: "Developer" },
  { value: "nature", label: "Nature" },
];
