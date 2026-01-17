"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, BadgeCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Message, Profile } from "@/lib/types/database"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface ChatViewProps {
  currentUserId: string
  friendId: string
  friendProfile: Profile | null
  initialMessages: Message[]
}

export function ChatView({ currentUserId, friendId, friendProfile, initialMessages }: ChatViewProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const initials = friendProfile?.display_name?.slice(0, 2).toUpperCase() || "??"

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Subscribe to new messages in real-time
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(and(sender_id.eq.${currentUserId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${currentUserId}))`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })

          // Mark as read if we're the receiver
          if (newMsg.receiver_id === currentUserId) {
            supabase.from("messages").update({ is_read: true }).eq("id", newMsg.id)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, friendId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUserId,
        receiver_id: friendId,
        content: newMessage.trim(),
      })
      .select()
      .single()

    if (!error && data) {
      // Add to local state immediately for optimistic UI
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev
        return [...prev, data]
      })
    }

    setNewMessage("")
    setIsSending(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/friends")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={friendProfile?.avatar_url || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <p className="font-medium">{friendProfile?.display_name || "Unknown User"}</p>
            {friendProfile?.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
          </div>
          {friendProfile?.handle && <p className="text-sm text-muted-foreground">@{friendProfile.handle}</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserId
            return (
              <div key={message.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2",
                    isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={cn("mt-1 text-xs", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {format(new Date(message.created_at), "HH:mm")}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-border/40 pt-4">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
