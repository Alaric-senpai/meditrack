"use client"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "./button"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { uploadFileAction } from "@/actions/storage.actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
  bucketId?: string
}

export function FileUpload({
  value,
  onChange,
  disabled,
  className,
  bucketId,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    if (bucketId) formData.append("bucketId", bucketId)

    setIsUploading(true)
    const tId = toast.loading("Uploading image...")

    try {
      const result = await uploadFileAction(formData)
      if (result.success && result.url) {
        onChange(result.url)
        toast.success("Image uploaded successfully", { id: tId })
      } else {
        toast.error(result.message || "Failed to upload image", { id: tId })
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: tId })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeImage = () => {
    onChange("")
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-4", className)}>
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-300">
          <AvatarImage src={value} className="object-cover" />
          <AvatarFallback className="bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        
        {value && !disabled && (
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          ref={fileInputRef}
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-fit"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {value ? "Change Image" : "Upload Image"}
        </Button>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          JPG, PNG or WEBP (Max 5MB)
        </p>
      </div>
    </div>
  )
}
