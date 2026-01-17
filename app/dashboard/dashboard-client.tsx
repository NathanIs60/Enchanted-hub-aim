"use client"

import type React from "react"
import { Target, Gamepad2, CheckSquare, BookOpen, Trophy } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { XpProgressBar } from "@/components/gamification/xp-progress-bar"
import { StreakDisplay } from "@/components/gamification/streak-display"
import { useLanguage } from "@/lib/contexts/language-context"
import Link from "next/link"

interface DashboardData {
  activeAims: number
  totalAims: number
  avgProgress: number
  playingGames: number
  completedGames: number
  completedTasks: number
  pendingTasks: number
  totalLogs: number
  stats: {
    xp: number
    level: number
    current_streak: number
    longest_streak: number
  }
  achievementsCount: number
}

interface DashboardClientProps {
  data: DashboardData
}

export function DashboardClient({ data }: DashboardClientProps) {
  const { t } = useLanguage()
  const {
    activeAims,
    totalAims,
    avgProgress,
    playingGames,
    completedGames,
    completedTasks,
    pendingTasks,
    stats,
    achievementsCount,
  } = data

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h2>
        <p className="text-muted-foreground">{t("dashboard.description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <XpProgressBar xp={stats.xp} />
        <StreakDisplay currentStreak={stats.current_streak} longestStreak={stats.longest_streak} />
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("dashboard.activeAims")}
          value={activeAims}
          description={`${totalAims} ${t("aims.all").toLowerCase()}`}
          icon={<Target className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.gamesPlaying")}
          value={playingGames}
          description={`${completedGames} ${t("games.completed").toLowerCase()}`}
          icon={<Gamepad2 className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.tasksCompleted")}
          value={completedTasks}
          description={`${pendingTasks} ${t("tasks.status.pending").toLowerCase()}`}
          icon={<CheckSquare className="h-5 w-5" />}
        />
        <StatsCard
          title={t("dashboard.achievements")}
          value={achievementsCount}
          description={t("dashboard.badgesUnlocked")}
          icon={<Trophy className="h-5 w-5" />}
        />
      </div>

      {/* Progress Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t("dashboard.aimsProgress")}</CardTitle>
            <CardDescription>{t("dashboard.averageProgress")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("dashboard.overallProgress")}</span>
                <span className="text-sm font-medium">{avgProgress}%</span>
              </div>
              <Progress value={avgProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {activeAims > 0
                  ? t("dashboard.activeAimsCount", { count: String(activeAims) })
                  : t("dashboard.noAims")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            <CardDescription>{t("dashboard.quickActionsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton href="/dashboard/aims" icon={Target} label={t("dashboard.newAim")} />
              <QuickActionButton href="/dashboard/games" icon={Gamepad2} label={t("dashboard.addGame")} />
              <QuickActionButton href="/dashboard/journal" icon={BookOpen} label={t("dashboard.writeEntry")} />
              <QuickActionButton href="/dashboard/tasks" icon={CheckSquare} label={t("dashboard.addTask")} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

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