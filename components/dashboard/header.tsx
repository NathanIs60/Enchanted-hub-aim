"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Menu, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "./mobile-nav"
import { useEffect, useState } from "react"
import type { Notification } from "@/lib/types/database"

interface HeaderProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      display_name?: string
      avatar_url?: string
    }
  } | null
  notifications?: Notification[]
}

export function Header({ user, notifications = [] }: HeaderProps) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User"
  const initials = displayName.slice(0, 2).toUpperCase()

  const currentTheme = mounted ? resolvedTheme : "light"

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div>
          <h1 className="text-lg font-semibold">Welcome back, {displayName}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsDropdown initialNotifications={notifications} userId={user?.id || ""} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              {!mounted ? (
                <div className="h-5 w-5" />
              ) : currentTheme === "dark" ? (
                <Moon className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Sun className="h-5 w-5 transition-transform duration-200" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
              <Sun className="h-4 w-4" />
              Light
              {mounted && theme === "light" && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
              <Moon className="h-4 w-4" />
              Dark
              {mounted && theme === "dark" && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
              <Monitor className="h-4 w-4" />
              System
              {mounted && theme === "system" && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt={displayName} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
