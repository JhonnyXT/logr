export type HabitFrequency = "daily" | "weekdays" | "weekly" | "specific_days";

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  targetDays: number[];
  xpReward: number;
  githubSync: boolean;
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  createdAt: string;
}

export interface HabitCompletion {
  id: number;
  habitId: string;
  userId: string;
  completedAt: string;
  isVacation: boolean;
}

export interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[];
  isCompletedToday: boolean;
}
