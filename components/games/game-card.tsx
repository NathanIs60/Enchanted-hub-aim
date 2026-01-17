"use client"

import type { Game } from "@/lib/types/database"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Clock, Star, Trash2, Edit, ListTodo } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface GameCardProps {
  game: Game
}

const statusColors: Record<Game["status"], string> = {
  playing: "bg-green-500/10 text-green-600 dark:text-green-400",
  completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  paused: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  backlog: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  dropped: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function GameCard({ game }: GameCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("games").delete().eq("id", game.id)

    if (error) {
      toast.error("Failed to delete game")
    } else {
      toast.success("Game deleted")
      router.refresh()
    }
  }

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {game.cover_image ? (
            <Image
              src={game.cover_image || "/placeholder.svg"}
              alt={game.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/20">
                {game.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <Badge className={`absolute right-2 top-2 ${statusColors[game.status]}`}>
            {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="line-clamp-1 font-semibold">{game.title}</h3>
        {game.platform && <p className="text-sm text-muted-foreground">{game.platform}</p>}

        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{game.hours_played}h</span>
          </div>
          {game.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span>{game.rating}/10</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href={`/dashboard/games/${game.id}`}>
              <ListTodo className="mr-1.5 h-3.5 w-3.5" />
              Tasks
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/games/${game.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}
