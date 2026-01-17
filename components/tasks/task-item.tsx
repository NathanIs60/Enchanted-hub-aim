"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO, isPast, isToday } from "date-fns"
import type { Task, Aim, Game } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, Trash2, Edit, Target, Gamepad2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { EditTaskDialog } from "./edit-task-dialog"

interface TaskItemProps {
  task: Task
  aims: Pick<Aim, "id" | "title">[]
  games: Pick<Game, "id" | "title">[]
}

const priorityColors = {
  low: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
}

const categoryIcons = {
  general: null,
  aim: Target,
  game: Gamepad2,
  app: null,
  daily: Calendar,
}

export function TaskItem({ task, aims, games }: TaskItemProps) {
  const [editOpen, setEditOpen] = useState(false)
  const router = useRouter()

  const linkedAim = task.aim_id ? aims.find((a) => a.id === task.aim_id) : null
  const linkedGame = task.game_id ? games.find((g) => g.id === task.game_id) : null
  const CategoryIcon = categoryIcons[task.category]

  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date))
  const isDueToday = task.due_date && isToday(parseISO(task.due_date))

  const handleToggle = async () => {
    const supabase = createClient()
    const newStatus = task.status === "completed" ? "pending" : "completed"

    const { error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", task.id)

    if (error) {
      toast.error("Failed to update task")
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", task.id)

    if (error) {
      toast.error("Failed to delete task")
    } else {
      toast.success("Task deleted")
      router.refresh()
    }
  }

  return (
    <>
      <div
        className={cn(
          "group flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-colors hover:bg-card",
          task.status === "completed" && "opacity-60",
        )}
      >
        <Checkbox checked={task.status === "completed"} onCheckedChange={handleToggle} className="mt-0.5" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("font-medium", task.status === "completed" && "line-through text-muted-foreground")}>
              {task.title}
            </span>
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            {CategoryIcon && (
              <Badge variant="secondary" className="gap-1">
                <CategoryIcon className="h-3 w-3" />
                {task.category}
              </Badge>
            )}
          </div>

          {task.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{task.description}</p>}

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {task.due_date && (
              <span
                className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-destructive",
                  isDueToday && "text-orange-500",
                )}
              >
                <Calendar className="h-3 w-3" />
                {format(parseISO(task.due_date), "MMM d")}
                {task.due_time && ` at ${task.due_time}`}
              </span>
            )}
            {linkedAim && (
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {linkedAim.title}
              </span>
            )}
            {linkedGame && (
              <span className="flex items-center gap-1">
                <Gamepad2 className="h-3 w-3" />
                {linkedGame.title}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditTaskDialog open={editOpen} onOpenChange={setEditOpen} task={task} aims={aims} games={games} />
    </>
  )
}
