import type { Achievement, UserStats } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"

export type AchievementCheckResult = {
  newAchievements: Achievement[]
  xpEarned: number
}

export async function checkAndUnlockAchievements(userId: string, stats: UserStats): Promise<AchievementCheckResult> {
  const supabase = createClient()

  // Get all achievements
  const { data: allAchievements } = await supabase.from("achievements").select("*")

  // Get user's unlocked achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId)

  if (!allAchievements) return { newAchievements: [], xpEarned: 0 }

  const unlockedIds = new Set(userAchievements?.map((ua) => ua.achievement_id) || [])
  const newAchievements: Achievement[] = []
  let xpEarned = 0

  // Check each achievement
  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue

    let shouldUnlock = false

    switch (achievement.code) {
      // Task achievements
      case "first_task":
        shouldUnlock = stats.total_tasks_completed >= 1
        break
      case "task_10":
        shouldUnlock = stats.total_tasks_completed >= 10
        break
      case "task_50":
        shouldUnlock = stats.total_tasks_completed >= 50
        break
      case "task_100":
        shouldUnlock = stats.total_tasks_completed >= 100
        break

      // Aim achievements
      case "first_aim":
        // This is checked when creating an aim, not from stats
        break
      case "aim_complete":
      case "aim_5":
        shouldUnlock = stats.total_aims_completed >= achievement.threshold
        break

      // Game achievements
      case "first_game":
        // Checked when adding a game
        break
      case "game_complete":
      case "game_10":
        shouldUnlock = stats.total_games_completed >= achievement.threshold
        break

      // Journal achievements
      case "first_journal":
        shouldUnlock = stats.total_journal_entries >= 1
        break
      case "journal_7":
        shouldUnlock = stats.total_journal_entries >= 7
        break
      case "journal_30":
        shouldUnlock = stats.total_journal_entries >= 30
        break

      // Streak achievements
      case "streak_3":
        shouldUnlock = stats.current_streak >= 3 || stats.longest_streak >= 3
        break
      case "streak_7":
        shouldUnlock = stats.current_streak >= 7 || stats.longest_streak >= 7
        break
      case "streak_30":
        shouldUnlock = stats.current_streak >= 30 || stats.longest_streak >= 30
        break

      // Level achievements
      case "level_5":
        shouldUnlock = stats.level >= 5
        break
      case "level_10":
        shouldUnlock = stats.level >= 10
        break
      case "level_25":
        shouldUnlock = stats.level >= 25
        break
    }

    if (shouldUnlock) {
      // Unlock the achievement
      const { error } = await supabase
        .from("user_achievements")
        .insert({ user_id: userId, achievement_id: achievement.id })

      if (!error) {
        newAchievements.push(achievement)
        xpEarned += achievement.xp_reward
      }
    }
  }

  return { newAchievements, xpEarned }
}
