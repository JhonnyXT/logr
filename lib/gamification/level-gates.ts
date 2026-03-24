import type { FeatureKey } from "@/types/gamification";

export const FEATURE_GATES: Record<FeatureKey, number> = {
  vision_board: 3,
  goals: 5,
  notes: 7,
} as const;

export function isFeatureUnlocked(
  featureKey: FeatureKey,
  userLevel: number
): boolean {
  return userLevel >= FEATURE_GATES[featureKey];
}

export function getRequiredLevel(featureKey: FeatureKey): number {
  return FEATURE_GATES[featureKey];
}
