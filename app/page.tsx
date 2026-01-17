import type React from "react"
import Link from "next/link"
import { Sparkles, Target, Gamepad2, BookOpen, Youtube, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-background via-background to-accent/10">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Enchanted Hub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Your Personal Hub for
              <span className="block text-primary">Life & Aim Tracking</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Track your goals, manage your gaming progress, journal your daily thoughts, and organize your learning
              resources - all in one enchanted place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold">Everything You Need</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={Target}
                title="Aim Tracker"
                description="Set and track your personal and professional goals with progress visualization"
              />
              <FeatureCard
                icon={Gamepad2}
                title="Gaming Tracker"
                description="Manage your game library, track progress, and set gaming objectives"
              />
              <FeatureCard
                icon={BookOpen}
                title="Daily Journal"
                description="Document your daily thoughts with a rich text editor and calendar view"
              />
              <FeatureCard
                icon={Youtube}
                title="Media Hub"
                description="Save and annotate YouTube videos with split-screen note-taking"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <p className="text-sm text-muted-foreground">© 2026 NathanIs. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Enchanted Hub - Track. Achieve. Grow.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:bg-card">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
