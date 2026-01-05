export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Aim {
  id: string
  user_id: string
  title: string
  description: string | null
  status: "active" | "completed" | "paused" | "archived"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string | null
  progress: number
  color: string
  created_at: string
  updated_at: string
}

export interface Game {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_image: string | null
  status: "playing" | "completed" | "paused" | "backlog" | "dropped"
  platform: string | null
  hours_played: number
  rating: number | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface App {
  id: string
  user_id: string
  title: string
  description: string | null
  icon_url: string | null
  status: "active" | "learning" | "mastered" | "archived"
  category: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string | null
  due_time: string | null
  completed_at: string | null
  category: "general" | "aim" | "game" | "app" | "daily"
  aim_id: string | null
  game_id: string | null
  app_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DailyLog {
  id: string
  user_id: string
  log_date: string
  title: string | null
  content: Record<string, unknown>
  mood: "great" | "good" | "neutral" | "bad" | "terrible" | null
  linked_aim_id: string | null
  linked_game_id: string | null
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  user_id: string
  title: string
  url: string
  resource_type: "youtube" | "article" | "document" | "other"
  thumbnail_url: string | null
  notes: Record<string, unknown>
  linked_aim_id: string | null
  linked_game_id: string | null
  is_watched: boolean
  watch_progress: number
  created_at: string
  updated_at: string
}
