import type { XpSource } from "@/types/gamification";

export const XP_REWARDS: Record<string, number> = {
  habit_complete: 10,
  task_complete: 15,
  task_main_complete: 25,
  focus_session: 20,
  journal_entry: 15,
  milestone_complete: 30,
  weekly_reset: 50,
  streak_7: 75,
  streak_30: 200,
} as const;

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level, 1.8));
}

export function levelFromXp(totalXp: number): number {
  if (totalXp <= 0) return 1;
  return Math.max(1, Math.floor(Math.pow(totalXp / 100, 1 / 1.8)));
}

export function xpProgress(totalXp: number) {
  const currentLevel = levelFromXp(totalXp);
  const xpAtCurrent = xpForLevel(currentLevel);
  const xpAtNext = xpForLevel(currentLevel + 1);
  const xpInLevel = totalXp - xpAtCurrent;
  const xpNeeded = xpAtNext - xpAtCurrent;
  const percent = xpNeeded > 0 ? Math.min(100, Math.floor((xpInLevel / xpNeeded) * 100)) : 100;

  return {
    currentLevel,
    xpInLevel,
    xpNeeded,
    percent,
    totalXp,
  };
}

export function getXpReward(action: string): number {
  return XP_REWARDS[action] ?? 0;
}

export function mapSourceToAction(source: XpSource, isMain?: boolean): string {
  switch (source) {
    case "habit":
      return "habit_complete";
    case "task":
      return isMain ? "task_main_complete" : "task_complete";
    case "focus":
      return "focus_session";
    case "journal":
      return "journal_entry";
    case "milestone":
      return "milestone_complete";
    case "weekly_reset":
      return "weekly_reset";
    case "system":
      return "system";
    default:
      return source;
  }
}
