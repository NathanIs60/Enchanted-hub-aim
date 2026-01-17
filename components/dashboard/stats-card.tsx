import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  trend?: {
    value: number
    positive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, description, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
          {trend && (
            <span className={cn("text-sm font-medium", trend.positive ? "text-green-500" : "text-red-500")}>
              {trend.positive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
