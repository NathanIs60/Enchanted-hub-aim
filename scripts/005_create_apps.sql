-- Create apps table for App Workflows
CREATE TABLE IF NOT EXISTS public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'learning', 'mastered', 'archived')),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for apps
CREATE POLICY "apps_select_own" ON public.apps 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "apps_insert_own" ON public.apps 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "apps_update_own" ON public.apps 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "apps_delete_own" ON public.apps 
  FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS apps_user_id_idx ON public.apps(user_id);
