-- Create aims (goals) table
CREATE TABLE IF NOT EXISTS public.aims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.aims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aims
CREATE POLICY "aims_select_own" ON public.aims 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "aims_insert_own" ON public.aims 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "aims_update_own" ON public.aims 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "aims_delete_own" ON public.aims 
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS aims_user_id_idx ON public.aims(user_id);
CREATE INDEX IF NOT EXISTS aims_status_idx ON public.aims(status);
