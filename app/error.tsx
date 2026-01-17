"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Sparkles, Home, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("NathanIs Hub Error:", error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-destructive/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-destructive/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">NathanIs Enchanted Hub</span>
        </div>

        {/* Error Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>

        {/* Message */}
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Something Went Wrong</h2>
        <p className="mb-2 max-w-md text-muted-foreground">
          NathanIs Hub encountered an unexpected error. We apologize for the inconvenience.
        </p>
        {error.digest && <p className="mb-8 font-mono text-xs text-muted-foreground">Error ID: {error.digest}</p>}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground">
          NathanIs System Notification - If this persists, please contact support
        </p>
      </div>
    </div>
  )
}
