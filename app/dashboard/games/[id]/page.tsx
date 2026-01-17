import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { GameDetailView } from "@/components/games/game-detail-view"

interface GamePageProps {
  params: Promise<{ id: string }>
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: game, error } = await supabase.from("games").select("*").eq("id", id).single()

  if (error || !game) {
    notFound()
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("game_id", id)
    .order("sort_order", { ascending: true })

  return <GameDetailView game={game} tasks={tasks || []} />
}
