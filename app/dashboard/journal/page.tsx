import { createClient } from "@/lib/supabase/server"
import { JournalView } from "@/components/journal/journal-view"

export default async function JournalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user?.id)
    .order("log_date", { ascending: false })

  const { data: aims } = await supabase.from("aims").select("id, title").eq("user_id", user?.id)

  const { data: games } = await supabase.from("games").select("id, title").eq("user_id", user?.id)

  return <JournalView logs={logs || []} aims={aims || []} games={games || []} />
}
