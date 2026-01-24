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
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { createLabTechnician, updateLabTechnicianMetadata } from "@/actions/admin-user.actions"
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"
import { ScrollArea } from "@/components/ui/scroll-area"
import { listDepartments } from "@/actions/departments.actions"

const labTechSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  licenseId: z.string().min(2, "Certification/License is required"),
  yearsOfExperience: z.coerce.number().min(0).max(70),
  expertise: z.string().max(256).optional(),
  specialization: z.string().optional(), // CSV for UI
  shift_type: z.enum(["day", "night", "rotational", "on-call"]),
  employment_date: z.string().min(1, "Employment date is required"),
  profilePhoto: z.string().optional(),
  department: z.string().optional(),
})

type LabTechFormValues = z.infer<typeof labTechSchema>

interface LabTechModalProps {
  labTech?: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LabTechModal({ labTech, open, onOpenChange }: LabTechModalProps) {
  const isEdit = !!labTech
  
  const form = useForm<LabTechFormValues>({
    resolver: zodResolver(labTechSchema) as any,
    defaultValues: {
      firstName: labTech?.firstName || "",
      lastName: labTech?.lastName || "",
      email: labTech?.email || "",
      phone: labTech?.phone || "",
      licenseId: labTech?.licenseId || "",
      yearsOfExperience: labTech?.yearsOfExperience || 0,
      expertise: labTech?.expertise || "",
      specialization: Array.isArray(labTech?.specialization) ? labTech.specialization.join(", ") : "",
      shift_type: labTech?.shift_type || "day",
      employment_date: labTech?.employment_date ? new Date(labTech.employment_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      profilePhoto: labTech?.profilePhoto || "",
      department: labTech?.department || "",
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

  useEffect(() => {
    if (labTech && open) {
        form.reset({
            firstName: labTech.firstName || "",
            lastName: labTech.lastName || "",
            email: labTech.email || "",
            phone: labTech.phone || "",
            licenseId: labTech.licenseId || "",
            yearsOfExperience: labTech.yearsOfExperience || 0,
            expertise: labTech.expertise || "",
            specialization: Array.isArray(labTech.specialization) ? labTech.specialization.join(", ") : "",
            shift_type: labTech.shift_type || "day",
            employment_date: labTech.employment_date ? new Date(labTech.employment_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            profilePhoto: labTech.profilePhoto || "",
            department: labTech.department || "",
        })
    }
  }, [labTech, open, form])

  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: LabTechFormValues) {
    const tId = toast.loading(isEdit ? "Updating technician profile..." : "Inviting technician...")
    try {
      const specs = data.specialization ? data.specialization.split(",").map(s => s.trim()).filter(Boolean) : []
      const payload = {
          ...data,
          specialization: specs,
          employment_date: new Date(data.employment_date).toISOString()
      }

      const result = isEdit 
        ? await updateLabTechnicianMetadata(labTech.userId, payload)
        : await createLabTechnician(payload)

      if (result.success) {
        toast.success(isEdit ? "Profile updated" : "Technician invited successfully", { id: tId })
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
      <DialogContent className="sm:max-w-2xl p-0 border-none bg-transparent shadow-none overflow-hidden h-[90vh] max-h-[90vh]">
        <div className="bg-background rounded-lg border shadow-2xl flex flex-col h-full w-full overflow-hidden">
          <div className="p-6 border-b shrink-0 bg-background z-20">
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit Technician Profile' : 'Invite New Lab Technician'}</DialogTitle>
              <DialogDescription>
                {isEdit 
                  ? `Update professional details for ${labTech.firstName} ${labTech.lastName}.` 
                  : "Register a laboratory professional. They will receive an invitation to access the diagnostic portal."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="flex-1 min-h-0 px-6">
                <div className="py-6 space-y-6">
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
                          <FormControl><Input placeholder="Jane" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="Smith" {...field} /></FormControl>
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
                            <FormControl><Input type="email" placeholder="jane.smith@lab.meditrack.com" {...field} /></FormControl>
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
                      name="licenseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certification/License Number</FormLabel>
                          <FormControl><Input placeholder="LAB-445566" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Laboratory Unit (Department)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select Unit" /></SelectTrigger>
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shift_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shift Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select Shift" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="day">Day Shift</SelectItem>
                              <SelectItem value="night">Night Shift</SelectItem>
                              <SelectItem value="rotational">Rotational</SelectItem>
                              <SelectItem value="on-call">On Call</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employment_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                      name="expertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expertise</FormLabel>
                          <FormControl><Input placeholder="Hematology, Microbiology" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specializations (Comma separated)</FormLabel>
                        <FormControl>
                            <Input placeholder="Molecular Biology, Clinical Chemistry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>

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
                    className="px-8 shadow-lg shadow-amber-500/20"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Save Changes' : 'Invite Technician'}
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
