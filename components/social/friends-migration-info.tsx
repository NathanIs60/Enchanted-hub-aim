"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Database, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function FriendsMigrationInfo() {
  const [copied, setCopied] = useState(false)

  const migrationScript = `-- Run this in your Supabase SQL Editor
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

-- Test the table (optional - you can run this to verify)
-- SELECT 'Friendships table created successfully!' as message;
-- SELECT COUNT(*) as friendship_count FROM friendships;`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(migrationScript)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Migration script copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-blue-900 dark:text-blue-100">
            Friends Feature Setup Required
          </CardTitle>
        </div>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          To use the friends and social features, you need to run a database migration first. 
          The error "Error fetching friendships: {}" means the friendships table doesn't exist in your database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to enable friends:</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <div><strong>1.</strong> Go to your Supabase dashboard</div>
            <div><strong>2.</strong> Navigate to SQL Editor</div>
            <div><strong>3.</strong> Copy and run the migration script below</div>
            <div><strong>4.</strong> Refresh this page</div>
            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800">
              <strong>Note:</strong> If you see "Error fetching friendships: {}", it means the friendships table doesn't exist yet.
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Migration Script:</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="max-h-40 overflow-y-auto rounded-md bg-muted p-3 text-xs">
            <code>{migrationScript}</code>
          </pre>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">👥 Friend Requests</Badge>
          <Badge variant="secondary">💬 Messaging</Badge>
          <Badge variant="secondary">🔔 Notifications</Badge>
        </div>
      </CardContent>
    </Card>
  )
}