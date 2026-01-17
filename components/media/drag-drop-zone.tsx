"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { FolderMinus, Upload } from "lucide-react"

interface DragDropZoneProps {
  onDrop: (resourceId: string, targetFolderId: string | null) => void
  targetFolderId: string | null
  className?: string
  children: React.ReactNode
  isDropTarget?: boolean
}

export function DragDropZone({ 
  onDrop, 
  targetFolderId, 
  className, 
  children, 
  isDropTarget = false 
}: DragDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const resourceId = e.dataTransfer.getData("text/plain")
    if (resourceId) {
      onDrop(resourceId, targetFolderId)
    }
  }

  return (
    <div
      className={cn(
        "transition-all duration-200",
        isDragOver && isDropTarget && "ring-2 ring-primary ring-offset-2 bg-primary/5",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}

interface RemoveFromFolderZoneProps {
  onDrop: (resourceId: string) => void
  isVisible: boolean
}

export function RemoveFromFolderZone({ onDrop, isVisible }: RemoveFromFolderZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const resourceId = e.dataTransfer.getData("text/plain")
    if (resourceId) {
      onDrop(resourceId)
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
        "flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed",
        "bg-background/90 backdrop-blur-sm shadow-lg transition-all duration-200",
        isDragOver 
          ? "border-red-500 bg-red-50/90 text-red-700 dark:bg-red-950/90 dark:text-red-300" 
          : "border-muted-foreground/30 text-muted-foreground hover:border-red-400"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <FolderMinus className="h-5 w-5" />
      <span className="font-medium">
        {isDragOver ? "Release to remove from folder" : "Drop here to remove from folder"}
      </span>
    </div>
  )
}