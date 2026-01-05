"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User } from "lucide-react"
import { toast } from "sonner"

interface SettingsViewProps {
  user: {
    id: string
    email?: string
  } | null
  profile: Profile | null
}

export function SettingsView({ user, profile }: SettingsViewProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const initials = displayName?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || "U"

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
      })

      if (error) throw error
      toast.success("Profile updated")
      router.refresh()
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName || "Avatar"} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/50 bg-background/50 p-4">
              <h4 className="font-medium">Account ID</h4>
              <p className="mt-1 text-sm text-muted-foreground font-mono">{user?.id}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-background/50 p-4">
              <h4 className="font-medium">Member Since</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
