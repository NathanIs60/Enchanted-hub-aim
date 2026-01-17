import { createClient } from "@/lib/supabase/server"
import { AimsClient } from "./aims-client"

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

  return <AimsClient aims={aims || []} />
}
