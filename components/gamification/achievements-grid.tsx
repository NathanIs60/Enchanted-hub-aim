"use client"

import type React from "react"

import { motion } from "framer-motion"
import {
  Trophy,
  Lock,
  Sparkles,
  Star,
  Medal,
  Crown,
  Zap,
  Target,
  Gamepad2,
  BookOpen,
  Users,
  Share2,
  Flame,
  Award,
  Gem,
  CheckCircle,
  ListChecks,
  Rocket,
  Scroll,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Achievement, UserAchievement } from "@/lib/types/database"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  sparkles: Sparkles,
  star: Star,
  medal: Medal,
  crown: Crown,
  zap: Zap,
  target: Target,
  "gamepad-2": Gamepad2,
  "book-open": BookOpen,
  users: Users,
  "share-2": Share2,
  flame: Flame,
  award: Award,
  gem: Gem,
  "check-circle": CheckCircle,
  "list-checks": ListChecks,
  rocket: Rocket,
  scroll: Scroll,
  calendar: Calendar,
  "fire-extinguisher": Flame,
}

interface AchievementsGridProps {
  achievements: Achievement[]
  userAchievements: UserAchievement[]
  className?: string
}

export function AchievementsGrid({ achievements, userAchievements, className }: AchievementsGridProps) {
  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievement_id))

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  }

  return (
    <TooltipProvider>
      <motion.div
        className={cn("grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8", className)}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {achievements.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id)
          const Icon = iconMap[achievement.icon] || Trophy

          return (
            <Tooltip key={achievement.id}>
              <TooltipTrigger asChild>
                <motion.div
                  variants={item}
                  className={cn(
                    "group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border p-2 transition-all",
                    isUnlocked
                      ? "border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary/50"
                      : "border-border/50 bg-muted/30 opacity-50 grayscale hover:opacity-70",
                  )}
                >
                  {isUnlocked && (
                    <motion.div
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                    </motion.div>
                  )}
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-transform group-hover:scale-110",
                      isUnlocked ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  {!isUnlocked && <Lock className="absolute bottom-1 right-1 h-3 w-3 text-muted-foreground" />}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="font-semibold">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                {achievement.xp_reward > 0 && <p className="mt-1 text-xs text-primary">+{achievement.xp_reward} XP</p>}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </motion.div>
    </TooltipProvider>
  )
}
