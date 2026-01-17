import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Target, Gamepad2, CheckSquare, BookOpen, Trophy } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { XpProgressBar } from "@/components/gamification/xp-progress-bar"
import { StreakDisplay } from "@/components/gamification/streak-display"
import { DashboardClient } from "./dashboard-client"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [aimsResult, gamesResult, tasksResult, logsResult, statsResult, achievementsResult] = await Promise.all([
    supabase.from("aims").select("id, status, progress", { count: "exact" }).eq("user_id", user?.id),
    supabase.from("games").select("id, status", { count: "exact" }).eq("user_id", user?.id),
    supabase.from("tasks").select("id, status", { count: "exact" }).eq("user_id", user?.id),
    supabase.from("daily_logs").select("id", { count: "exact" }).eq("user_id", user?.id),
    supabase.from("user_stats").select("*").eq("user_id", user?.id).maybeSingle(),
    supabase.from("user_achievements").select("id", { count: "exact" }).eq("user_id", user?.id),
  ])

  let userStats = statsResult.data
  if (!userStats && user?.id) {
    const { data: newStats } = await supabase
      .from("user_stats")
      .insert({
        user_id: user.id,
        xp: 0,
        level: 1,
        current_streak: 0,
        longest_streak: 0,
        total_tasks_completed: 0,
        total_aims_completed: 0,
        total_games_completed: 0,
        total_journal_entries: 0,
      })
      .select()
      .single()
    userStats = newStats || { xp: 0, level: 1, current_streak: 0, longest_streak: 0 }
  }

  const activeAims = aimsResult.data?.filter((a) => a.status === "active").length || 0
  const totalAims = aimsResult.count || 0
  const avgProgress = aimsResult.data?.length
    ? Math.round(aimsResult.data.reduce((acc, a) => acc + (a.progress || 0), 0) / aimsResult.data.length)
    : 0

  const playingGames = gamesResult.data?.filter((g) => g.status === "playing").length || 0
  const completedGames = gamesResult.data?.filter((g) => g.status === "completed").length || 0

  const completedTasks = tasksResult.data?.filter((t) => t.status === "completed").length || 0
  const pendingTasks = tasksResult.data?.filter((t) => t.status === "pending" || t.status === "in_progress").length || 0

  const totalLogs = logsResult.count || 0

  const stats = userStats || { xp: 0, level: 1, current_streak: 0, longest_streak: 0 }
  const achievementsCount = achievementsResult.count || 0

  const dashboardData = {
    activeAims,
    totalAims,
    avgProgress,
    playingGames,
    completedGames,
    completedTasks,
    pendingTasks,
    totalLogs,
    stats,
    achievementsCount,
  }

  return <DashboardClient data={dashboardData} />
}
