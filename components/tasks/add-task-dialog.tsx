"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { taskSchema, type TaskFormData } from "@/lib/validations/task"
import type { Aim, Game } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface AddTaskDialogProps {
  aims: Pick<Aim, "id" | "title">[]
  games: Pick<Game, "id" | "title">[]
}

export function AddTaskDialog({ aims, games }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
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
    defaultValues: {
      status: "pending",
      priority: "medium",
      category: "general",
    },
  })

  const category = watch("category")

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
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

      if (error) throw error

      toast.success("Task created")
      reset()
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Failed to create task")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Create a new task to track your progress</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Task title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Optional description" {...register("description")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                defaultValue="medium"
                onValueChange={(value) => setValue("priority", value as TaskFormData["priority"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                defaultValue="general"
                onValueChange={(value) => setValue("category", value as TaskFormData["category"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="aim">Aim</SelectItem>
                  <SelectItem value="game">Game</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {category === "aim" && aims.length > 0 && (
            <div className="space-y-2">
              <Label>Link to Aim</Label>
              <Select onValueChange={(value) => setValue("aim_id", value === "none" ? null : value)}>
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
              <Select onValueChange={(value) => setValue("game_id", value === "none" ? null : value)}>
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
              <Label htmlFor="due_date">Due Date</Label>
              <Input id="due_date" type="date" {...register("due_date")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_time">Due Time</Label>
              <Input id="due_time" type="time" {...register("due_time")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
