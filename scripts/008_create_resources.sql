-- Create resources table for Media Hub (YouTube links, etc.)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT DEFAULT 'youtube' CHECK (resource_type IN ('youtube', 'article', 'document', 'other')),
  thumbnail_url TEXT,
  notes JSONB DEFAULT '{}', -- Block-based notes for the resource
  
  -- Links to other entities
  linked_aim_id UUID REFERENCES public.aims(id) ON DELETE SET NULL,
  linked_game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
  
  is_watched BOOLEAN DEFAULT FALSE,
  watch_progress INTEGER DEFAULT 0, -- Progress in seconds for videos
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources
CREATE POLICY "resources_select_own" ON public.resources 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "resources_insert_own" ON public.resources 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resources_update_own" ON public.resources 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "resources_delete_own" ON public.resources 
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS resources_user_id_idx ON public.resources(user_id);
CREATE INDEX IF NOT EXISTS resources_type_idx ON public.resources(resource_type);
