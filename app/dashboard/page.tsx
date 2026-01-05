import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { Target, Gamepad2, CheckSquare, BookOpen } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch stats from database
  const [aimsResult, gamesResult, tasksResult, logsResult] = await Promise.all([
    supabase.from("aims").select("id, status, progress", { count: "exact" }).eq("user_id", user?.id),
    supabase.from("games").select("id, status", { count: "exact" }).eq("user_id", user?.id),
    supabase.from("tasks").select("id, status", { count: "exact" }).eq("user_id", user?.id),
    supabase.from("daily_logs").select("id", { count: "exact" }).eq("user_id", user?.id),
  ])

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your personal hub overview</p>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Aims"
          value={activeAims}
          description={`${totalAims} total aims`}
          icon={<Target className="h-5 w-5" />}
        />
        <StatsCard
          title="Games Playing"
          value={playingGames}
          description={`${completedGames} completed`}
          icon={<Gamepad2 className="h-5 w-5" />}
        />
        <StatsCard
          title="Tasks Completed"
          value={completedTasks}
          description={`${pendingTasks} pending`}
          icon={<CheckSquare className="h-5 w-5" />}
        />
        <StatsCard
          title="Journal Entries"
          value={totalLogs}
          description="Total entries"
          icon={<BookOpen className="h-5 w-5" />}
        />
      </div>

      {/* Progress Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Aims Progress</CardTitle>
            <CardDescription>Average progress across all active aims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-medium">{avgProgress}%</span>
              </div>
              <Progress value={avgProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {activeAims > 0
                  ? `You have ${activeAims} active aim${activeAims !== 1 ? "s" : ""} in progress`
                  : "Start by creating your first aim"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton href="/dashboard/aims" icon={Target} label="New Aim" />
              <QuickActionButton href="/dashboard/games" icon={Gamepad2} label="Add Game" />
              <QuickActionButton href="/dashboard/journal" icon={BookOpen} label="Write Entry" />
              <QuickActionButton href="/dashboard/tasks" icon={CheckSquare} label="Add Task" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import Link from "next/link"

function QuickActionButton({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border/50 bg-background/50 p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  )
}
