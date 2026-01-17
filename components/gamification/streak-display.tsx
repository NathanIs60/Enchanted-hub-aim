"use client"

import { motion } from "framer-motion"
import { Flame, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/contexts/language-context"

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  compact?: boolean
  className?: string
}

export function StreakDisplay({ currentStreak, longestStreak, compact = false, className }: StreakDisplayProps) {
  const { t } = useLanguage()
  const isOnFire = currentStreak >= 3

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <motion.div
          animate={isOnFire ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
        >
          <Flame className={cn("h-5 w-5", isOnFire ? "text-orange-500" : "text-muted-foreground")} />
        </motion.div>
        <span className={cn("text-sm font-medium", isOnFire ? "text-orange-500" : "text-muted-foreground")}>
          {currentStreak} {t("common.days")}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <motion.div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          isOnFire ? "bg-gradient-to-br from-orange-500/20 to-red-500/10" : "bg-muted",
        )}
        animate={isOnFire ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
      >
        <Flame className={cn("h-6 w-6", isOnFire ? "text-orange-500" : "text-muted-foreground")} />
      </motion.div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className={cn("text-2xl font-bold", isOnFire ? "text-orange-500" : "text-foreground")}>
            {currentStreak}
          </span>
          <span className="text-sm text-muted-foreground">{t("gamification.dayStreak")}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{t("gamification.bestStreak", { days: longestStreak })}</span>
        </div>
      </div>
    </div>
  )
}
