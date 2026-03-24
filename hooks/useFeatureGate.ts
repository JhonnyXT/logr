import { isFeatureUnlocked, getRequiredLevel } from "@/lib/gamification/level-gates";
import type { FeatureKey } from "@/types/gamification";

export function useFeatureGate(featureKey: FeatureKey, userLevel: number) {
  return {
    isUnlocked: isFeatureUnlocked(featureKey, userLevel),
    requiredLevel: getRequiredLevel(featureKey),
    currentLevel: userLevel,
  };
}
