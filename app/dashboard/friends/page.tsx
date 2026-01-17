import { createClient } from "@/lib/supabase/server"
import { FriendsView } from "@/components/social/friends-view"

export const metadata = {
  title: "Friends | NathanIs Enchanted Hub",
  description: "Connect with friends on NathanIs Enchanted Hub",
}

export default async function FriendsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's friendships
  const { data: friendships } = await supabase
    .from("friendships")
    .select(
      `
      *,
      requester:profiles!friendships_requester_id_fkey(id, display_name, avatar_url, handle, is_verified),
      addressee:profiles!friendships_addressee_id_fkey(id, display_name, avatar_url, handle, is_verified)
    `,
    )
    .or(`requester_id.eq.${user?.id},addressee_id.eq.${user?.id}`)

  // Get pending friend requests (where user is addressee)
  const pendingRequests = friendships?.filter((f) => f.status === "pending" && f.addressee_id === user?.id) || []

  // Get accepted friends
  const friends =
    friendships
      ?.filter((f) => f.status === "accepted")
      .map((f) => ({
        ...f,
        friend: f.requester_id === user?.id ? f.addressee : f.requester,
      })) || []

  // Get sent requests
  const sentRequests = friendships?.filter((f) => f.status === "pending" && f.requester_id === user?.id) || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Friends</h2>
        <p className="text-muted-foreground">Connect with other NathanIs users</p>
      </div>

      <FriendsView
        friends={friends}
        pendingRequests={pendingRequests}
        sentRequests={sentRequests}
        currentUserId={user?.id || ""}
      />
    </div>
  )
}
