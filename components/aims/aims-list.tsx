"use client"

import { useState } from "react"
import type { Aim } from "@/lib/types/database"
import { AimCard } from "./aim-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Target } from "lucide-react"

interface AimsListProps {
  aims: Aim[]
}

export function AimsList({ aims }: AimsListProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredAims = aims.filter((aim) => {
    const matchesSearch = aim.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = activeTab === "all" || aim.status === activeTab
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: aims.length,
    active: aims.filter((a) => a.status === "active").length,
    completed: aims.filter((a) => a.status === "completed").length,
    paused: aims.filter((a) => a.status === "paused").length,
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search aims..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background/50"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({statusCounts.active})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({statusCounts.paused})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredAims.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20 py-12">
              <Target className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No aims found</h3>
              <p className="text-sm text-muted-foreground">
                {search ? "Try a different search term" : "Add your first aim to get started"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAims.map((aim) => (
                <AimCard key={aim.id} aim={aim} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
