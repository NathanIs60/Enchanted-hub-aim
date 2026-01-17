export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  handle: string | null
  is_verified: boolean
  is_public: boolean
  preferred_language: string
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
  folder_id: string | null
  created_at: string
  updated_at: string
}

export interface MediaFolder {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  parent_folder_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface UserStats {
  id: string
  user_id: string
  xp: number
  level: number
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  total_tasks_completed: number
  total_aims_completed: number
  total_games_completed: number
  total_journal_entries: number
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  code: string
  title: string
  description: string
  icon: string
  xp_reward: number
  category: string
  threshold: number
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  achievement?: Achievement
}

export interface Friendship {
  id: string
  requester_id: string
  addressee_id: string
  status: "pending" | "accepted" | "declined" | "blocked"
  created_at: string
  updated_at: string
  requester?: Profile
  addressee?: Profile
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: Profile
  receiver?: Profile
}

export interface Blueprint {
  id: string
  user_id: string
  title: string
  description: string | null
  category: "study" | "fitness" | "productivity" | "gaming" | "lifestyle" | "general"
  tasks: BlueprintTask[]
  is_public: boolean
  is_approved: boolean
  clone_count: number
  likes_count: number
  created_at: string
  updated_at: string
  author?: Profile
}

export interface BlueprintTask {
  title: string
  description?: string
  priority: "low" | "medium" | "high" | "urgent"
  order: number
}

export interface BlueprintLike {
  id: string
  user_id: string
  blueprint_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: "achievement" | "friend_request" | "message" | "system" | "reminder" | "level_up"
  title: string
  message: string
  data: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export interface NotificationSettings {
  id: string
  user_id: string
  notifications_enabled: boolean
  achievement_alerts: boolean
  friend_alerts: boolean
  reminder_alerts: boolean
  system_alerts: boolean
  google_sync_enabled: boolean
  google_calendar_id: string | null
  google_access_token: string | null
  google_refresh_token: string | null
  created_at: string
  updated_at: string
}
