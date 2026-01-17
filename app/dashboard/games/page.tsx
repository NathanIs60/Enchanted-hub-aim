import { createClient } from "@/lib/supabase/server"
import { GamesClient } from "./games-client"

export default async function GamesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user?.id)
    .order("updated_at", { ascending: false })

  return <GamesClient games={games || []} />
}
