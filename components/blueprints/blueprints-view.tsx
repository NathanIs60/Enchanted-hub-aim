"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Globe, User, BookMarked } from "lucide-react"
import { BlueprintCard } from "./blueprint-card"
import { CreateBlueprintDialog } from "./create-blueprint-dialog"
import type { Blueprint, Profile } from "@/lib/types/database"

interface BlueprintsViewProps {
  publicBlueprints: Array<Blueprint & { author: Profile }>
  myBlueprints: Blueprint[]
  likedIds: Set<string>
  currentUserId: string
}

export function BlueprintsView({ publicBlueprints, myBlueprints, likedIds, currentUserId }: BlueprintsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

  const filteredPublic = publicBlueprints.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredMy = myBlueprints.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blueprints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Blueprint
        </Button>
      </div>

      <Tabs defaultValue="discover" className="space-y-4">
        <TabsList>
          <TabsTrigger value="discover" className="gap-2">
            <Globe className="h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="mine" className="gap-2">
            <User className="h-4 w-4" />
            My Blueprints ({myBlueprints.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          {filteredPublic.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-card/50 py-12 backdrop-blur-sm">
              <BookMarked className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No blueprints found</p>
              <p className="text-sm text-muted-foreground">Be the first to share a blueprint!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPublic.map((blueprint) => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  isLiked={likedIds.has(blueprint.id)}
                  currentUserId={currentUserId}
                  showAuthor
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine" className="space-y-4">
          {filteredMy.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-card/50 py-12 backdrop-blur-sm">
              <BookMarked className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No blueprints yet</p>
              <p className="text-sm text-muted-foreground">Create your first blueprint to share your routines</p>
              <Button className="mt-4" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Blueprint
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMy.map((blueprint) => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  isLiked={false}
                  currentUserId={currentUserId}
                  isOwner
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateBlueprintDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
