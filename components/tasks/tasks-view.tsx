"use client"

import { useState } from "react"
import type { Task, Aim, Game } from "@/lib/types/database"
import { TaskList } from "./task-list"
import { AddTaskDialog } from "./add-task-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface TasksViewProps {
  tasks: Task[]
  aims: Pick<Aim, "id" | "title">[]
  games: Pick<Game, "id" | "title">[]
}

export function TasksView({ tasks, aims, games }: TasksViewProps) {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeTab === "all" || task.category === activeTab
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesCategory && matchesPriority
  })

  const categoryCounts = {
    all: tasks.length,
    general: tasks.filter((t) => t.category === "general").length,
    aim: tasks.filter((t) => t.category === "aim").length,
    game: tasks.filter((t) => t.category === "game").length,
    daily: tasks.filter((t) => t.category === "daily").length,
  }

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending" || t.status === "in_progress")
  const completedTasks = filteredTasks.filter((t) => t.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Task Manager</h2>
          <p className="text-muted-foreground">Manage all your tasks in one place</p>
        </div>
        <AddTaskDialog aims={aims} games={games} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[150px] bg-background/50">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({categoryCounts.all})</TabsTrigger>
          <TabsTrigger value="general">General ({categoryCounts.general})</TabsTrigger>
          <TabsTrigger value="aim">Aims ({categoryCounts.aim})</TabsTrigger>
          <TabsTrigger value="game">Games ({categoryCounts.game})</TabsTrigger>
          <TabsTrigger value="daily">Daily ({categoryCounts.daily})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4 space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">To Do ({pendingTasks.length})</h3>
            <TaskList tasks={pendingTasks} aims={aims} games={games} />
          </div>

          {completedTasks.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Completed ({completedTasks.length})</h3>
              <TaskList tasks={completedTasks} aims={aims} games={games} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
