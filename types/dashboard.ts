import type { RankName } from "@/types/gamification";

/** Perfil de usuario para el shell del dashboard (coincide con `profiles` en Supabase). */
export interface DashboardUserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  current_rank: RankName | string;
  current_streak: number;
}

export interface DashboardDailyStats {
  streak: number;
  habitsToday: number;
  tasksToday: number;
  focusMinToday: number;
}
