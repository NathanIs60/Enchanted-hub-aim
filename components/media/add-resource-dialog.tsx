"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils/youtube"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Must be a valid URL"),
  resource_type: z.enum(["youtube", "article", "document", "other"]),
})

type ResourceFormData = z.infer<typeof resourceSchema>

export function AddResourceDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      resource_type: "youtube",
    },
  })

  const url = watch("url")

  // Auto-detect type from URL
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.includes("youtube.com") || value.includes("youtu.be")) {
      setValue("resource_type", "youtube")
    }
  }

  const onSubmit = async (data: ResourceFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      let thumbnailUrl = null
      if (data.resource_type === "youtube") {
        const videoId = extractYouTubeId(data.url)
        if (videoId) {
          thumbnailUrl = getYouTubeThumbnail(videoId)
        }
      }

      const { error } = await supabase.from("resources").insert({
        user_id: user.id,
        title: data.title,
        url: data.url,
        resource_type: data.resource_type,
        thumbnail_url: thumbnailUrl,
      })

      if (error) throw error

      toast.success("Resource added successfully")
      reset()
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Failed to add resource")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
          <DialogDescription>Save a video, article, or document to your media hub</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://youtube.com/watch?v=..."
              {...register("url")}
              onChange={(e) => {
                register("url").onChange(e)
                handleUrlChange(e)
              }}
            />
            {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Resource title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              defaultValue="youtube"
              onValueChange={(value) => setValue("resource_type", value as ResourceFormData["resource_type"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
