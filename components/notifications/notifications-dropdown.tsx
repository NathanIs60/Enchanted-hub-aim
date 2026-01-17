"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Trophy, UserPlus, MessageCircle, AlertCircle, Clock, TrendingUp, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import type { Notification } from "@/lib/types/database"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

const notificationIcons = {
  achievement: Trophy,
  friend_request: UserPlus,
  message: MessageCircle,
  system: AlertCircle,
  reminder: Clock,
  level_up: TrendingUp,
}

interface NotificationsDropdownProps {
  initialNotifications: Notification[]
  userId: string
}

export function NotificationsDropdown({ initialNotifications, userId }: NotificationsDropdownProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  // Subscribe to new notifications
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications((prev) => [newNotification, ...prev])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const handleMarkAsRead = async (notificationId: string) => {
    const supabase = createClient()
    await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
  }

  const handleMarkAllAsRead = async () => {
    const supabase = createClient()
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false)

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const handleNotificationClick = async (notification: Notification) => {
    await handleMarkAsRead(notification.id)
    setOpen(false)

    // Navigate based on notification type
    switch (notification.type) {
      case "friend_request":
        router.push("/dashboard/friends")
        break
      case "message":
        const fromUserId = notification.data?.from_user_id
        if (fromUserId) router.push(`/dashboard/chat/${fromUserId}`)
        break
      case "achievement":
        router.push("/dashboard/achievements")
        break
      case "level_up":
        router.push("/dashboard/achievements")
        break
      default:
        break
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 20).map((notification) => {
              const Icon = notificationIcons[notification.type] || AlertCircle
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn("flex cursor-pointer items-start gap-3 p-3", !notification.is_read && "bg-primary/5")}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      notification.type === "achievement" && "bg-amber-500/10 text-amber-500",
                      notification.type === "level_up" && "bg-primary/10 text-primary",
                      notification.type === "friend_request" && "bg-blue-500/10 text-blue-500",
                      notification.type === "message" && "bg-green-500/10 text-green-500",
                      notification.type === "reminder" && "bg-orange-500/10 text-orange-500",
                      notification.type === "system" && "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.is_read && <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </DropdownMenuItem>
              )
            })
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
