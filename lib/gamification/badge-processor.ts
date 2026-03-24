import type { Badge } from "@/types/gamification";

export interface BadgeCondition {
  type: "streak" | "level" | "count" | "special";
  value: number;
  source?: string;
}

export function evaluateBadge(
  badge: Badge,
  userStats: {
    level: number;
    streak: number;
    habitsCompleted: number;
    tasksCompleted: number;
    focusMinutes: number;
    journalEntries: number;
  }
): boolean {
  const condition = badge.condition as unknown as BadgeCondition;

  switch (condition.type) {
    case "streak":
      return userStats.streak >= condition.value;
    case "level":
      return userStats.level >= condition.value;
    case "count": {
      const source = condition.source ?? "";
      const countMap: Record<string, number> = {
        habit: userStats.habitsCompleted,
        task: userStats.tasksCompleted,
        focus: userStats.focusMinutes,
        journal: userStats.journalEntries,
      };
      return (countMap[source] ?? 0) >= condition.value;
    }
    default:
      return false;
  }
}
