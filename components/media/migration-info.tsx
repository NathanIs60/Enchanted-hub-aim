"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Database, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function MigrationInfo() {
  const [copied, setCopied] = useState(false)

  const migrationScript = `-- Run this in your Supabase SQL Editor
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
  FOR DELETE USING (auth.uid() = user_id);`

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
            Folders Feature Setup Required
          </CardTitle>
        </div>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          To use the folder organization feature, you need to run a database migration first.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to enable folders:</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <div>1. Go to your Supabase dashboard</div>
            <div>2. Navigate to SQL Editor</div>
            <div>3. Copy and run the migration script below</div>
            <div>4. Refresh this page</div>
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
          <Badge variant="secondary">📁 Folder Organization</Badge>
          <Badge variant="secondary">🎨 Custom Colors & Icons</Badge>
          <Badge variant="secondary">📊 Resource Management</Badge>
        </div>
      </CardContent>
    </Card>
  )
}