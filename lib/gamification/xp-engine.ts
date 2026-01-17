// XP and Level calculation engine for NathanIs Enchanted Hub

export const XP_REWARDS = {
  TASK_COMPLETE: 10,
  AIM_COMPLETE: 100,
  GAME_COMPLETE: 75,
  JOURNAL_ENTRY: 15,
  RESOURCE_ADD: 5,
  STREAK_DAY: 20,
  FRIEND_MADE: 25,
  BLUEPRINT_SHARE: 50,
  BLUEPRINT_CLONE: 10,
} as const

// Level thresholds - XP needed to reach each level
// Uses a gradual curve: Level N requires N * 100 XP from previous level
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0
  // Formula: Sum of (i * 100) for i from 1 to level-1
  // Simplified: ((level-1) * level / 2) * 100
  return (((level - 1) * level) / 2) * 100
}

export function getLevelFromXp(xp: number): number {
  // Inverse of the XP formula
  // level = floor((1 + sqrt(1 + 8*xp/100)) / 2)
  return Math.floor((1 + Math.sqrt(1 + (8 * xp) / 100)) / 2)
}

export function getXpProgress(xp: number): {
  currentLevel: number
  nextLevel: number
  currentLevelXp: number
  nextLevelXp: number
  progress: number
  xpToNextLevel: number
} {
  const currentLevel = getLevelFromXp(xp)
  const nextLevel = currentLevel + 1
  const currentLevelXp = getXpForLevel(currentLevel)
  const nextLevelXp = getXpForLevel(nextLevel)
  const xpInCurrentLevel = xp - currentLevelXp
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp
  const progress = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100))

  return {
    currentLevel,
    nextLevel,
    currentLevelXp,
    nextLevelXp,
    progress,
    xpToNextLevel: nextLevelXp - xp,
  }
}

// Get display title based on level
export function getLevelTitle(level: number): string {
  if (level >= 50) return "Legendary"
  if (level >= 40) return "Master"
  if (level >= 30) return "Expert"
  if (level >= 25) return "Elite"
  if (level >= 20) return "Veteran"
  if (level >= 15) return "Advanced"
  if (level >= 10) return "Intermediate"
  if (level >= 5) return "Apprentice"
  return "Beginner"
}

// Get level color based on tier
export function getLevelColor(level: number): string {
  if (level >= 50) return "text-amber-500" // Gold
  if (level >= 40) return "text-purple-500" // Purple
  if (level >= 30) return "text-blue-500" // Blue
  if (level >= 20) return "text-emerald-500" // Green
  if (level >= 10) return "text-cyan-500" // Cyan
  return "text-muted-foreground" // Default
}
