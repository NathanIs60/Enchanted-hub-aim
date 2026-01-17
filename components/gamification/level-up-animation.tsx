"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Star, TrendingUp } from "lucide-react"
import { getLevelTitle, getLevelColor } from "@/lib/gamification/xp-engine"
import { cn } from "@/lib/utils"

interface LevelUpAnimationProps {
  show: boolean
  newLevel: number
  onComplete?: () => void
}

export function LevelUpAnimation({ show, newLevel, onComplete }: LevelUpAnimationProps) {
  const levelTitle = getLevelTitle(newLevel)
  const levelColor = getLevelColor(newLevel)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(() => onComplete?.(), 2500)
          }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-primary"
                initial={{
                  opacity: 0,
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Main content */}
            <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-card/90 p-8 shadow-2xl backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Star className="h-8 w-8 text-primary" />
              </motion.div>

              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Level Up</span>
              </div>

              <motion.div
                className={cn("text-6xl font-bold", levelColor)}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              >
                {newLevel}
              </motion.div>

              <p className={cn("text-xl font-semibold", levelColor)}>{levelTitle}</p>

              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">NathanIs Enchanted Hub</span>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
