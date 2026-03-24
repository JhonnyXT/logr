export type RankName =
  | "Novato"
  | "Devoto"
  | "Estrella"
  | "Triunfador"
  | "Eterno"
  | "Leyenda"
  | "Mítico"
  | "Trascendente"
  | "Paradigma"
  | "Ascendente"
  | "Inmortal"
  | "Apex";

export type XpSource =
  | "habit"
  | "task"
  | "focus"
  | "journal"
  | "weekly_reset"
  | "badge"
  | "streak_bonus"
  | "milestone"
  | "system";

export interface RankTier {
  name: RankName;
  minLevel: number;
  maxLevel: number;
  color: string;
}

export interface XpTransaction {
  id: number;
  userId: string;
  amount: number;
  source: XpSource;
  sourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityDay {
  date: string;
  xpEarned: number;
  actionsCount: number;
}

export interface UserGamification {
  totalXp: number;
  currentLevel: number;
  currentRank: RankName;
  currentStreak: number;
  longestStreak: number;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl: string;
  category: "habit" | "focus" | "task" | "level" | "social" | "special";
  condition: Record<string, unknown>;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: string;
  badge: Badge;
}

export type FeatureKey = "vision_board" | "goals" | "notes";
