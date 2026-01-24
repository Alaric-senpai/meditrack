"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { updateStaffMetadata } from "@/actions/admin-user.actions"
import { toast } from "sonner"

const staffSchema = z.object({
  specialty: z.string().min(2, "Specialty is required for clinical staff"),
  bio: z.string().optional(),
})

type StaffFormValues = z.infer<typeof staffSchema>

interface StaffMetadataModalProps {
  user: {
    userId: string
    name: string
    specialty?: string
    bio?: string
    role: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffMetadataModal({ user, open, onOpenChange }: StaffMetadataModalProps) {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      specialty: user.specialty || "",
      bio: user.bio || "",
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: StaffFormValues) {
    const tId = toast.loading(`Updating ${user.role} profile...`)
    try {
      const result = await updateStaffMetadata(user.userId, data)

      if (result.success) {
        toast.success(`Profile updated successfully.`, { id: tId })
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to update profile", { id: tId })
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: tId })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {user.role === 'doctor' ? 'Doctor' : 'Nurse'} Details</DialogTitle>
          <DialogDescription>
            Update professional metadata for {user.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cardiology, Pediatrics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                       placeholder="Brief description of experience and qualifications..." 
                       className="resize-none"
                       {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
