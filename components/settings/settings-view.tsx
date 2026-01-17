"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Profile, NotificationSettings as NotificationSettingsType, UserStats } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Settings, Bell } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { NotificationSettings } from "./notification-settings"
import { XpProgressBar } from "@/components/gamification/xp-progress-bar"
import { useLanguage } from "@/lib/contexts/language-context"

interface SettingsViewProps {
  user: {
    id: string
    email?: string
  } | null
  profile: Profile | null
  notificationSettings: NotificationSettingsType | null
  stats: UserStats | null
}

export function SettingsView({ user, profile, notificationSettings, stats }: SettingsViewProps) {
  const { language, setLanguage, t } = useLanguage()
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [handle, setHandle] = useState(profile?.handle || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: displayName || null,
        handle: handle || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
        is_public: isPublic,
        preferred_language: language,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      
      toast({
        title: t("settings.success"),
        description: t("settings.success"),
      })
      
      router.refresh()
    } catch (error) {
      toast({
        title: t("settings.error"),
        description: t("settings.error"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = async (newLanguage: "en" | "tr") => {
    await setLanguage(newLanguage)
    toast({
      title: t("settings.success"),
      description: t("settings.language.description"),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h2>
        <p className="text-muted-foreground">{t("settings.description")}</p>
      </div>

      {stats && <XpProgressBar xp={stats.xp} compact className="max-w-md" />}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            {t("settings.profile")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            {t("settings.notifications")}
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Settings className="h-4 w-4" />
            {t("settings.account")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and avatar</CardDescription>
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
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enter a URL to your profile picture (MAL-style)
                    </p>
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
                  <Label htmlFor="handle">Handle</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">@</span>
                    <Input
                      id="handle"
                      placeholder="yourhandle"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">This is your unique NathanIs handle for discovery</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
                  <div>
                    <Label htmlFor="isPublic">Public Profile</Label>
                    <p className="text-xs text-muted-foreground">Allow others to find and view your profile</p>
                  </div>
                  <Button variant={isPublic ? "default" : "outline"} size="sm" onClick={() => setIsPublic(!isPublic)}>
                    {isPublic ? "Public" : "Private"}
                  </Button>
                </div>

                <Button onClick={handleSave} disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("settings.save")}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Default Avatars</CardTitle>
                <CardDescription>Choose from our collection of avatars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    "/anime-avatar-blue-hair.jpg",
                    "/anime-avatar-red-hair.jpg",
                    "/anime-avatar-green-eyes.jpg",
                    "/anime-avatar-purple-aesthetic.jpg",
                    "/cute-cat-avatar.png",
                    "/pixel-art-character.png",
                    "/minimalist-face-avatar.jpg",
                    "/abstract-geometric-avatar.png",
                  ].map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatarUrl(url)}
                      className="overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-primary focus:border-primary"
                    >
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={url || "/placeholder.svg"} />
                        <AvatarFallback>{i + 1}</AvatarFallback>
                      </Avatar>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings settings={notificationSettings} userId={user?.id || ""} />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">{t("settings.language")}</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Dil seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="tr">Türkçe</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.language.description")}
                  </p>
                </div>

                <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                  <h4 className="font-medium">Account ID</h4>
                  <p className="mt-1 text-sm text-muted-foreground font-mono break-all">{user?.id}</p>
                </div>

                <div className="rounded-lg border border-border/50 bg-background/50 p-4">
                  <h4 className="font-medium">Member Since</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {stats && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Your activity summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
                    <span className="text-sm">Total XP</span>
                    <span className="font-bold text-primary">{stats.xp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
                    <span className="text-sm">Level</span>
                    <span className="font-bold">{stats.level}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
                    <span className="text-sm">Current Streak</span>
                    <span className="font-bold">{stats.current_streak} days</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
                    <span className="text-sm">Tasks Completed</span>
                    <span className="font-bold">{stats.total_tasks_completed}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
                    <span className="text-sm">Journal Entries</span>
                    <span className="font-bold">{stats.total_journal_entries}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
