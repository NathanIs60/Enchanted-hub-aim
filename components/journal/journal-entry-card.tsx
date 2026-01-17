"use client"

import type { DailyLog } from "@/lib/types/database"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

interface JournalEntryCardProps {
  log: DailyLog
  onClick?: () => void
}

const moodLabels = {
  great: "Great",
  good: "Good",
  neutral: "Okay",
  bad: "Bad",
  terrible: "Terrible",
}

const moodColors = {
  great: "text-green-600 dark:text-green-400",
  good: "text-emerald-600 dark:text-emerald-400",
  neutral: "text-gray-600 dark:text-gray-400",
  bad: "text-orange-600 dark:text-orange-400",
  terrible: "text-red-600 dark:text-red-400",
}

export function JournalEntryCard({ log, onClick }: JournalEntryCardProps) {
  const content = log.content as { blocks?: Array<{ data?: { text?: string } }> }
  const previewText = content?.blocks?.[0]?.data?.text || "No content"

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-border/50 bg-background/50 p-3 text-left transition-colors hover:bg-accent"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{format(parseISO(log.log_date), "MMM d, yyyy")}</span>
        {log.mood && <span className={cn("text-xs font-medium", moodColors[log.mood])}>{moodLabels[log.mood]}</span>}
      </div>
      {log.title && <p className="mt-1 text-sm font-medium">{log.title}</p>}
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{previewText}</p>
    </button>
  )
}
