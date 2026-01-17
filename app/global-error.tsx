"use client"

import { Sparkles, RefreshCw, AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-zinc-950 text-zinc-50">
        <div className="flex min-h-svh flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-violet-500" />
              <span className="text-xl font-bold">NathanIs Enchanted Hub</span>
            </div>

            {/* Error Icon */}
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>

            {/* Message */}
            <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Critical Error</h2>
            <p className="mb-2 max-w-md text-zinc-400">
              NathanIs Hub encountered a critical error. Please try refreshing the page.
            </p>
            {error.digest && <p className="mb-8 font-mono text-xs text-zinc-500">Error ID: {error.digest}</p>}

            {/* Actions */}
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            {/* Footer */}
            <p className="mt-12 text-xs text-zinc-500">NathanIs System Notification</p>
          </div>
        </div>
      </body>
    </html>
  )
}
