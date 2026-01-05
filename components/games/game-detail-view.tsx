"use client"

import type { Game, Task } from "@/lib/types/database"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Clock, Star, Calendar, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { GameTaskList } from "./game-task-list"

interface GameDetailViewProps {
  game: Game
  tasks: Task[]
}

const statusColors: Record<Game["status"], string> = {
  playing: "bg-green-500/10 text-green-600 dark:text-green-400",
  completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  paused: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  backlog: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  dropped: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function GameDetailView({ game, tasks }: GameDetailViewProps) {
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const totalTasks = tasks.length
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/games">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{game.title}</h2>
          <p className="text-muted-foreground">{game.platform || "No platform specified"}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/games/${game.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-border/50 bg-card/50">
            <div className="relative aspect-[3/4] bg-muted">
              {game.cover_image ? (
                <Image src={game.cover_image || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-6xl font-bold text-muted-foreground/20">
                    {game.title.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <Badge className={`mb-3 ${statusColors[game.status]}`}>
                {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
              </Badge>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Hours Played
                  </span>
                  <span className="font-medium">{game.hours_played}h</span>
                </div>

                {game.rating && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-4 w-4" />
                      Rating
                    </span>
                    <span className="font-medium">{game.rating}/10</span>
                  </div>
                )}

                {game.started_at && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Started
                    </span>
                    <span className="font-medium">{new Date(game.started_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {game.description && <p className="mt-4 text-sm text-muted-foreground">{game.description}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Task Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {completedTasks} of {totalTasks} tasks completed
                  </span>
                  <span className="font-medium">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <GameTaskList gameId={game.id} tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
