-- Achievements/Badges table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'trophy',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  threshold INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Achievements (unlocked badges)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements (public read)
CREATE POLICY "achievements_select_public" ON achievements
  FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "user_achievements_select_own" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_achievements_insert_own" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Seed default achievements
INSERT INTO achievements (code, title, description, icon, xp_reward, category, threshold) VALUES
  ('first_task', 'Getting Started', 'Complete your first task', 'check-circle', 50, 'tasks', 1),
  ('task_10', 'Task Master', 'Complete 10 tasks', 'list-checks', 100, 'tasks', 10),
  ('task_50', 'Productivity Pro', 'Complete 50 tasks', 'zap', 250, 'tasks', 50),
  ('task_100', 'Task Legend', 'Complete 100 tasks', 'crown', 500, 'tasks', 100),
  ('first_aim', 'Aim High', 'Create your first aim', 'target', 50, 'aims', 1),
  ('aim_complete', 'Goal Getter', 'Complete your first aim', 'trophy', 200, 'aims', 1),
  ('aim_5', 'Ambitious', 'Complete 5 aims', 'rocket', 500, 'aims', 5),
  ('first_game', 'Gamer', 'Add your first game', 'gamepad-2', 50, 'games', 1),
  ('game_complete', 'Game Over', 'Complete your first game', 'medal', 150, 'games', 1),
  ('game_10', 'Dedicated Gamer', 'Complete 10 games', 'sparkles', 400, 'games', 10),
  ('first_journal', 'Dear Diary', 'Write your first journal entry', 'book-open', 50, 'journal', 1),
  ('journal_7', 'Week Writer', 'Write 7 journal entries', 'calendar', 150, 'journal', 7),
  ('journal_30', 'Monthly Memoirist', 'Write 30 journal entries', 'scroll', 400, 'journal', 30),
  ('streak_3', 'On Fire', 'Maintain a 3-day streak', 'flame', 75, 'streaks', 3),
  ('streak_7', 'Week Warrior', 'Maintain a 7-day streak', 'fire-extinguisher', 200, 'streaks', 7),
  ('streak_30', 'Monthly Master', 'Maintain a 30-day streak', 'award', 600, 'streaks', 30),
  ('level_5', 'Rising Star', 'Reach level 5', 'star', 100, 'levels', 5),
  ('level_10', 'Veteran', 'Reach level 10', 'medal', 250, 'levels', 10),
  ('level_25', 'Elite', 'Reach level 25', 'gem', 750, 'levels', 25),
  ('first_friend', 'Social Butterfly', 'Make your first friend', 'users', 75, 'social', 1),
  ('blueprint_share', 'Blueprint Sharer', 'Share your first blueprint', 'share-2', 100, 'social', 1)
ON CONFLICT (code) DO NOTHING;
