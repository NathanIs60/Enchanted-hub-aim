-- User Stats table for Gamification (XP, Levels, Streaks)
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  total_tasks_completed INTEGER NOT NULL DEFAULT 0,
  total_aims_completed INTEGER NOT NULL DEFAULT 0,
  total_games_completed INTEGER NOT NULL DEFAULT 0,
  total_journal_entries INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "user_stats_select_own" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_stats_insert_own" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_stats_update_own" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to see other users' stats for leaderboards
CREATE POLICY "user_stats_select_public" ON user_stats
  FOR SELECT USING (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON user_stats(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_xp ON user_stats(xp DESC);

-- Trigger to auto-create user stats on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created_stats ON auth.users;
CREATE TRIGGER on_auth_user_created_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_stats();
