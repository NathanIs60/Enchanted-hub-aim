import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MediaDetailView } from "@/components/media/media-detail-view"

interface MediaPageProps {
  params: Promise<{ id: string }>
}

export default async function MediaPage({ params }: MediaPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: resource, error } = await supabase.from("resources").select("*").eq("id", id).single()

  if (error || !resource) {
    notFound()
  }

  return <MediaDetailView resource={resource} />
}
