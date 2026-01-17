"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import type { Blueprint } from "@/lib/types/database"

const blueprintTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  order: z.number(),
})

const editBlueprintSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  category: z.enum(["study", "fitness", "productivity", "gaming", "lifestyle", "general"]),
  is_public: z.boolean(),
  tasks: z.array(blueprintTaskSchema).min(1, "At least one task is required"),
})

type EditBlueprintFormData = z.infer<typeof editBlueprintSchema>

interface EditBlueprintDialogProps {
  blueprint: Blueprint
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBlueprintDialog({ blueprint, open, onOpenChange }: EditBlueprintDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditBlueprintFormData>({
    resolver: zodResolver(editBlueprintSchema),
    defaultValues: {
      title: blueprint.title,
      description: blueprint.description || "",
      category: blueprint.category as any,
      is_public: blueprint.is_public,
      tasks: blueprint.tasks.map((task, index) => ({
        title: task.title,
        description: task.description || "",
        priority: task.priority as any,
        order: index,
      })),
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "tasks",
  })

  const isPublic = watch("is_public")

  useEffect(() => {
    if (open) {
      reset({
        title: blueprint.title,
        description: blueprint.description || "",
        category: blueprint.category as any,
        is_public: blueprint.is_public,
        tasks: blueprint.tasks.map((task, index) => ({
          title: task.title,
          description: task.description || "",
          priority: task.priority as any,
          order: index,
        })),
      })
    }
  }, [open, blueprint, reset])

  const onSubmit = async (data: EditBlueprintFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Update blueprint
      const { error } = await supabase
        .from("blueprints")
        .update({
          title: data.title,
          description: data.description || null,
          category: data.category,
          is_public: data.is_public,
          is_approved: data.is_public ? false : true, // Reset approval if making public
          tasks: data.tasks.map((task, index) => ({
            title: task.title,
            description: task.description || undefined,
            priority: task.priority,
            order: index,
          })),
          updated_at: new Date().toISOString(),
        })
        .eq("id", blueprint.id)

      if (error) throw error

      toast({
        title: "Blueprint updated!",
        description: data.is_public && !blueprint.is_public 
          ? "It will be visible after approval" 
          : "Your changes have been saved",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Failed to update blueprint",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = () => {
    append({
      title: "",
      description: "",
      priority: "medium",
      order: fields.length,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blueprint</DialogTitle>
          <DialogDescription>Update your blueprint details and tasks</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="My Study Routine"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue("category", value as any)} defaultValue={blueprint.category}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your blueprint..."
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_public">Make Public</Label>
              <p className="text-sm text-muted-foreground">
                Public blueprints can be discovered by others
              </p>
            </div>
            <Switch
              id="is_public"
              checked={isPublic}
              onCheckedChange={(checked) => setValue("is_public", checked)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tasks</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTask}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 p-4 border rounded-lg">
                  <div className="flex items-center">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <Input
                          placeholder="Task title"
                          {...register(`tasks.${index}.title`)}
                        />
                        {errors.tasks?.[index]?.title && (
                          <p className="text-sm text-destructive">{errors.tasks[index]?.title?.message}</p>
                        )}
                      </div>
                      <div>
                        <Select
                          onValueChange={(value) => setValue(`tasks.${index}.priority`, value as any)}
                          defaultValue={field.priority}
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
                    
                    <Input
                      placeholder="Description (optional)"
                      {...register(`tasks.${index}.description`)}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {errors.tasks && (
              <p className="text-sm text-destructive">{errors.tasks.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Blueprint
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}