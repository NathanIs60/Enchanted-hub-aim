"use client"

import type { Aim } from "@/lib/types/database"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { format, parseISO } from "date-fns"

interface AimCardProps {
  aim: Aim
}

const statusColors: Record<Aim["status"], string> = {
  active: "bg-green-500/10 text-green-600 dark:text-green-400",
  completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  paused: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  archived: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

const priorityColors: Record<Aim["priority"], string> = {
  low: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function AimCard({ aim }: AimCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("aims").delete().eq("id", aim.id)

    if (error) {
      toast.error("Failed to delete aim")
    } else {
      toast.success("Aim deleted")
      router.refresh()
    }
  }

  return (
    <Card className="group border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: aim.color }} />
            <Badge className={statusColors[aim.status]}>{aim.status}</Badge>
          </div>
          <Badge variant="outline" className={priorityColors[aim.priority]}>
            {aim.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <h3 className="font-semibold line-clamp-1">{aim.title}</h3>
        {aim.description && <p className="text-sm text-muted-foreground line-clamp-2">{aim.description}</p>}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{aim.progress}%</span>
          </div>
          <Progress value={aim.progress} className="h-1.5" />
        </div>

        {aim.due_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Due {format(parseISO(aim.due_date), "MMM d, yyyy")}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
