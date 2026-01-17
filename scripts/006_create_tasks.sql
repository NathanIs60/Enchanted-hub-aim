-- Create unified tasks table (can link to aims, games, apps, or be standalone daily tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  due_time TIME,
  completed_at TIMESTAMPTZ,
  
  -- Polymorphic associations
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'aim', 'game', 'app', 'daily')),
  aim_id UUID REFERENCES public.aims(id) ON DELETE CASCADE,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  app_id UUID REFERENCES public.apps(id) ON DELETE CASCADE,
  
  -- Ordering
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "tasks_select_own" ON public.tasks 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert_own" ON public.tasks 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update_own" ON public.tasks 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "tasks_delete_own" ON public.tasks 
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status);
CREATE INDEX IF NOT EXISTS tasks_category_idx ON public.tasks(category);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_aim_id_idx ON public.tasks(aim_id);
CREATE INDEX IF NOT EXISTS tasks_game_id_idx ON public.tasks(game_id);
CREATE INDEX IF NOT EXISTS tasks_app_id_idx ON public.tasks(app_id);
