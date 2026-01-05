import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4 md:p-8">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm text-center">
        <CardHeader className="space-y-1">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>Something went wrong during authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {params?.error && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">Error: {params.error}</p>
          )}
          <Button asChild className="w-full">
            <Link href="/auth/login">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
