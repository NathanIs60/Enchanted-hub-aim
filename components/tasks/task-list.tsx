"use client"

import type { Task, Aim, Game } from "@/lib/types/database"
import { TaskItem } from "./task-item"
import { CheckSquare } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  aims: Pick<Aim, "id" | "title">[]
  games: Pick<Game, "id" | "title">[]
}

export function TaskList({ tasks, aims, games }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20 py-8">
        <CheckSquare className="h-10 w-10 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No tasks found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} aims={aims} games={games} />
      ))}
    </div>
  )
}
