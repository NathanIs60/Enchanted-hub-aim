"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { MediaFolder } from "@/lib/types/database"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, FolderOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FolderCardProps {
  folder: MediaFolder
  resourceCount: number
  onEdit?: (folder: MediaFolder) => void
  isDragMode?: boolean
  onResourceDrop?: (resourceId: string, folderId: string) => void
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  green: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  red: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400",
  pink: "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400",
  gray: "bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400",
}

const iconMap: Record<string, string> = {
  folder: "📁",
  star: "⭐",
  heart: "❤️",
  book: "📚",
  video: "🎥",
  music: "🎵",
  game: "🎮",
  work: "💼",
  study: "📖",
  clock: "🕐",
}

export function FolderCard({ folder, resourceCount, onEdit, isDragMode = false, onResourceDrop }: FolderCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    if (!isDragMode) return
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isDragMode) return
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!isDragMode) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const resourceId = e.dataTransfer.getData("text/plain")
    if (resourceId && onResourceDrop) {
      onResourceDrop(resourceId, folder.id)
    }
  }

  const handleDelete = async () => {
    if (resourceCount > 0) {
      toast({
        title: "Cannot delete folder",
        description: "Move or delete all resources in this folder first",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("media_folders").delete().eq("id", folder.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Folder deleted successfully",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting folder:", error)
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragMode) {
      e.preventDefault()
      return
    }
    router.push(`/dashboard/media?folder=${folder.id}`)
  }

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all hover:shadow-md",
        colorClasses[folder.color] || colorClasses.blue,
        isDragMode && "cursor-default",
        isDragOver && "ring-2 ring-primary ring-offset-2 scale-105"
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {iconMap[folder.icon || "folder"] || "📁"}
            </span>
            <div>
              <h3 className="font-semibold line-clamp-1">{folder.name}</h3>
              <p className="text-xs opacity-70">
                {resourceCount} {resourceCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleClick(e)
              }}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Open Folder
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onEdit(folder)
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }} 
                className="text-destructive focus:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {folder.description && (
        <CardContent className="pt-0">
          <p className="text-sm opacity-70 line-clamp-2">{folder.description}</p>
        </CardContent>
      )}
    </Card>
  )
}