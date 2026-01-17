"use client"

import type React from "react"

import { motion } from "framer-motion"
import {
  Trophy,
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
import type { Achievement } from "@/lib/types/database"

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

interface AchievementToastProps {
  achievement: Achievement
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  const Icon = iconMap[achievement.icon] || Trophy

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-primary/5 p-4 shadow-lg backdrop-blur-sm"
    >
      {/* Animated background sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/40"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * -50],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${50 + Math.random() * 30}%`,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center gap-4">
        <motion.div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 ring-2 ring-primary/30"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Icon className="h-7 w-7 text-primary" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary">NathanIs Achievement</span>
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
          <p className="font-semibold text-foreground">{achievement.title}</p>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          {achievement.xp_reward > 0 && (
            <p className="mt-1 text-xs font-medium text-primary">+{achievement.xp_reward} XP</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
