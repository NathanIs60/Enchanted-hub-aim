-- Create media folders table
CREATE TABLE IF NOT EXISTS media_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT 'blue',
  icon TEXT,
  parent_folder_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add folder_id column to resources table
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES media_folders(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_folders_user_id ON media_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_media_folders_parent_folder_id ON media_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_resources_folder_id ON resources(folder_id);

-- Enable RLS
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for media_folders
CREATE POLICY "Users can view their own media folders" ON media_folders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own media folders" ON media_folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media folders" ON media_folders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media folders" ON media_folders
  FOR DELETE USING (auth.uid() = user_id);

-- Create some default folders for existing users
INSERT INTO media_folders (user_id, name, description, color, icon, sort_order)
SELECT 
  id as user_id,
  'Favorites' as name,
  'Your favorite resources' as description,
  'yellow' as color,
  'star' as icon,
  0 as sort_order
FROM auth.users
WHERE id NOT IN (SELECT DISTINCT user_id FROM media_folders WHERE name = 'Favorites')
ON CONFLICT DO NOTHING;

INSERT INTO media_folders (user_id, name, description, color, icon, sort_order)
SELECT 
  id as user_id,
  'Watch Later' as name,
  'Resources to watch later' as description,
  'blue' as color,
  'clock' as icon,
  1 as sort_order
FROM auth.users
WHERE id NOT IN (SELECT DISTINCT user_id FROM media_folders WHERE name = 'Watch Later')
ON CONFLICT DO NOTHING;

INSERT INTO media_folders (user_id, name, description, color, icon, sort_order)
SELECT 
  id as user_id,
  'Learning' as name,
  'Educational content' as description,
  'green' as color,
  'book' as icon,
  2 as sort_order
FROM auth.users
WHERE id NOT IN (SELECT DISTINCT user_id FROM media_folders WHERE name = 'Learning')
ON CONFLICT DO NOTHING;