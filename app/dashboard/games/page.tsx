import { createClient } from "@/lib/supabase/server"
import { GamesList } from "@/components/games/games-list"
import { AddGameDialog } from "@/components/games/add-game-dialog"

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Game Library</h2>
          <p className="text-muted-foreground">Track your gaming progress and achievements</p>
        </div>
        <AddGameDialog />
      </div>

      <GamesList games={games || []} />
    </div>
  )
}
