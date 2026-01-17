"use client"

import type { Game } from "@/lib/types/database"
import { GamesList } from "@/components/games/games-list"
import { AddGameDialog } from "@/components/games/add-game-dialog"
import { useLanguage } from "@/lib/contexts/language-context"

interface GamesClientProps {
  games: Game[]
}

export function GamesClient({ games }: GamesClientProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("games.title")}</h2>
          <p className="text-muted-foreground">{t("games.description")}</p>
        </div>
        <AddGameDialog />
      </div>

      <GamesList games={games} />
    </div>
  )
}