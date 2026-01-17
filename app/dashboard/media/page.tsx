import { createClient } from "@/lib/supabase/server"
import { MediaList } from "@/components/media/media-list"
import { AddResourceDialog } from "@/components/media/add-resource-dialog"

export default async function MediaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Media Hub</h2>
          <p className="text-muted-foreground">Save and annotate videos and resources</p>
        </div>
        <AddResourceDialog />
      </div>

      <MediaList resources={resources || []} />
    </div>
  )
}
