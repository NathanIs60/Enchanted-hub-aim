-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('achievement', 'friend_request', 'message', 'system', 'reminder', 'level_up')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User notification settings
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  achievement_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  friend_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  system_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  google_sync_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  google_calendar_id TEXT,
  google_access_token TEXT,
  google_refresh_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_system" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notification_settings
CREATE POLICY "notification_settings_select_own" ON notification_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notification_settings_insert_own" ON notification_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notification_settings_update_own" ON notification_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Trigger to auto-create notification settings on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_notification_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_notification_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_notification_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_notification_settings();
