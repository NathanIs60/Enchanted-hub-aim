import Link from "next/link"
import { Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4 md:p-8">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm text-center">
        <CardHeader className="space-y-1">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>{"We've sent you a confirmation link"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your email and click the confirmation link to activate your account. Once confirmed, you can
            sign in to Enchanted Hub.
          </p>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/auth/login">
              <Sparkles className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
