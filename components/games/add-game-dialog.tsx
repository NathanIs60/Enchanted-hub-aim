"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { gameSchema, type GameFormData } from "@/lib/validations/game"
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

export function AddGameDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      status: "playing",
      hours_played: 0,
    },
  })

  const onSubmit = async (data: GameFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("games").insert({
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        cover_image: data.cover_image || null,
        status: data.status,
        platform: data.platform || null,
        hours_played: data.hours_played,
        rating: data.rating || null,
        started_at: data.started_at || null,
        completed_at: data.completed_at || null,
      })

      if (error) throw error

      toast.success("Game added successfully")
      reset()
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Failed to add game")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Game
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
          <DialogDescription>Add a game to your library to track your progress</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Game title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Optional description" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue="playing"
                onValueChange={(value) => setValue("status", value as GameFormData["status"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playing">Playing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input id="platform" placeholder="e.g., PC, PS5" {...register("platform")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hours_played">Hours Played</Label>
              <Input id="hours_played" type="number" min="0" step="0.5" {...register("hours_played")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-10)</Label>
              <Input id="rating" type="number" min="0" max="10" {...register("rating")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image">Cover Image URL</Label>
            <Input id="cover_image" placeholder="https://..." {...register("cover_image")} />
            {errors.cover_image && <p className="text-sm text-destructive">{errors.cover_image.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="started_at">Started Date</Label>
              <Input id="started_at" type="date" {...register("started_at")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completed_at">Completed Date</Label>
              <Input id="completed_at" type="date" {...register("completed_at")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Game
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
