"use server"

import { createClient } from "@/lib/supabase/server"
import { XP_REWARDS, getLevelFromXp } from "@/lib/gamification/xp-engine"

export type XpEventType = keyof typeof XP_REWARDS

export async function addXp(eventType: XpEventType): Promise<{
  success: boolean
  xpGained: number
  newTotal: number
  leveledUp: boolean
  newLevel: number
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, xpGained: 0, newTotal: 0, leveledUp: false, newLevel: 0 }
  }

  const xpGained = XP_REWARDS[eventType]

  // Get current stats
  const { data: currentStats } = await supabase.from("user_stats").select("xp, level").eq("user_id", user.id).single()

  const currentXp = currentStats?.xp || 0
  const currentLevel = currentStats?.level || 1
  const newTotal = currentXp + xpGained
  const newLevel = getLevelFromXp(newTotal)
  const leveledUp = newLevel > currentLevel

  // Update stats
  const { error } = await supabase.from("user_stats").upsert(
    {
      user_id: user.id,
      xp: newTotal,
      level: newLevel,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  )

  if (error) {
    console.error("Failed to update XP:", error)
    return { success: false, xpGained: 0, newTotal: currentXp, leveledUp: false, newLevel: currentLevel }
  }

  // Create level up notification if applicable
  if (leveledUp) {
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "level_up",
      title: "Level Up!",
      message: `Congratulations! You've reached Level ${newLevel}!`,
      data: { level: newLevel },
    })
  }

  return { success: true, xpGained, newTotal, leveledUp, newLevel }
}

export async function updateStreak(): Promise<{
  success: boolean
  currentStreak: number
  isNewStreak: boolean
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, currentStreak: 0, isNewStreak: false }
  }

  const today = new Date().toISOString().split("T")[0]

  // Get current stats
  const { data: currentStats } = await supabase
    .from("user_stats")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("user_id", user.id)
    .single()

  let newStreak = 1
  let isNewStreak = false

  if (currentStats) {
    const lastActivity = currentStats.last_activity_date

    if (lastActivity === today) {
      // Already logged activity today
      return { success: true, currentStreak: currentStats.current_streak, isNewStreak: false }
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    if (lastActivity === yesterdayStr) {
      // Continuing streak
      newStreak = currentStats.current_streak + 1
      isNewStreak = true
    } else {
      // Streak broken, starting fresh
      newStreak = 1
      isNewStreak = true
    }
  }

  const longestStreak = Math.max(newStreak, currentStats?.longest_streak || 0)

  // Update stats
  await supabase.from("user_stats").upsert(
    {
      user_id: user.id,
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  )

  // Award streak XP if continuing
  if (isNewStreak && newStreak > 1) {
    await addXp("STREAK_DAY")
  }

  return { success: true, currentStreak: newStreak, isNewStreak }
}

export async function incrementStat(
  statField: "total_tasks_completed" | "total_aims_completed" | "total_games_completed" | "total_journal_entries",
): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  // Get current value
  const { data: currentStats } = await supabase.from("user_stats").select(statField).eq("user_id", user.id).single()

  const currentValue = currentStats?.[statField] || 0

  await supabase.from("user_stats").upsert(
    {
      user_id: user.id,
      [statField]: currentValue + 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  )
}
