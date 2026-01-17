-- Friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- Enable RLS
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "friendships_select_own" ON friendships
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "friendships_insert_own" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "friendships_update_own" ON friendships
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "friendships_delete_own" ON friendships
  FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
