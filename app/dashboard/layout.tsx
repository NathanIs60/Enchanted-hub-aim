import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch notifications for the header
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="flex min-h-svh w-full max-w-[100vw] overflow-x-hidden bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={data.user} notifications={notifications || []} />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
