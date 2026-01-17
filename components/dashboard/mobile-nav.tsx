"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sparkles,
  LayoutDashboard,
  Target,
  Gamepad2,
  BookOpen,
  Youtube,
  CheckSquare,
  Settings,
  LogOut,
  Users,
  BookMarked,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { SheetClose } from "@/components/ui/sheet"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/aims", icon: Target, label: "Aims" },
  { href: "/dashboard/games", icon: Gamepad2, label: "Games" },
  { href: "/dashboard/journal", icon: BookOpen, label: "Journal" },
  { href: "/dashboard/media", icon: Youtube, label: "Media Hub" },
  { href: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/dashboard/friends", icon: Users, label: "Friends" },
  { href: "/dashboard/blueprints", icon: BookMarked, label: "Blueprints" },
  { href: "/dashboard/achievements", icon: Trophy, label: "Achievements" },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-border/40 px-4">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="font-bold">Enchanted Hub</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <SheetClose key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            </SheetClose>
          )
        })}
      </nav>

      <div className="border-t border-border/40 p-2">
        <SheetClose asChild>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/dashboard/settings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </SheetClose>
        <button
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
