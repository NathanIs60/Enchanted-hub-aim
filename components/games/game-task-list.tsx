"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Task } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface GameTaskListProps {
  gameId: string
  tasks: Task[]
}

export function GameTaskList({ gameId, tasks }: GameTaskListProps) {
  const [newTask, setNewTask] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const handleAddTask = async () => {
    if (!newTask.trim()) return

    setIsAdding(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title: newTask.trim(),
        category: "game",
        game_id: gameId,
        sort_order: tasks.length,
      })

      if (error) throw error

      setNewTask("")
      toast.success("Task added")
      router.refresh()
    } catch {
      toast.error("Failed to add task")
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleTask = async (task: Task) => {
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

  const handleDeleteTask = async (taskId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", taskId)

    if (error) {
      toast.error("Failed to delete task")
    } else {
      toast.success("Task deleted")
      router.refresh()
    }
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg">Game Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className="bg-background/50"
          />
          <Button onClick={handleAddTask} disabled={isAdding || !newTask.trim()}>
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No tasks yet. Add your first task above.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-3"
              >
                <Checkbox checked={task.status === "completed"} onCheckedChange={() => handleToggleTask(task)} />
                <span
                  className={cn("flex-1 text-sm", task.status === "completed" && "text-muted-foreground line-through")}
                >
                  {task.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
