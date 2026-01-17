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
  
  console.log("Debug - User ID:", user.id)
  console.log("Debug - Attempting to fetch friendships...")
  console.log("Debug - Supabase client:", !!supabase)
  
  try {
    // First, let's test if we can access any table
    const { data: testData, error: testError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
    
    console.log("Debug - Profiles test:", { testData: testData?.length, testError })
    
    // Check if friendships table exists by trying to access it
    const { data: tableCheck, error: tableError } = await supabase
      .from("friendships")
      .select("count", { count: "exact", head: true })
    
    console.log("Debug - Table existence check:", { tableCheck, tableError })
    
    // Try a simple friendships query first
    const { data: simpleFriendships, error: simpleError } = await supabase
      .from("friendships")
      .select("*")
      .limit(1)
    
    console.log("Debug - Simple friendships test:", { simpleFriendships, simpleError })
    
    // If simple query also fails, definitely a missing table
    if (simpleError) {
      console.error("Simple friendships query failed:", simpleError)
      hasError = true
      errorMessage = "Friendships table does not exist"
    }
    
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

    console.log("Debug - Friendships query result:", { friendshipsData, friendshipsError })

    console.log("Debug - Friendships query result:", { friendshipsData, friendshipsError })

    if (friendshipsError) {
      console.error("Error fetching friendships:", friendshipsError)
      console.error("Error type:", typeof friendshipsError)
      console.error("Error constructor:", friendshipsError.constructor.name)
      console.error("Error keys:", Object.keys(friendshipsError))
      console.error("Error values:", Object.values(friendshipsError))
      
      // Try different ways to extract error info
      const errorInfo = {
        message: friendshipsError.message || friendshipsError.msg || friendshipsError.error || "Unknown error",
        code: friendshipsError.code || friendshipsError.status || friendshipsError.statusCode,
        details: friendshipsError.details || friendshipsError.detail,
        hint: friendshipsError.hint,
        full_error: JSON.stringify(friendshipsError, null, 2),
        string_representation: String(friendshipsError),
        error_toString: friendshipsError.toString()
      }
      
      console.error("Processed error details:", errorInfo)
      
      errorMessage = errorInfo.message
      
      // Since we're getting an empty error object, assume it's a missing table
      // This is likely a Supabase client issue where the table doesn't exist
      hasError = true
      
    } else {
      friendships = friendshipsData || []
      console.log("Debug - Successfully fetched friendships:", friendships.length)
    }
  } catch (error: any) {
    console.error("Friends feature error:", error)
    errorMessage = error.message || "Unknown error"
    hasError = true
  }

  // If there's an error (likely missing table), show migration info
  if (hasError) {
    const displayError = errorMessage || "Database table 'friendships' does not exist"
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Friends</h2>
          <p className="text-muted-foreground">Connect with other NathanIs users</p>
        </div>
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/20 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Database Error:</strong> {displayError}
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            This usually means the friendships table hasn't been created yet. Please run the migration script below.
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
