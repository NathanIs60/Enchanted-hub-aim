"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Bell, Trophy, Users, Clock, AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { NotificationSettings as NotificationSettingsType } from "@/lib/types/database"
import { toast } from "@/hooks/use-toast"

interface NotificationSettingsProps {
  settings: NotificationSettingsType | null
  userId: string
}

export function NotificationSettings({ settings, userId }: NotificationSettingsProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formState, setFormState] = useState({
    notifications_enabled: settings?.notifications_enabled ?? true,
    achievement_alerts: settings?.achievement_alerts ?? true,
    friend_alerts: settings?.friend_alerts ?? true,
    reminder_alerts: settings?.reminder_alerts ?? true,
    system_alerts: settings?.system_alerts ?? true,
  })

  const handleToggle = (field: keyof typeof formState) => {
    setFormState((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()

    const { error } = await supabase.from("notification_settings").upsert(
      {
        user_id: userId,
        ...formState,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )

    if (error) {
      toast.error("Failed to save settings")
    } else {
      toast.success("Notification settings saved")
      router.refresh()
    }

    setIsSaving(false)
  }

  const settingsItems = [
    {
      id: "notifications_enabled",
      label: "Enable Notifications",
      description: "Master toggle for all notifications",
      icon: Bell,
    },
    {
      id: "achievement_alerts",
      label: "Achievement Alerts",
      description: "Get notified when you unlock badges",
      icon: Trophy,
    },
    {
      id: "friend_alerts",
      label: "Friend Alerts",
      description: "Friend requests and social notifications",
      icon: Users,
    },
    {
      id: "reminder_alerts",
      label: "Task Reminders",
      description: "Reminders for scheduled tasks",
      icon: Clock,
    },
    {
      id: "system_alerts",
      label: "System Notifications",
      description: "Important system updates and alerts",
      icon: AlertCircle,
    },
  ] as const

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>Configure how you receive notifications from NathanIs Hub</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {settingsItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor={item.id} className="font-medium">
                  {item.label}
                </Label>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <Switch
              id={item.id}
              checked={formState[item.id]}
              onCheckedChange={() => handleToggle(item.id)}
              disabled={item.id !== "notifications_enabled" && !formState.notifications_enabled}
            />
          </div>
        ))}

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}
