"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Resource } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/utils/youtube"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ExternalLink, Save, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface MediaDetailViewProps {
  resource: Resource
}

export function MediaDetailView({ resource }: MediaDetailViewProps) {
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const videoId = resource.resource_type === "youtube" ? extractYouTubeId(resource.url) : null
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : null

  useEffect(() => {
    const notesData = resource.notes as { content?: string }
    setNotes(notesData?.content || "")
  }, [resource.notes])

  const handleSaveNotes = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("resources")
        .update({
          notes: { content: notes },
          is_watched: true,
        })
        .eq("id", resource.id)

      if (error) throw error
      toast.success("Notes saved")
      router.refresh()
    } catch {
      toast.error("Failed to save notes")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/media">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight line-clamp-1">{resource.title}</h2>
        </div>
        <Button variant="outline" asChild>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Original
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video Player */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardContent className="p-0">
            {embedUrl ? (
              <div className="relative aspect-video">
                <iframe
                  src={embedUrl}
                  title={resource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted">
                <p className="text-muted-foreground">Preview not available for this resource type</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Notes</CardTitle>
            <Button onClick={handleSaveNotes} disabled={isSaving} size="sm">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Notes
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Take notes while watching..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[300px] resize-none bg-background/50"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
