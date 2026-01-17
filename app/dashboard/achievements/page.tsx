import { createClient } from "@/lib/supabase/server"
import { AchievementsGrid } from "@/components/gamification/achievements-grid"
import { XpProgressBar } from "@/components/gamification/xp-progress-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Achievements | NathanIs Enchanted Hub",
  description: "View your unlocked achievements and badges",
}

export default async function AchievementsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [achievementsResult, userAchievementsResult, statsResult] = await Promise.all([
    supabase.from("achievements").select("*").order("category"),
    supabase.from("user_achievements").select("*, achievement:achievements(*)").eq("user_id", user?.id),
    supabase.from("user_stats").select("*").eq("user_id", user?.id).single(),
  ])

  const achievements = achievementsResult.data || []
  const userAchievements = userAchievementsResult.data || []
  const stats = statsResult.data || { xp: 0, level: 1 }

  // Group achievements by category
  const categories = [...new Set(achievements.map((a) => a.category))]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Achievements</h2>
        <p className="text-muted-foreground">Track your progress and unlock badges</p>
      </div>

      <XpProgressBar xp={stats.xp} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{userAchievements.length}</p>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{achievements.length}</p>
              <p className="text-sm text-muted-foreground">Total Badges</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {Math.round((userAchievements.length / achievements.length) * 100) || 0}%
              </p>
              <p className="text-sm text-muted-foreground">Completion</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {userAchievements.reduce((acc, ua) => acc + (ua.achievement?.xp_reward || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">XP from Badges</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {categories.map((category) => {
        const categoryAchievements = achievements.filter((a) => a.category === category)
        return (
          <Card key={category} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
              <CardDescription>
                {userAchievements.filter((ua) => ua.achievement?.category === category).length} /{" "}
                {categoryAchievements.length} unlocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AchievementsGrid achievements={categoryAchievements} userAchievements={userAchievements} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
