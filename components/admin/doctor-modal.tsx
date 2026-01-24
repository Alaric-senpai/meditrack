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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { createDoctor, updateDoctorMetadata } from "@/actions/admin-user.actions"
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"
import { ScrollArea } from "@/components/ui/scroll-area"
import { listDepartments } from "@/actions/departments.actions"
import { useEffect } from "react"

const doctorSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  licenseNumber: z.string().min(2, "License number is required"),
  yearsOfExperience: z.coerce.number().min(0).max(80),
  education: z.string().optional(),
  hospitalAffiliation: z.string().optional(),
  medicalRegistrationNumber: z.string().min(2, "Medical registration is required"),
  specialization: z.string().min(2, "At least one specialization is required"), // comma separated for now
  bio: z.string().max(500).optional(),
  gender: z.enum(["male", "female"]),
  profilePhoto: z.string().optional(),
  department: z.string().optional(),
})

type DoctorFormValues = z.infer<typeof doctorSchema>

interface DoctorModalProps {
  doctor?: any // If provided, we are in edit mode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoctorModal({ doctor, open, onOpenChange }: DoctorModalProps) {
  const isEdit = !!doctor
  
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema) as any,
    defaultValues: {
      firstName: doctor?.firstName || "",
      lastName: doctor?.lastName || "",
      email: doctor?.email || "",
      phone: doctor?.phone || "",
      licenseNumber: doctor?.licenseNumber || "",
      yearsOfExperience: doctor?.yearsOfExperience || 0,
      education: doctor?.education || "",
      hospitalAffiliation: doctor?.hospitalAffiliation || "",
      medicalRegistrationNumber: doctor?.medicalRegistrationNumber || "",
      specialization: Array.isArray(doctor?.specialization) ? doctor.specialization.join(", ") : "",
      bio: doctor?.bio || "",
      gender: doctor?.gender || "male",
      profilePhoto: doctor?.profilePhoto || "",
      department: doctor?.department || "",
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

  async function onSubmit(data: DoctorFormValues) {
    const tId = toast.loading(isEdit ? "Updating doctor profile..." : "Inviting doctor...")
    try {
      // Split specialization string into array
      const specs = data.specialization.split(",").map(s => s.trim()).filter(Boolean)
      
      const result = isEdit 
        ? await updateDoctorMetadata(doctor.userId, { ...data, specialization: specs })
        : await createDoctor({ ...data, specialization: specs })

      if (result.success) {
        toast.success(isEdit ? "Doctor profile updated" : "Doctor invited successfully", { id: tId })
        onOpenChange(false)
        if (!isEdit) form.reset()
      } else {
        toast.error(result.message || "Action failed", { id: tId })
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: tId })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 border-none bg-transparent shadow-none overflow-hidden h-[95vh] max-h-[95vh]">
        <div className="bg-background rounded-lg border shadow-2xl flex flex-col h-full w-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b shrink-0 bg-background z-20">
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit Doctor Profile' : 'Invite New Doctor'}</DialogTitle>
              <DialogDescription>
                {isEdit 
                  ? `Update professional details for Dr. ${doctor.firstName} ${doctor.lastName}.` 
                  : "Register a clinical professional. They will receive an invitation to set up their portal access."}
              </DialogDescription>
            </DialogHeader>
          </div>

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
                          <FormControl><Input placeholder="John" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {!isEdit && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl><Input type="email" placeholder="dr.doe@meditrack.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical License Number</FormLabel>
                          <FormControl><Input placeholder="ML-987654" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="medicalRegistrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clinical Registration ID</FormLabel>
                          <FormControl><Input placeholder="REG-112233" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience (Years)</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
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
                              {departments.length === 0 && <p className="p-2 text-xs text-muted-foreground">No departments</p>}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hospitalAffiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hospital</FormLabel>
                          <FormControl><Input placeholder="Central General" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education & Credentials</FormLabel>
                        <FormControl><Input placeholder="MD, Harvard Medical School" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specializations (Comma separated)</FormLabel>
                        <FormControl><Input placeholder="Cardiology, Internal Medicine" {...field} /></FormControl>
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
                            placeholder="Brief summary of clinical background..." 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
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
                    {isEdit ? 'Save Profile' : 'Send Invitation'}
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
