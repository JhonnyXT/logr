import type { RankName, RankTier } from "@/types/gamification";

export const RANK_TIERS: RankTier[] = [
  { name: "Novato", minLevel: 1, maxLevel: 11, color: "#6b7280" },
  { name: "Devoto", minLevel: 12, maxLevel: 23, color: "#3b82f6" },
  { name: "Estrella", minLevel: 24, maxLevel: 35, color: "#8b5cf6" },
  { name: "Triunfador", minLevel: 36, maxLevel: 41, color: "#06b6d4" },
  { name: "Eterno", minLevel: 42, maxLevel: 53, color: "#00e96a" },
  { name: "Leyenda", minLevel: 54, maxLevel: 63, color: "#f59e0b" },
  { name: "Mítico", minLevel: 64, maxLevel: 73, color: "#ef4444" },
  { name: "Trascendente", minLevel: 74, maxLevel: 82, color: "#ec4899" },
  { name: "Paradigma", minLevel: 83, maxLevel: 89, color: "#f97316" },
  { name: "Ascendente", minLevel: 90, maxLevel: 94, color: "#14b8a6" },
  { name: "Inmortal", minLevel: 95, maxLevel: 98, color: "#a855f7" },
  { name: "Apex", minLevel: 99, maxLevel: 100, color: "#fbbf24" },
];

export function getRankForLevel(level: number): RankTier {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (level >= RANK_TIERS[i].minLevel) return RANK_TIERS[i];
  }
  return RANK_TIERS[0];
}

export function getRankName(level: number): RankName {
  return getRankForLevel(level).name;
}

export function getRankColor(level: number): string {
  return getRankForLevel(level).color;
}
