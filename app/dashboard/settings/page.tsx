import { createClient } from "@/lib/supabase/server"
import { SettingsView } from "@/components/settings/settings-view"

export const metadata = {
  title: "Settings | NathanIs Enchanted Hub",
  description: "Manage your account settings and preferences",
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [profileResult, notificationSettingsResult, statsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user?.id).single(),
    supabase.from("notification_settings").select("*").eq("user_id", user?.id).single(),
    supabase.from("user_stats").select("*").eq("user_id", user?.id).single(),
  ])

  return (
    <SettingsView
      user={user}
      profile={profileResult.data}
      notificationSettings={notificationSettingsResult.data}
      stats={statsResult.data}
    />
  )
}
