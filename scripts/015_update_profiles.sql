-- Add social fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS handle TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE;

-- Update RLS to allow public profile discovery
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (is_public = true OR auth.uid() = id);

-- Index for handle search
CREATE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);
