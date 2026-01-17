"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageCircle, MoreVertical, UserMinus, ShieldOff, BadgeCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types/database"

interface FriendCardProps {
  friend: Profile
  friendshipId: string
}

export function FriendCard({ friend, friendshipId }: FriendCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const initials = friend.display_name?.slice(0, 2).toUpperCase() || "??"

  const handleRemoveFriend = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.from("friendships").delete().eq("id", friendshipId)
    router.refresh()
    setIsLoading(false)
  }

  const handleBlock = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.from("friendships").update({ status: "blocked" }).eq("id", friendshipId)
    router.refresh()
    setIsLoading(false)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={friend.avatar_url || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-medium">{friend.display_name || "Unknown User"}</p>
                {friend.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
              </div>
              {friend.handle && <p className="text-sm text-muted-foreground">@{friend.handle}</p>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/chat/${friend.id}`)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleRemoveFriend} disabled={isLoading} className="text-destructive">
                <UserMinus className="mr-2 h-4 w-4" />
                Remove Friend
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlock} disabled={isLoading} className="text-destructive">
                <ShieldOff className="mr-2 h-4 w-4" />
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => router.push(`/dashboard/chat/${friend.id}`)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
