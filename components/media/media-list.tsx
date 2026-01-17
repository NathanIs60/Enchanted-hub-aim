"use client"

import { useState } from "react"
import type { Resource } from "@/lib/types/database"
import { MediaCard } from "./media-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Youtube } from "lucide-react"

interface MediaListProps {
  resources: Resource[]
}

export function MediaList({ resources }: MediaListProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase())
    const matchesType = activeTab === "all" || resource.resource_type === activeTab
    return matchesSearch && matchesType
  })

  const typeCounts = {
    all: resources.length,
    youtube: resources.filter((r) => r.resource_type === "youtube").length,
    article: resources.filter((r) => r.resource_type === "article").length,
    document: resources.filter((r) => r.resource_type === "document").length,
    other: resources.filter((r) => r.resource_type === "other").length,
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background/50"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({typeCounts.all})</TabsTrigger>
          <TabsTrigger value="youtube">Videos ({typeCounts.youtube})</TabsTrigger>
          <TabsTrigger value="article">Articles ({typeCounts.article})</TabsTrigger>
          <TabsTrigger value="other">Other ({typeCounts.other + typeCounts.document})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20 py-12">
              <Youtube className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No resources found</h3>
              <p className="text-sm text-muted-foreground">
                {search ? "Try a different search term" : "Add your first resource to get started"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <MediaCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
