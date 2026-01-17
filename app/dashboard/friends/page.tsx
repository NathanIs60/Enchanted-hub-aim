import { createClient } from "@/lib/supabase/server"
import { FriendsView } from "@/components/social/friends-view"
import { FriendsMigrationInfo } from "@/components/social/friends-migration-info"

export const metadata = {
  title: "Friends | NathanIs Enchanted Hub",
  description: "Connect with friends on NathanIs Enchanted Hub",
}

export default async function FriendsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to view friends</div>
  }

  // Try to get user's friendships with error handling
  let friendships: any[] = []
  let hasError = false
  let errorMessage = ""
  
  try {
    const { data: friendshipsData, error: friendshipsError } = await supabase
      .from("friendships")
      .select(
        `
        *,
        requester:profiles!friendships_requester_id_fkey(id, display_name, avatar_url, handle, is_verified),
        addressee:profiles!friendships_addressee_id_fkey(id, display_name, avatar_url, handle, is_verified)
      `,
      )
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

    if (friendshipsError) {
      console.error("Error fetching friendships:", friendshipsError)
      errorMessage = friendshipsError.message
      if (friendshipsError.message.includes("relation") && friendshipsError.message.includes("does not exist")) {
        hasError = true
      } else if (friendshipsError.code === "42P01") {
        // PostgreSQL error code for undefined table
        hasError = true
      }
    } else {
      friendships = friendshipsData || []
    }
  } catch (error: any) {
    console.error("Friends feature error:", error)
    errorMessage = error.message || "Unknown error"
    hasError = true
  }

  // If there's an error (likely missing table), show migration info
  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Friends</h2>
          <p className="text-muted-foreground">Connect with other NathanIs users</p>
        </div>
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/20 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Database Error:</strong> {errorMessage}
          </p>
        </div>
        <FriendsMigrationInfo />
      </div>
    )
  }

  // Get pending friend requests (where user is addressee)
  const pendingRequests = friendships.filter((f) => f.status === "pending" && f.addressee_id === user.id)

  // Get accepted friends
  const friends = friendships
    .filter((f) => f.status === "accepted")
    .map((f) => ({
      ...f,
      friend: f.requester_id === user.id ? f.addressee : f.requester,
    }))

  // Get sent requests
  const sentRequests = friendships.filter((f) => f.status === "pending" && f.requester_id === user.id)

  console.log("Debug - Friendships data:", {
    total: friendships.length,
    pendingRequests: pendingRequests.length,
    friends: friends.length,
    sentRequests: sentRequests.length,
  })

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
        currentUserId={user.id}
      />
    </div>
  )
}
