-- Blueprints table for shared routines/study plans
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('study', 'fitness', 'productivity', 'gaming', 'lifestyle', 'general')),
  tasks JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  clone_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blueprint likes table
CREATE TABLE IF NOT EXISTS blueprint_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, blueprint_id)
);

-- Enable RLS
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprint_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blueprints
CREATE POLICY "blueprints_select_own" ON blueprints
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "blueprints_select_public" ON blueprints
  FOR SELECT USING (is_public = true AND is_approved = true);

CREATE POLICY "blueprints_insert_own" ON blueprints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "blueprints_update_own" ON blueprints
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "blueprints_delete_own" ON blueprints
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for blueprint_likes
CREATE POLICY "blueprint_likes_select_own" ON blueprint_likes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "blueprint_likes_insert_own" ON blueprint_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "blueprint_likes_delete_own" ON blueprint_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blueprints_user_id ON blueprints(user_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_public ON blueprints(is_public, is_approved);
CREATE INDEX IF NOT EXISTS idx_blueprints_category ON blueprints(category);
CREATE INDEX IF NOT EXISTS idx_blueprint_likes_blueprint ON blueprint_likes(blueprint_id);
