"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Loader2, BadgeCheck, UserCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types/database"

interface UserSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
}

export function UserSearchDialog({ open, onOpenChange, currentUserId }: UserSearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Profile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())
  const [existingFriends, setExistingFriends] = useState<Set<string>>(new Set())

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsSearching(true)
      const supabase = createClient()

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUserId)
        .or(`display_name.ilike.%${query}%,handle.ilike.%${query}%`)
        .limit(10)

      setResults(data || [])
      setIsSearching(false)
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [query, currentUserId])

  useEffect(() => {
    const loadExistingRelationships = async () => {
      const supabase = createClient()

      const { data: friendships } = await supabase
        .from("friendships")
        .select("requester_id, addressee_id, status")
        .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)

      const friends = new Set<string>()
      const pending = new Set<string>()

      friendships?.forEach((f) => {
        const otherId = f.requester_id === currentUserId ? f.addressee_id : f.requester_id
        if (f.status === "accepted") {
          friends.add(otherId)
        } else if (f.status === "pending" && f.requester_id === currentUserId) {
          pending.add(otherId)
        }
      })

      setExistingFriends(friends)
      setSentRequests(pending)
    }

    if (open) {
      loadExistingRelationships()
    }
  }, [open, currentUserId])

  const handleSendRequest = async (userId: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("friendships").insert({
      requester_id: currentUserId,
      addressee_id: userId,
      status: "pending",
    })

    if (!error) {
      setSentRequests((prev) => new Set([...prev, userId]))

      // Create notification for the other user
      await supabase.from("notifications").insert({
        user_id: userId,
        type: "friend_request",
        title: "New Friend Request",
        message: "You have a new friend request!",
        data: { from_user_id: currentUserId },
      })

      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find Users</DialogTitle>
          <DialogDescription>Search for other NathanIs users by name or handle</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or @handle..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-[300px] space-y-2 overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isSearching && query.length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No users found matching "{query}"</div>
          )}

          {!isSearching &&
            results.map((user) => {
              const initials = user.display_name?.slice(0, 2).toUpperCase() || "??"
              const isFriend = existingFriends.has(user.id)
              const isPending = sentRequests.has(user.id)

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-medium">{user.display_name || "Unknown"}</p>
                        {user.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                      </div>
                      {user.handle && <p className="text-sm text-muted-foreground">@{user.handle}</p>}
                    </div>
                  </div>

                  {isFriend ? (
                    <Button size="sm" variant="secondary" disabled>
                      <UserCheck className="mr-1 h-4 w-4" />
                      Friends
                    </Button>
                  ) : isPending ? (
                    <Button size="sm" variant="outline" disabled>
                      Pending
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleSendRequest(user.id)}>
                      <UserPlus className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  )}
                </div>
              )
            })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
