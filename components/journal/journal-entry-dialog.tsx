"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import type { DailyLog, Aim, Game } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface JournalEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  existingLog?: DailyLog
  aims: Pick<Aim, "id" | "title">[]
  games: Pick<Game, "id" | "title">[]
}

const moods = [
  { value: "great", label: "Great", color: "bg-green-500" },
  { value: "good", label: "Good", color: "bg-emerald-400" },
  { value: "neutral", label: "Okay", color: "bg-gray-400" },
  { value: "bad", label: "Bad", color: "bg-orange-400" },
  { value: "terrible", label: "Terrible", color: "bg-red-500" },
] as const

export function JournalEntryDialog({ open, onOpenChange, date, existingLog, aims, games }: JournalEntryDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState<string | undefined>()
  const [linkedAimId, setLinkedAimId] = useState<string | undefined>()
  const [linkedGameId, setLinkedGameId] = useState<string | undefined>()
  const router = useRouter()

  useEffect(() => {
    if (existingLog) {
      setTitle(existingLog.title || "")
      const contentData = existingLog.content as { blocks?: Array<{ data?: { text?: string } }> }
      setContent(contentData?.blocks?.[0]?.data?.text || "")
      setMood(existingLog.mood || undefined)
      setLinkedAimId(existingLog.linked_aim_id || undefined)
      setLinkedGameId(existingLog.linked_game_id || undefined)
    } else {
      setTitle("")
      setContent("")
      setMood(undefined)
      setLinkedAimId(undefined)
      setLinkedGameId(undefined)
    }
  }, [existingLog, open])

  const handleSave = async () => {
    if (!date) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const logData = {
        user_id: user.id,
        log_date: format(date, "yyyy-MM-dd"),
        title: title || null,
        content: { blocks: [{ type: "paragraph", data: { text: content } }] },
        mood: mood || null,
        linked_aim_id: linkedAimId || null,
        linked_game_id: linkedGameId || null,
      }

      if (existingLog) {
        const { error } = await supabase.from("daily_logs").update(logData).eq("id", existingLog.id)
        if (error) throw error
        toast.success("Entry updated")
      } else {
        const { error } = await supabase.from("daily_logs").insert(logData)
        if (error) throw error
        toast.success("Entry created")
      }

      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error("Failed to save entry")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingLog) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("daily_logs").delete().eq("id", existingLog.id)
      if (error) throw error
      toast.success("Entry deleted")
      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error("Failed to delete entry")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{date && format(date, "EEEE, MMMM d, yyyy")}</DialogTitle>
          <DialogDescription>
            {existingLog ? "Edit your journal entry" : "Create a new journal entry"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>How are you feeling?</Label>
            <div className="flex gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(mood === m.value ? undefined : m.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-lg border border-border/50 p-2 transition-colors hover:bg-accent",
                    mood === m.value && "border-primary bg-primary/10",
                  )}
                >
                  <span className={cn("h-4 w-4 rounded-full", m.color)} />
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="Give your entry a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write about your day..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] bg-background/50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Link to Aim (optional)</Label>
              <Select value={linkedAimId || "none"} onValueChange={(v) => setLinkedAimId(v === "none" ? undefined : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an aim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {aims.map((aim) => (
                    <SelectItem key={aim.id} value={aim.id}>
                      {aim.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Link to Game (optional)</Label>
              <Select
                value={linkedGameId || "none"}
                onValueChange={(v) => setLinkedGameId(v === "none" ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {existingLog ? (
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {existingLog ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
