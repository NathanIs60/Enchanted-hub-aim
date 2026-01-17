"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, Users, Bell, Send } from "lucide-react"
import { FriendCard } from "./friend-card"
import { FriendRequestCard } from "./friend-request-card"
import { UserSearchDialog } from "./user-search-dialog"
import type { Friendship, Profile } from "@/lib/types/database"

interface FriendsViewProps {
  friends: Array<Friendship & { friend: Profile }>
  pendingRequests: Friendship[]
  sentRequests: Friendship[]
  currentUserId: string
}

export function FriendsView({ friends, pendingRequests, sentRequests, currentUserId }: FriendsViewProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFriends = friends.filter(
    (f) =>
      f.friend?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.friend?.handle?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setSearchOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Find Users
        </Button>
      </div>

      <Tabs defaultValue="friends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="friends" className="gap-2">
            <Users className="h-4 w-4" />
            Friends ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2">
            <Bell className="h-4 w-4" />
            Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="h-4 w-4" />
            Sent ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          {filteredFriends.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium">No friends yet</p>
                <p className="text-sm text-muted-foreground">Find users and send friend requests to connect</p>
                <Button className="mt-4" onClick={() => setSearchOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Find Users
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFriends.map((friendship) => (
                <FriendCard key={friendship.id} friend={friendship.friend} friendshipId={friendship.id} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium">No pending requests</p>
                <p className="text-sm text-muted-foreground">Friend requests you receive will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <FriendRequestCard key={request.id} request={request} type="received" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Send className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium">No sent requests</p>
                <p className="text-sm text-muted-foreground">Requests you send will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sentRequests.map((request) => (
                <FriendRequestCard key={request.id} request={request} type="sent" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <UserSearchDialog open={searchOpen} onOpenChange={setSearchOpen} currentUserId={currentUserId} />
    </>
  )
}
