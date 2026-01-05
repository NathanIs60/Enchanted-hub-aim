import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum(["general", "aim", "game", "app", "daily"]),
  due_date: z.string().optional().nullable(),
  due_time: z.string().optional().nullable(),
  aim_id: z.string().uuid().optional().nullable(),
  game_id: z.string().uuid().optional().nullable(),
  app_id: z.string().uuid().optional().nullable(),
})

export type TaskFormData = z.infer<typeof taskSchema>
