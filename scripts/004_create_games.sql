-- Create games table for Gaming Tracker
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'playing' CHECK (status IN ('playing', 'completed', 'paused', 'backlog', 'dropped')),
  platform TEXT,
  hours_played DECIMAL(10,2) DEFAULT 0,
  rating INTEGER CHECK (rating >= 0 AND rating <= 10),
  started_at DATE,
  completed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games
CREATE POLICY "games_select_own" ON public.games 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "games_insert_own" ON public.games 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "games_update_own" ON public.games 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "games_delete_own" ON public.games 
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS games_user_id_idx ON public.games(user_id);
CREATE INDEX IF NOT EXISTS games_status_idx ON public.games(status);
