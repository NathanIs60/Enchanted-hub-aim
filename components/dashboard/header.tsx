"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  user: {
    email?: string
    user_metadata?: {
      display_name?: string
      avatar_url?: string
    }
  } | null
}

export function Header({ user }: HeaderProps) {
  const { setTheme, theme } = useTheme()

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-semibold">Welcome back, {displayName}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
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
