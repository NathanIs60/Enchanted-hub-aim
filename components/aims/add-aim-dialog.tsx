"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
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

const aimSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["active", "completed", "paused", "archived"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  due_date: z.string().optional(),
  color: z.string().default("#6366f1"),
})

type AimFormData = z.infer<typeof aimSchema>

export function AddAimDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AimFormData>({
    resolver: zodResolver(aimSchema),
    defaultValues: {
      status: "active",
      priority: "medium",
      color: "#6366f1",
    },
  })

  const onSubmit = async (data: AimFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("aims").insert({
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
        due_date: data.due_date || null,
        color: data.color,
      })

      if (error) throw error

      toast.success("Aim created")
      reset()
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Failed to create aim")
    } finally {
      setIsLoading(false)
    }
  }

  const colorOptions = [
    { value: "#6366f1", label: "Indigo" },
    { value: "#8b5cf6", label: "Violet" },
    { value: "#ec4899", label: "Pink" },
    { value: "#f43f5e", label: "Rose" },
    { value: "#f97316", label: "Orange" },
    { value: "#eab308", label: "Yellow" },
    { value: "#22c55e", label: "Green" },
    { value: "#14b8a6", label: "Teal" },
    { value: "#0ea5e9", label: "Sky" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Aim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Aim</DialogTitle>
          <DialogDescription>Create a new goal to track your progress</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Your aim" {...register("title")} />
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
                onValueChange={(value) => setValue("priority", value as AimFormData["priority"])}
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

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input id="due_date" type="date" {...register("due_date")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setValue("color", color.value)}
                  className="h-8 w-8 rounded-full border-2 border-transparent transition-all hover:scale-110 focus:border-foreground"
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Aim
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
