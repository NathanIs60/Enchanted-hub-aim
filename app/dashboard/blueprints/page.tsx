import { createClient } from "@/lib/supabase/server"
import { BlueprintsView } from "@/components/blueprints/blueprints-view"

export const metadata = {
  title: "Blueprints | NathanIs Enchanted Hub",
  description: "Discover and share productivity blueprints",
}

export default async function BlueprintsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get public blueprints
  const { data: publicBlueprints } = await supabase
    .from("blueprints")
    .select("*")
    .eq("is_public", true)
    .order("clone_count", { ascending: false })

  // Get authors for public blueprints
  let publicBlueprintsWithAuthors = []
  if (publicBlueprints && publicBlueprints.length > 0) {
    const authorIds = [...new Set(publicBlueprints.map(bp => bp.user_id))]
    const { data: authors } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, handle, is_verified")
      .in("id", authorIds)

    const authorsMap = new Map(authors?.map(author => [author.id, author]) || [])
    
    publicBlueprintsWithAuthors = publicBlueprints.map(blueprint => ({
      ...blueprint,
      author: authorsMap.get(blueprint.user_id) || {
        id: blueprint.user_id,
        display_name: "Unknown User",
        avatar_url: null,
        handle: null,
        is_verified: false,
      }
    }))
  }

  // Get user's own blueprints
  const { data: myBlueprints } = await supabase
    .from("blueprints")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  // Get user's liked blueprints
  const { data: likedBlueprints } = await supabase
    .from("blueprint_likes")
    .select("blueprint_id")
    .eq("user_id", user?.id)

  const likedIds = new Set(likedBlueprints?.map((l) => l.blueprint_id) || [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Blueprints</h2>
        <p className="text-muted-foreground">Discover and share productivity routines</p>
      </div>

      <BlueprintsView
        publicBlueprints={publicBlueprintsWithAuthors}
        myBlueprints={myBlueprints || []}
        likedIds={likedIds}
        currentUserId={user?.id || ""}
      />
    </div>
  )
}
