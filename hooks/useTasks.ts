"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Task, TaskPriority } from "@/types/tasks";

function mapTaskRow(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    description: (row.description as string | null) ?? undefined,
    priority: row.priority as TaskPriority,
    isUrgent: Boolean(row.is_urgent),
    isImportant: Boolean(row.is_important),
    isMainTask: Boolean(row.is_main_task),
    tags: (row.tags as string[] | null) ?? [],
    dueDate: (row.due_date as string | null) ?? undefined,
    goalId: (row.goal_id as string | null) ?? undefined,
    xpReward: (row.xp_reward as number) ?? 15,
    completedAt: (row.completed_at as string | null) ?? undefined,
    createdAt: row.created_at as string,
  };
}

export function useTasks() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .is("completed_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => mapTaskRow(row as Record<string, unknown>));
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createTask = useMutation({
    mutationFn: async (
      task: Pick<Task, "title" | "priority" | "isUrgent" | "isImportant" | "tags" | "dueDate">
    ) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title: task.title,
        priority: task.priority,
        is_urgent: task.isUrgent,
        is_important: task.isImportant,
        tags: task.tags,
        due_date: task.dueDate,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const setMainTask = useMutation({
    mutationFn: async (taskId: string) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");
      await supabase
        .from("tasks")
        .update({ is_main_task: false })
        .eq("user_id", user.id)
        .eq("is_main_task", true);
      await supabase
        .from("tasks")
        .update({ is_main_task: true })
        .eq("id", taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    completeTask,
    createTask,
    setMainTask,
  };
}
