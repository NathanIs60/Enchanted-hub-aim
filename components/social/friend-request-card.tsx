"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Check, X, Clock, BadgeCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Friendship } from "@/lib/types/database"
import { formatDistanceToNow } from "date-fns"

interface FriendRequestCardProps {
  request: Friendship
  type: "received" | "sent"
}

export function FriendRequestCard({ request, type }: FriendRequestCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const profile = type === "received" ? request.requester : request.addressee
  const initials = profile?.display_name?.slice(0, 2).toUpperCase() || "??"

  const handleAccept = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase
      .from("friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", request.id)
    router.refresh()
    setIsLoading(false)
  }

  const handleDecline = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase
      .from("friendships")
      .update({ status: "declined", updated_at: new Date().toISOString() })
      .eq("id", request.id)
    router.refresh()
    setIsLoading(false)
  }

  const handleCancel = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.from("friendships").delete().eq("id", request.id)
    router.refresh()
    setIsLoading(false)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-medium">{profile?.display_name || "Unknown User"}</p>
              {profile?.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {type === "received" ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAccept} disabled={isLoading}>
              <Check className="mr-1 h-4 w-4" />
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={handleDecline} disabled={isLoading}>
              <X className="mr-1 h-4 w-4" />
              Decline
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
