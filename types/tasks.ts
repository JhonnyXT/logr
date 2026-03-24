export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  isUrgent: boolean;
  isImportant: boolean;
  isMainTask: boolean;
  tags: string[];
  dueDate?: string;
  goalId?: string;
  xpReward: number;
  completedAt?: string;
  createdAt: string;
}

export type EisenhowerQuadrant =
  | "do_first"
  | "schedule"
  | "delegate"
  | "eliminate";

export function getQuadrant(task: Task): EisenhowerQuadrant {
  if (task.isUrgent && task.isImportant) return "do_first";
  if (!task.isUrgent && task.isImportant) return "schedule";
  if (task.isUrgent && !task.isImportant) return "delegate";
  return "eliminate";
}
