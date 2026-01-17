"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Resource, MediaFolder } from "@/lib/types/database"
import { MediaCard } from "./media-card"
import { FolderCard } from "./folder-card"
import { CreateFolderDialog } from "./create-folder-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Youtube, ArrowLeft, Folder } from "lucide-react"
import Link from "next/link"

interface MediaListProps {
  resources: Resource[]
  folders: MediaFolder[]
  currentFolder?: MediaFolder | null
}

export function MediaList({ resources, folders, currentFolder }: MediaListProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const searchParams = useSearchParams()
  const folderId = searchParams.get("folder")

  // Filter resources based on current folder
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase())
    const matchesType = activeTab === "all" || resource.resource_type === activeTab
    const matchesFolder = folderId ? resource.folder_id === folderId : !resource.folder_id
    return matchesSearch && matchesType && matchesFolder
  })

  // Only show folders if we're not in a specific folder
  const showFolders = !folderId

  const typeCounts = {
    all: filteredResources.length,
    youtube: filteredResources.filter((r) => r.resource_type === "youtube").length,
    article: filteredResources.filter((r) => r.resource_type === "article").length,
    document: filteredResources.filter((r) => r.resource_type === "document").length,
    other: filteredResources.filter((r) => r.resource_type === "other").length,
  }

  // Count resources in each folder
  const folderResourceCounts = folders.reduce((acc, folder) => {
    acc[folder.id] = resources.filter(r => r.folder_id === folder.id).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-4">
      {/* Breadcrumb and folder actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentFolder && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/media">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Media Hub
              </Link>
            </Button>
          )}
          {currentFolder && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Folder className="h-4 w-4" />
              <span>{currentFolder.name}</span>
            </div>
          )}
        </div>
        {showFolders && <CreateFolderDialog />}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background/50"
        />
      </div>

      {/* Show folders if not in a specific folder */}
      {showFolders && folders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Folders</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                resourceCount={folderResourceCounts[folder.id] || 0}
              />
            ))}
          </div>
        </div>
      )}

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
              <h3 className="mt-4 text-lg font-medium">
                {currentFolder ? `No resources in ${currentFolder.name}` : "No resources found"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {search ? "Try a different search term" : "Add your first resource to get started"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <MediaCard key={resource.id} resource={resource} folders={folders} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
