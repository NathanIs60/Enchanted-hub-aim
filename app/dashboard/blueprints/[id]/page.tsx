import { createClient } from "@/lib/supabase/server"
import { BlueprintDetailView } from "@/components/blueprints/blueprint-detail-view"
import { notFound } from "next/navigation"

interface BlueprintDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BlueprintDetailPage({ params }: BlueprintDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get blueprint
  const { data: blueprint, error: blueprintError } = await supabase
    .from("blueprints")
    .select("*")
    .eq("id", id)
    .single()

  if (blueprintError || !blueprint) {
    notFound()
  }

  // Get author information
  const { data: author } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, handle, is_verified")
    .eq("id", blueprint.user_id)
    .single()

  // Combine blueprint with author
  const blueprintWithAuthor = {
    ...blueprint,
    author: author || {
      id: blueprint.user_id,
      display_name: "Unknown User",
      avatar_url: null,
      handle: null,
      is_verified: false,
    }
  }

  // Check if user can view this blueprint
  const canView = blueprint.is_public || blueprint.user_id === user?.id

  if (!canView) {
    notFound()
  }

  // Get user's like status
  const { data: likeData } = await supabase
    .from("blueprint_likes")
    .select("id")
    .eq("user_id", user?.id || "")
    .eq("blueprint_id", blueprint.id)
    .single()

  const isLiked = !!likeData

  return (
    <BlueprintDetailView
      blueprint={blueprintWithAuthor}
      isLiked={isLiked}
      currentUserId={user?.id || ""}
      isOwner={blueprint.user_id === user?.id}
    />
  )
}