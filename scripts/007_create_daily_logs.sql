-- Create daily_logs table for Daily Journal
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  title TEXT,
  content JSONB DEFAULT '{}', -- Block-based rich text content
  mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'bad', 'terrible')),
  
  -- Links to other entities
  linked_aim_id UUID REFERENCES public.aims(id) ON DELETE SET NULL,
  linked_game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one log per user per day
  UNIQUE(user_id, log_date)
);

-- Enable RLS
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_logs
CREATE POLICY "daily_logs_select_own" ON public.daily_logs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_logs_insert_own" ON public.daily_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_logs_update_own" ON public.daily_logs 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "daily_logs_delete_own" ON public.daily_logs 
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS daily_logs_user_id_idx ON public.daily_logs(user_id);
CREATE INDEX IF NOT EXISTS daily_logs_log_date_idx ON public.daily_logs(log_date);
