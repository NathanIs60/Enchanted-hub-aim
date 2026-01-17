"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

const blueprintSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  category: z.enum(["study", "fitness", "productivity", "gaming", "lifestyle", "general"]),
  is_public: z.boolean(),
  tasks: z
    .array(
      z.object({
        title: z.string().min(1, "Task title is required"),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]),
      }),
    )
    .min(1, "At least one task is required"),
})

type BlueprintFormData = z.infer<typeof blueprintSchema>

interface CreateBlueprintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBlueprintDialog({ open, onOpenChange }: CreateBlueprintDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlueprintFormData>({
    resolver: zodResolver(blueprintSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "general",
      is_public: false,
      tasks: [{ title: "", description: "", priority: "medium" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  })

  const onSubmit = async (data: BlueprintFormData) => {
    setIsSubmitting(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const tasksWithOrder = data.tasks.map((task, index) => ({
      ...task,
      order: index,
    }))

    const { error } = await supabase.from("blueprints").insert({
      user_id: user?.id,
      title: data.title,
      description: data.description || null,
      category: data.category,
      is_public: data.is_public,
      is_approved: data.is_public ? false : true, // Private blueprints are auto-approved
      tasks: tasksWithOrder,
    })

    if (!error) {
      toast({
        title: "Blueprint created!",
        description: data.is_public ? "It will be visible after approval" : "Saved to your blueprints",
      })
      reset()
      onOpenChange(false)
      router.refresh()
    } else {
      toast({
        title: "Failed to create blueprint",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Blueprint</DialogTitle>
          <DialogDescription>Create a reusable routine template that others can clone</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="My Study Routine" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Describe your blueprint..." rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              defaultValue="general"
              onValueChange={(value) => setValue("category", value as BlueprintFormData["category"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
            <div>
              <Label htmlFor="is_public">Make Public</Label>
              <p className="text-xs text-muted-foreground">Public blueprints can be discovered by others</p>
            </div>
            <Switch
              id="is_public"
              checked={watch("is_public")}
              onCheckedChange={(checked) => setValue("is_public", checked)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tasks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ title: "", description: "", priority: "medium" })}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Task
              </Button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-3"
                >
                  <GripVertical className="mt-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-2">
                    <Input {...register(`tasks.${index}.title`)} placeholder="Task title" className="bg-background" />
                    <div className="flex gap-2">
                      <Input
                        {...register(`tasks.${index}.description`)}
                        placeholder="Description (optional)"
                        className="flex-1 bg-background text-sm"
                      />
                      <Select
                        defaultValue="medium"
                        onValueChange={(value) =>
                          setValue(`tasks.${index}.priority`, value as "low" | "medium" | "high" | "urgent")
                        }
                      >
                        <SelectTrigger className="w-24 bg-background">
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
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.tasks && <p className="text-xs text-destructive">{errors.tasks.message}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Blueprint"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
