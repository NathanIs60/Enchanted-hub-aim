import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditGameForm } from "@/components/games/edit-game-form"

interface EditGamePageProps {
  params: Promise<{ id: string }>
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: game, error } = await supabase.from("games").select("*").eq("id", id).single()

  if (error || !game) {
    notFound()
  }

  // Check if user owns this game
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || game.user_id !== user.id) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Game</h2>
        <p className="text-muted-foreground">Update your game information</p>
      </div>

      <EditGameForm game={game} />
    </div>
  )
}