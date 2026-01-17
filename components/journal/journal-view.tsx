"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns"
import type { DailyLog, Aim, Game } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { JournalEntryDialog } from "./journal-entry-dialog"
import { JournalEntryCard } from "./journal-entry-card"

interface JournalViewProps {
  logs: DailyLog[]
  aims: Pick<Aim, "id" | "title">[]
  games: Pick<Game, "id" | "title">[]
}

export function JournalView({ logs, aims, games }: JournalViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getLogForDate = (date: Date) => {
    return logs.find((log) => isSameDay(parseISO(log.log_date), date))
  }

  const previousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setDialogOpen(true)
  }

  const selectedLog = selectedDate ? getLogForDate(selectedDate) : undefined

  // Get recent entries for the sidebar
  const recentLogs = logs.slice(0, 5)

  const moodColors = {
    great: "bg-green-500",
    good: "bg-emerald-400",
    neutral: "bg-gray-400",
    bad: "bg-orange-400",
    terrible: "bg-red-500",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Daily Journal</h2>
          <p className="text-muted-foreground">Document your thoughts and experiences</p>
        </div>
        <Button
          onClick={() => {
            setSelectedDate(new Date())
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-start-${i}`} className="aspect-square p-1" />
              ))}

              {days.map((day) => {
                const log = getLogForDate(day)
                const isToday = isSameDay(day, new Date())

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "relative aspect-square rounded-lg p-1 text-sm transition-colors hover:bg-accent",
                      !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
                      isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    )}
                  >
                    <span className="flex h-full w-full flex-col items-center justify-center gap-1">
                      {format(day, "d")}
                      {log && (
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", log.mood ? moodColors[log.mood] : "bg-primary")}
                        />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLogs.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No journal entries yet</p>
                <p className="text-xs text-muted-foreground">Click on a date to start writing</p>
              </div>
            ) : (
              recentLogs.map((log) => (
                <JournalEntryCard
                  key={log.id}
                  log={log}
                  onClick={() => {
                    setSelectedDate(parseISO(log.log_date))
                    setDialogOpen(true)
                  }}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <JournalEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={selectedDate}
        existingLog={selectedLog}
        aims={aims}
        games={games}
      />
    </div>
  )
}
