"use client"

import type { Resource } from "@/lib/types/database"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Play, ExternalLink, Trash2, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils/youtube"

interface MediaCardProps {
  resource: Resource
}

const typeColors: Record<Resource["resource_type"], string> = {
  youtube: "bg-red-500/10 text-red-600 dark:text-red-400",
  article: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  document: "bg-green-500/10 text-green-600 dark:text-green-400",
  other: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export function MediaCard({ resource }: MediaCardProps) {
  const router = useRouter()

  const videoId = resource.resource_type === "youtube" ? extractYouTubeId(resource.url) : null
  const thumbnail = resource.thumbnail_url || (videoId ? getYouTubeThumbnail(videoId) : null)

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("resources").delete().eq("id", resource.id)

    if (error) {
      toast.error("Failed to delete resource")
    } else {
      toast.success("Resource deleted")
      router.refresh()
    }
  }

  const handleToggleWatched = async () => {
    const supabase = createClient()
    const { error } = await supabase
      .from("resources")
      .update({ is_watched: !resource.is_watched })
      .eq("id", resource.id)

    if (error) {
      toast.error("Failed to update resource")
    } else {
      router.refresh()
    }
  }

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail || "/placeholder.svg"}
              alt={resource.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground/20">
                {resource.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          {resource.is_watched && (
            <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
              <Check className="h-4 w-4" />
            </div>
          )}
          {resource.resource_type === "youtube" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-red-600">
                <Play className="h-6 w-6 fill-current" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge className={typeColors[resource.resource_type]}>
            {resource.resource_type.charAt(0).toUpperCase() + resource.resource_type.slice(1)}
          </Badge>
        </div>
        <h3 className="line-clamp-2 font-semibold">{resource.title}</h3>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href={`/dashboard/media/${resource.id}`}>
              <Play className="mr-1.5 h-3.5 w-3.5" />
              View
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleWatched}>
                <Check className="mr-2 h-4 w-4" />
                {resource.is_watched ? "Mark as Unwatched" : "Mark as Watched"}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Original
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}
