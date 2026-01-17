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
  ChevronLeft,
  ChevronRight,
  Users,
  BookMarked,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/lib/contexts/language-context"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { href: "/dashboard/aims", icon: Target, label: t("nav.aims") },
    { href: "/dashboard/games", icon: Gamepad2, label: t("nav.games") },
    { href: "/dashboard/journal", icon: BookOpen, label: t("nav.journal") },
    { href: "/dashboard/media", icon: Youtube, label: t("nav.media") },
    { href: "/dashboard/tasks", icon: CheckSquare, label: t("nav.tasks") },
    { href: "/dashboard/friends", icon: Users, label: t("nav.friends") },
    { href: "/dashboard/blueprints", icon: BookMarked, label: t("nav.blueprints") },
    { href: "/dashboard/achievements", icon: Trophy, label: t("nav.achievements") },
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex h-svh flex-col border-r border-border/40 bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/40 px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold">Enchanted Hub</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <Sparkles className="h-6 w-6 text-primary" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(collapsed && "mx-auto")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const NavLink = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return NavLink
          })}
        </nav>

        <div className="border-t border-border/40 p-2">
          {collapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/settings"
                    className={cn(
                      "flex items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                      pathname === "/dashboard/settings"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{t("nav.settings")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSignOut}
                    className="mt-1 flex w-full items-center justify-center rounded-lg px-2 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{t("nav.signOut")}</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
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
                <span>{t("nav.settings")}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span>{t("nav.signOut")}</span>
              </button>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
