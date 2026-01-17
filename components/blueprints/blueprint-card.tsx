"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Copy, BadgeCheck, CheckCircle, Globe, Lock, MoreVertical, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import type { Blueprint, Profile } from "@/lib/types/database"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { EditBlueprintDialog } from "./edit-blueprint-dialog"

interface BlueprintCardProps {
  blueprint: Blueprint & { author?: Profile }
  isLiked: boolean
  currentUserId: string
  showAuthor?: boolean
  isOwner?: boolean
}

const categoryColors: Record<string, string> = {
  study: "bg-blue-500/10 text-blue-500",
  fitness: "bg-green-500/10 text-green-500",
  productivity: "bg-purple-500/10 text-purple-500",
  gaming: "bg-red-500/10 text-red-500",
  lifestyle: "bg-orange-500/10 text-orange-500",
  general: "bg-gray-500/10 text-gray-500",
}

export function BlueprintCard({
  blueprint,
  isLiked,
  currentUserId,
  showAuthor = false,
  isOwner = false,
}: BlueprintCardProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(blueprint.likes_count)
  const [isCloning, setIsCloning] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const authorInitials = blueprint.author?.display_name?.slice(0, 2).toUpperCase() || "??"
  const taskCount = blueprint.tasks?.length || 0

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, [role="button"]')) {
      return
    }
    router.push(`/dashboard/blueprints/${blueprint.id}`)
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const supabase = createClient()

    if (liked) {
      await supabase.from("blueprint_likes").delete().eq("user_id", currentUserId).eq("blueprint_id", blueprint.id)

      await supabase
        .from("blueprints")
        .update({ likes_count: likesCount - 1 })
        .eq("id", blueprint.id)

      setLikesCount((prev) => prev - 1)
    } else {
      await supabase.from("blueprint_likes").insert({
        user_id: currentUserId,
        blueprint_id: blueprint.id,
      })

      await supabase
        .from("blueprints")
        .update({ likes_count: likesCount + 1 })
        .eq("id", blueprint.id)

      setLikesCount((prev) => prev + 1)
    }

    setLiked(!liked)
  }

  const handleClone = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCloning(true)
    const supabase = createClient()

    // Create tasks from blueprint
    const tasks = blueprint.tasks.map((task, index) => ({
      user_id: currentUserId,
      title: task.title,
      description: task.description || null,
      priority: task.priority,
      status: "pending" as const,
      category: "general" as const,
      sort_order: index,
    }))

    const { error } = await supabase.from("tasks").insert(tasks)

    if (!error) {
      // Update clone count
      await supabase
        .from("blueprints")
        .update({ clone_count: blueprint.clone_count + 1 })
        .eq("id", blueprint.id)

      toast({
        title: "Blueprint cloned!",
        description: `${taskCount} tasks added to your list`,
      })

      router.push("/dashboard/tasks")
    } else {
      toast({
        title: "Failed to clone blueprint",
        variant: "destructive",
      })
    }

    setIsCloning(false)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const supabase = createClient()
    const { error } = await supabase.from("blueprints").delete().eq("id", blueprint.id)
    
    if (!error) {
      toast({
        title: "Blueprint deleted",
      })
      router.refresh()
    } else {
      toast({
        title: "Failed to delete blueprint",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card 
        className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{blueprint.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn("text-xs", categoryColors[blueprint.category])}>
                  {blueprint.category}
                </Badge>
                {blueprint.is_public ? (
                  <Globe className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground" />
                )}
                {blueprint.is_approved && <CheckCircle className="h-3 w-3 text-green-500" />}
              </div>
            </div>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          {blueprint.description && <p className="text-sm text-muted-foreground line-clamp-2">{blueprint.description}</p>}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {taskCount} tasks
            </span>
            <span className="flex items-center gap-1">
              <Copy className="h-3 w-3" />
              {blueprint.clone_count} clones
            </span>
          </div>

          {showAuthor && blueprint.author && (
            <div className="mt-3 flex items-center gap-2 pt-3 border-t border-border/40">
              <Avatar className="h-6 w-6">
                <AvatarImage src={blueprint.author.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{blueprint.author.display_name}</span>
              {blueprint.author.is_verified && <BadgeCheck className="h-3 w-3 text-primary" />}
            </div>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          {!isOwner && (
            <>
              <Button variant="outline" size="sm" className={cn("flex-1", liked && "text-red-500")} onClick={handleLike}>
                <Heart className={cn("mr-1 h-4 w-4", liked && "fill-current")} />
                {likesCount}
              </Button>
              <Button size="sm" className="flex-1" onClick={handleClone} disabled={isCloning}>
                <Copy className="mr-1 h-4 w-4" />
                Clone
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      {isOwner && (
        <EditBlueprintDialog 
          blueprint={blueprint} 
          open={editOpen} 
          onOpenChange={setEditOpen} 
        />
      )}
    </>
  )
}
