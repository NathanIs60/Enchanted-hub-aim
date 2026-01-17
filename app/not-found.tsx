import Link from "next/link"
import { Sparkles, Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">NathanIs Enchanted Hub</span>
        </div>

        {/* 404 Display */}
        <div className="relative mb-6">
          <h1 className="text-[10rem] font-bold leading-none text-primary/10 sm:text-[14rem]">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-20 w-20 text-primary/50 sm:h-28 sm:w-28" />
          </div>
        </div>

        {/* Message */}
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Page Not Found</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground">NathanIs System - Error 404</p>
      </div>
    </div>
  )
}
