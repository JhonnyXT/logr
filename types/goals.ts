export type GoalCategory =
  | "career"
  | "health"
  | "financial"
  | "relationships"
  | "growth";

export type GoalHorizon = "quarterly" | "1year" | "3years";

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  horizon: GoalHorizon;
  progress: number;
  targetDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  title: string;
  isDone: boolean;
  dueDate?: string;
  xpReward: number;
  createdAt: string;
}

export interface GoalWithMilestones extends Goal {
  milestones: GoalMilestone[];
}
