import { createClient } from "@/lib/supabase/server"
import { MediaList } from "@/components/media/media-list"
import { AddResourceDialog } from "@/components/media/add-resource-dialog"

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>
}) {
  const { folder: folderId } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  // Try to get folders, but handle gracefully if table doesn't exist
  let folders: any[] = []
  try {
    const { data: foldersData, error: foldersError } = await supabase
      .from("media_folders")
      .select("*")
      .eq("user_id", user?.id)
      .order("sort_order", { ascending: true })
    
    if (!foldersError) {
      folders = foldersData || []
    } else {
      console.warn("Folders table not available:", foldersError.message)
    }
  } catch (error) {
    console.warn("Folders feature not available:", error)
  }

  // Get current folder if specified
  const currentFolder = folderId && folders.length > 0
    ? folders.find(f => f.id === folderId) || null
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {currentFolder ? currentFolder.name : "Media Hub"}
          </h2>
          <p className="text-muted-foreground">
            {currentFolder 
              ? currentFolder.description || "Folder contents"
              : "Save and organize videos and resources"
            }
          </p>
        </div>
        <AddResourceDialog folders={folders} />
      </div>

      <MediaList 
        resources={resources || []} 
        folders={folders}
        currentFolder={currentFolder}
      />
    </div>
  )
}
