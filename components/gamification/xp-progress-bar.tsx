"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { getXpProgress, getLevelTitle, getLevelColor } from "@/lib/gamification/xp-engine"
import { useLanguage } from "@/lib/contexts/language-context"

interface XpProgressBarProps {
  xp: number
  showDetails?: boolean
  compact?: boolean
  className?: string
}

export function XpProgressBar({ xp, showDetails = true, compact = false, className }: XpProgressBarProps) {
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()
  const progress = getXpProgress(xp)
  const levelTitle = getLevelTitle(progress.currentLevel)
  const levelColor = getLevelColor(progress.currentLevel)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={cn("animate-pulse rounded-lg bg-muted h-20", className)} />
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <span className={cn("text-sm font-bold", levelColor)}>{progress.currentLevel}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{t("gamification.level", { level: progress.currentLevel })}</span>
            <span className="text-muted-foreground">{xp.toLocaleString()} XP</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/70"
              initial={{ width: 0 }}
              animate={{ width: `${progress.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-2 ring-primary/20">
              <span className={cn("text-lg font-bold", levelColor)}>{progress.currentLevel}</span>
            </div>
            <motion.div
              className="absolute -right-1 -top-1"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.div>
          </div>
          <div>
            <p className={cn("text-sm font-semibold", levelColor)}>{levelTitle}</p>
            <p className="text-xs text-muted-foreground">{t("gamification.level", { level: progress.currentLevel })}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{xp.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{t("gamification.totalXp")}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t("gamification.progressToLevel", { level: progress.nextLevel })}</span>
          <span className="font-medium">{progress.progress}%</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60"
            initial={{ width: 0 }}
            animate={{ width: `${progress.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        {showDetails && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {t("gamification.xpToNext", { xp: progress.xpToNextLevel.toLocaleString() })}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {t("gamification.xpTotal", { xp: progress.nextLevelXp.toLocaleString() })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
