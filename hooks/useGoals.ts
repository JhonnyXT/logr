"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  GoalCategory,
  GoalHorizon,
  GoalMilestone,
  GoalWithMilestones,
} from "@/types/goals";

function mapGoal(row: Record<string, unknown>): GoalWithMilestones {
  const milestonesRaw = row.goal_milestones as Record<string, unknown>[] | undefined;
  const milestones: GoalMilestone[] = (milestonesRaw ?? []).map((m) => ({
    id: m.id as string,
    goalId: m.goal_id as string,
    title: m.title as string,
    isDone: Boolean(m.is_done),
    dueDate: (m.due_date as string | null) ?? undefined,
    xpReward: (m.xp_reward as number) ?? 30,
    createdAt: m.created_at as string,
  }));

  milestones.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    description: (row.description as string | null) ?? undefined,
    category: row.category as GoalCategory,
    horizon: row.horizon as GoalHorizon,
    progress: (row.progress as number) ?? 0,
    targetDate: (row.target_date as string | null) ?? undefined,
    isCompleted: Boolean(row.is_completed),
    createdAt: row.created_at as string,
    milestones,
  };
}

async function recomputeGoalProgress(
  supabase: ReturnType<typeof createClient>,
  goalId: string
) {
  const { data: ms, error: msError } = await supabase
    .from("goal_milestones")
    .select("is_done")
    .eq("goal_id", goalId);
  if (msError) throw msError;
  const list = ms ?? [];
  const pct =
    list.length === 0
      ? 0
      : Math.round(
          (list.filter((m) => (m as { is_done: boolean }).is_done).length /
            list.length) *
            100
        );
  const { error } = await supabase.from("goals").update({ progress: pct }).eq("id", goalId);
  if (error) throw error;
}

export function useGoals(enabled = true) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const goalsQuery = useQuery({
    queryKey: ["goals"],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select(
          `
          *,
          goal_milestones (*)
        `
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => mapGoal(row as Record<string, unknown>));
    },
  });

  const createGoal = useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string;
      category: GoalCategory;
      horizon: GoalHorizon;
      targetDate?: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        category: input.category,
        horizon: input.horizon,
        target_date: input.targetDate || null,
        progress: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const addMilestone = useMutation({
    mutationFn: async ({ goalId, title }: { goalId: string; title: string }) => {
      const { error } = await supabase.from("goal_milestones").insert({
        goal_id: goalId,
        title: title.trim(),
      });
      if (error) throw error;
      await recomputeGoalProgress(supabase, goalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const toggleMilestone = useMutation({
    mutationFn: async ({
      goalId,
      milestoneId,
      isDone,
    }: {
      goalId: string;
      milestoneId: string;
      isDone: boolean;
    }) => {
      const { error } = await supabase
        .from("goal_milestones")
        .update({ is_done: isDone })
        .eq("id", milestoneId);
      if (error) throw error;
      await recomputeGoalProgress(supabase, goalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  return {
    goals: goalsQuery.data ?? [],
    isLoading: goalsQuery.isLoading,
    createGoal,
    addMilestone,
    toggleMilestone,
  };
}
