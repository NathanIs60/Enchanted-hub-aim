import { createClient } from "@/lib/supabase/server"
import { TasksView } from "@/components/tasks/tasks-view"

export default async function TasksPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [tasksResult, aimsResult, gamesResult] = await Promise.all([
    supabase.from("tasks").select("*").eq("user_id", user?.id).order("sort_order", { ascending: true }),
    supabase.from("aims").select("id, title").eq("user_id", user?.id),
    supabase.from("games").select("id, title").eq("user_id", user?.id),
  ])

  return <TasksView tasks={tasksResult.data || []} aims={aimsResult.data || []} games={gamesResult.data || []} />
}
