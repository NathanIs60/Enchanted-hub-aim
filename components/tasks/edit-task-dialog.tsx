"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { taskSchema, type TaskFormData } from "@/lib/validations/task"
import type { Task, Aim, Game } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  aims: Pick<Aim, "id" | "title">[]
  games: Pick<Game, "id" | "title">[]
}

export function EditTaskDialog({ open, onOpenChange, task, aims, games }: EditTaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  })

  const category = watch("category")

  useEffect(() => {
    if (task && open) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        category: task.category,
        due_date: task.due_date || "",
        due_time: task.due_time || "",
        aim_id: task.aim_id || undefined,
        game_id: task.game_id || undefined,
      })
    }
  }, [task, open, reset])

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("tasks")
        .update({
          title: data.title,
          description: data.description || null,
          status: data.status,
          priority: data.priority,
          category: data.category,
          due_date: data.due_date || null,
          due_time: data.due_time || null,
          aim_id: data.aim_id || null,
          game_id: data.game_id || null,
        })
        .eq("id", task.id)

      if (error) throw error

      toast.success("Task updated")
      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error("Failed to update task")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update your task details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" placeholder="Task title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" placeholder="Optional description" {...register("description")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as TaskFormData["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={watch("priority")}
                onValueChange={(value) => setValue("priority", value as TaskFormData["priority"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(value) => setValue("category", value as TaskFormData["category"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="aim">Aim</SelectItem>
                <SelectItem value="game">Game</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {category === "aim" && aims.length > 0 && (
            <div className="space-y-2">
              <Label>Link to Aim</Label>
              <Select
                value={watch("aim_id") || "none"}
                onValueChange={(value) => setValue("aim_id", value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an aim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {aims.map((aim) => (
                    <SelectItem key={aim.id} value={aim.id}>
                      {aim.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {category === "game" && games.length > 0 && (
            <div className="space-y-2">
              <Label>Link to Game</Label>
              <Select
                value={watch("game_id") || "none"}
                onValueChange={(value) => setValue("game_id", value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-due_date">Due Date</Label>
              <Input id="edit-due_date" type="date" {...register("due_date")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-due_time">Due Time</Label>
              <Input id="edit-due_time" type="time" {...register("due_time")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
