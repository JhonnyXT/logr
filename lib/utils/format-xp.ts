export function formatXp(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K`;
  return xp.toLocaleString();
}

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.8));
}

export function levelFromXp(totalXp: number): number {
  return Math.max(1, Math.floor(Math.pow(totalXp / 100, 1 / 1.8)));
}

export function xpProgressInLevel(totalXp: number): {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpRequiredForNext: number;
  progressPercent: number;
} {
  const currentLevel = levelFromXp(totalXp);
  const xpAtCurrentLevel = xpForLevel(currentLevel);
  const xpAtNextLevel = xpForLevel(currentLevel + 1);
  const xpInCurrentLevel = totalXp - xpAtCurrentLevel;
  const xpRequiredForNext = xpAtNextLevel - xpAtCurrentLevel;
  const progressPercent = Math.min(
    100,
    Math.floor((xpInCurrentLevel / xpRequiredForNext) * 100)
  );

  return { currentLevel, xpInCurrentLevel, xpRequiredForNext, progressPercent };
}
