"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  Habit,
  HabitCompletion,
  HabitFrequency,
  HabitWithCompletions,
} from "@/types/habits";
import { toDateString } from "@/lib/utils/date";

function mapHabitRow(h: Record<string, unknown>): Habit {
  return {
    id: h.id as string,
    userId: h.user_id as string,
    title: h.title as string,
    description: (h.description as string | null) ?? undefined,
    icon: (h.icon as string) ?? "✅",
    color: (h.color as string) ?? "#00e96a",
    frequency: h.frequency as HabitFrequency,
    targetDays: (h.target_days as number[] | null) ?? [],
    xpReward: (h.xp_reward as number) ?? 10,
    githubSync: Boolean(h.github_sync),
    currentStreak: (h.current_streak as number) ?? 0,
    longestStreak: (h.longest_streak as number) ?? 0,
    isActive: (h.is_active as boolean) ?? true,
    createdAt: h.created_at as string,
  };
}

function mapCompletionRow(c: Record<string, unknown>): HabitCompletion {
  return {
    id: Number(c.id),
    habitId: c.habit_id as string,
    userId: c.user_id as string,
    completedAt: c.completed_at as string,
    isVacation: Boolean(c.is_vacation),
  };
}

export function useHabits() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const today = toDateString(new Date());

  const habitsQuery = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data: habits, error } = await supabase
        .from("habits")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      if (error) throw error;

      const { data: completions } = await supabase
        .from("habit_completions")
        .select("*")
        .gte("completed_at", today)
        .lte("completed_at", today);

      const completionMap = new Map<string, boolean>();
      for (const c of completions ?? []) {
        completionMap.set(c.habit_id, true);
      }

      return (habits ?? []).map((h) => {
        const row = h as Record<string, unknown>;
        const habit = mapHabitRow(row);
        const habitCompletions = (completions ?? [])
          .filter((c) => (c as { habit_id: string }).habit_id === habit.id)
          .map((c) => mapCompletionRow(c as Record<string, unknown>));
        return {
          ...habit,
          completions: habitCompletions,
          isCompletedToday: completionMap.has(habit.id),
        } satisfies HabitWithCompletions;
      });
    },
  });

  const toggleHabit = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      if (completed) {
        await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_at", today);
      } else {
        await supabase.from("habit_completions").insert({
          habit_id: habitId,
          user_id: (await supabase.auth.getUser()).data.user!.id,
          completed_at: today,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const createHabit = useMutation({
    mutationFn: async (habit: Omit<Habit, "id" | "userId" | "createdAt" | "currentStreak" | "longestStreak">) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("habits").insert({
        user_id: user.id,
        title: habit.title,
        description: habit.description,
        icon: habit.icon,
        color: habit.color,
        frequency: habit.frequency,
        target_days: habit.targetDays,
        xp_reward: habit.xpReward,
        github_sync: habit.githubSync,
        is_active: habit.isActive,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  return {
    habits: habitsQuery.data ?? [],
    isLoading: habitsQuery.isLoading,
    toggleHabit,
    createHabit,
  };
}
