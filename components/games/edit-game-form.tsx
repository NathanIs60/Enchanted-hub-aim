"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import type { Game } from "@/lib/types/database"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditGameFormProps {
  game: Game
}

const statusOptions = [
  { value: "playing", label: "Playing" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
  { value: "backlog", label: "Backlog" },
  { value: "dropped", label: "Dropped" },
]

const platformOptions = [
  { value: "PC", label: "PC" },
  { value: "PS5", label: "PlayStation 5" },
  { value: "PS4", label: "PlayStation 4" },
  { value: "Xbox Series X/S", label: "Xbox Series X/S" },
  { value: "Xbox One", label: "Xbox One" },
  { value: "Nintendo Switch", label: "Nintendo Switch" },
  { value: "Mobile", label: "Mobile" },
  { value: "Other", label: "Other" },
]

export function EditGameForm({ game }: EditGameFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: game.title,
    description: game.description || "",
    status: game.status,
    platform: game.platform || "",
    hours_played: game.hours_played,
    rating: game.rating || 0,
    cover_image: game.cover_image || "",
    started_at: game.started_at ? game.started_at.split('T')[0] : "",
    completed_at: game.completed_at ? game.completed_at.split('T')[0] : "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("games")
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          status: formData.status,
          platform: formData.platform || null,
          hours_played: formData.hours_played,
          rating: formData.rating || null,
          cover_image: formData.cover_image || null,
          started_at: formData.started_at || null,
          completed_at: formData.completed_at || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", game.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Game updated successfully",
      })

      router.push(`/dashboard/games/${game.id}`)
    } catch (error) {
      console.error("Error updating game:", error)
      toast({
        title: "Error",
        description: "Failed to update game",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/games/${game.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Game
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter game title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter game description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                type="url"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours_played">Hours Played</Label>
                <Input
                  id="hours_played"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.hours_played}
                  onChange={(e) => setFormData({ ...formData, hours_played: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="started_at">Started Date</Label>
                <Input
                  id="started_at"
                  type="date"
                  value={formData.started_at}
                  onChange={(e) => setFormData({ ...formData, started_at: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completed_at">Completed Date</Label>
                <Input
                  id="completed_at"
                  type="date"
                  value={formData.completed_at}
                  onChange={(e) => setFormData({ ...formData, completed_at: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href={`/dashboard/games/${game.id}`}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Game"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}