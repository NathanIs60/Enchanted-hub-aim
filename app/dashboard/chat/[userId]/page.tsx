import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ChatView } from "@/components/social/chat-view"

interface ChatPageProps {
  params: Promise<{ userId: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Verify friendship exists
  const { data: friendship } = await supabase
    .from("friendships")
    .select("*")
    .eq("status", "accepted")
    .or(
      `and(requester_id.eq.${user.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${user.id})`,
    )
    .single()

  if (!friendship) {
    redirect("/dashboard/friends")
  }

  // Get friend's profile
  const { data: friendProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  // Get existing messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
    .order("created_at", { ascending: true })

  // Mark messages as read
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("sender_id", userId)
    .eq("receiver_id", user.id)
    .eq("is_read", false)

  return (
    <ChatView
      currentUserId={user.id}
      friendId={userId}
      friendProfile={friendProfile}
      initialMessages={messages || []}
    />
  )
}
