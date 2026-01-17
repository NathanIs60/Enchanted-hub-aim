-- Add notification fields to tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notification_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS notification_lead_minutes INTEGER DEFAULT 5;
