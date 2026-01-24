"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { createNurse, updateNurseMetadata } from "@/actions/admin-user.actions"
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"
import { ScrollArea } from "@/components/ui/scroll-area"
import { listDepartments } from "@/actions/departments.actions"

const nurseSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().default(""),
  licenseNumber: z.string().min(2, "License number is required"),
  employmentDate: z.string().min(1, "Employment date is required"),
  shiftType: z.enum(["Day", "Night", "Rotational"]),
  isAvailable: z.boolean().default(true),
  gender: z.enum(["male", "female"]),
  specialization: z.string().default(""), // comma separated
  profilePhoto: z.string().optional(),
  department: z.string().optional(),
})

type NurseFormValues = z.infer<typeof nurseSchema>

interface NurseModalProps {
  nurse?: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NurseModal({ nurse, open, onOpenChange }: NurseModalProps) {
  const isEdit = !!nurse

  const form = useForm<NurseFormValues>({
    resolver: zodResolver(nurseSchema) as any,
    defaultValues: {
      firstName: nurse?.firstName || "",
      lastName: nurse?.lastName || "",
      email: nurse?.email || "",
      phone: nurse?.phone || "",
      licenseNumber: nurse?.licenseNumber || "",
      employmentDate: nurse?.employmentDate || new Date().toISOString().split('T')[0],
      shiftType: nurse?.shiftType || "Day",
      isAvailable: nurse?.isAvailable ?? true,
      gender: nurse?.gender || "female",
      specialization: Array.isArray(nurse?.specialization) ? nurse.specialization.join(", ") : "",
      profilePhoto: nurse?.profilePhoto || "",
      department: nurse?.department || "",
    },
  })

  const [departments, setDepartments] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      listDepartments().then(res => {
        if (res.success) setDepartments(res.departments)
      })
    }
  }, [open])

  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: NurseFormValues) {
    const tId = toast.loading(isEdit ? "Updating nursing record..." : "Registering nurse...")
    try {
      const specs = data.specialization.split(",").map(s => s.trim()).filter(Boolean)
      
      const result = isEdit
        ? await updateNurseMetadata(nurse.userId, { ...data, specialization: specs })
        : await createNurse({ 
            ...data, 
            specialization: specs,
            phone: data.phone || undefined
          })

      if (result.success) {
        toast.success(isEdit ? "Record updated" : "Nurse invited successfully", { id: tId })
        onOpenChange(false)
        if (!isEdit) form.reset()
      } else {
        toast.error(result.message || "Failed to process request", { id: tId })
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: tId })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 border-none bg-transparent shadow-none overflow-hidden h-[95vh] max-h-[95vh]">
        <div className="bg-background rounded-lg border shadow-2xl flex flex-col h-full w-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b shrink-0 bg-background z-20">
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit Nurse Profile' : 'Register Nursing Staff'}</DialogTitle>
              <DialogDescription>
                Manage professional information for the nursing department.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable content */}
              <ScrollArea className="flex-1 min-h-0 px-6">
                <div className="py-6 space-y-6">
                  {/* Profile Photo */}
                  <FormField
                    control={form.control as any}
                    name="profilePhoto"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload 
                            value={field.value} 
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {!isEdit && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Email</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control as any}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nurse License Number</FormLabel>
                        <FormControl><Input placeholder="RN-12345" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employmentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Date</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shiftType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shift Assignment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Day">Day Shift</SelectItem>
                              <SelectItem value="Night">Night Shift</SelectItem>
                              <SelectItem value="Rotational">Rotational</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/5 flex-1">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">Active Availability</FormLabel>
                        <p className="text-xs text-muted-foreground">Is this nurse currently on active duty?</p>
                      </div>
                      <FormField
                        control={form.control}
                        name="isAvailable"
                        render={({ field }) => (
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.$id} value={dept.$id}>
                                  {dept.name} ({dept.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control as any}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nursing Specialties</FormLabel>
                        <FormControl><Input placeholder="ICU, Pediatrics, Emergency" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-6 border-t bg-muted/5 shrink-0 z-20">
                <DialogFooter className="sm:justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-8"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Update Profile' : 'Register Nurse'}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
