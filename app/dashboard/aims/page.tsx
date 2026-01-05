import { createClient } from "@/lib/supabase/server"
import { AimsList } from "@/components/aims/aims-list"
import { AddAimDialog } from "@/components/aims/add-aim-dialog"

export default async function AimsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: aims } = await supabase
    .from("aims")
    .select("*")
    .eq("user_id", user?.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Aims</h2>
          <p className="text-muted-foreground">Track your goals and objectives</p>
        </div>
        <AddAimDialog />
      </div>

      <AimsList aims={aims || []} />
    </div>
  )
}
