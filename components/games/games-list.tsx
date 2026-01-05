"use client"

import { useState } from "react"
import type { Game } from "@/lib/types/database"
import { GameCard } from "./game-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Gamepad2 } from "lucide-react"

interface GamesListProps {
  games: Game[]
}

export function GamesList({ games }: GamesListProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = activeTab === "all" || game.status === activeTab
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: games.length,
    playing: games.filter((g) => g.status === "playing").length,
    completed: games.filter((g) => g.status === "completed").length,
    backlog: games.filter((g) => g.status === "backlog").length,
    paused: games.filter((g) => g.status === "paused").length,
    dropped: games.filter((g) => g.status === "dropped").length,
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background/50"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="playing">Playing ({statusCounts.playing})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
          <TabsTrigger value="backlog">Backlog ({statusCounts.backlog})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20 py-12">
              <Gamepad2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No games found</h3>
              <p className="text-sm text-muted-foreground">
                {search ? "Try a different search term" : "Add your first game to get started"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
