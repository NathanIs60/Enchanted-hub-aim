import { z } from "zod"

export const gameSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  cover_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["playing", "completed", "paused", "backlog", "dropped"]),
  platform: z.string().max(50, "Platform must be less than 50 characters").optional(),
  hours_played: z.coerce.number().min(0, "Hours must be positive").default(0),
  rating: z.coerce.number().min(0).max(10).optional().nullable(),
  started_at: z.string().optional().nullable(),
  completed_at: z.string().optional().nullable(),
})

export type GameFormData = z.infer<typeof gameSchema>
