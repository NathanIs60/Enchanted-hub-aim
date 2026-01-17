"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  Copy, 
  BadgeCheck, 
  CheckCircle, 
  Globe, 
  Lock, 
  ArrowLeft,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  User
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import type { Blueprint, Profile } from "@/lib/types/database"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { EditBlueprintDialog } from "./edit-blueprint-dialog"

interface BlueprintDetailViewProps {
  blueprint: Blueprint & { author: Profile }
  isLiked: boolean
  currentUserId: string
  isOwner: boolean
}

const categoryColors: Record<string, string> = {
  study: "bg-blue-500/10 text-blue-500",
  fitness: "bg-green-500/10 text-green-500",
  productivity: "bg-purple-500/10 text-purple-500",
  gaming: "bg-red-500/10 text-red-500",
  lifestyle: "bg-orange-500/10 text-orange-500",
  general: "bg-gray-500/10 text-gray-500",
}

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-500",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
}

export function BlueprintDetailView({ blueprint, isLiked, currentUserId, isOwner }: BlueprintDetailViewProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(blueprint.likes_count)
  const [isCloning, setIsCloning] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const authorInitials = blueprint.author?.display_name?.slice(0, 2).toUpperCase() || "??"
  const taskCount = blueprint.tasks?.length || 0

  const handleLike = async () => {
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

  const handleClone = async () => {
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

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("blueprints").delete().eq("id", blueprint.id)
    
    if (!error) {
      toast({
        title: "Blueprint deleted",
      })
      router.push("/dashboard/blueprints")
    } else {
      toast({
        title: "Failed to delete blueprint",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{blueprint.title}</h1>
          <p className="text-muted-foreground">Blueprint Details</p>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Blueprint Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn("text-xs", categoryColors[blueprint.category])}>
                      {blueprint.category}
                    </Badge>
                    {blueprint.is_public ? (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    {blueprint.is_approved && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  {blueprint.description && (
                    <p className="text-muted-foreground">{blueprint.description}</p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Tasks ({taskCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {blueprint.tasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
                        {task.priority}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={blueprint.author.avatar_url || undefined} />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{blueprint.author.display_name}</p>
                    {blueprint.author.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  </div>
                  {blueprint.author.handle && (
                    <p className="text-sm text-muted-foreground">@{blueprint.author.handle}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Likes</span>
                <span className="font-medium">{likesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Clones</span>
                <span className="font-medium">{blueprint.clone_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks</span>
                <span className="font-medium">{taskCount}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Created {new Date(blueprint.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {!isOwner && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className={cn("w-full", liked && "text-red-500")} 
                    onClick={handleLike}
                  >
                    <Heart className={cn("mr-2 h-4 w-4", liked && "fill-current")} />
                    {liked ? "Liked" : "Like"} ({likesCount})
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={handleClone} 
                    disabled={isCloning}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {isCloning ? "Cloning..." : "Clone Blueprint"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <EditBlueprintDialog 
        blueprint={blueprint} 
        open={editOpen} 
        onOpenChange={setEditOpen} 
      />
    </div>
  )
}