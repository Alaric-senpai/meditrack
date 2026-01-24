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
  FormDescription,
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
import { Loader2 } from "lucide-react"
import { createPharmacist, updatePharmacistMetadata } from "@/actions/admin-user.actions"
import { toast } from "sonner"
import { FileUpload } from "@/components/ui/file-upload"
import { ScrollArea } from "@/components/ui/scroll-area"
import { listDepartments } from "@/actions/departments.actions"
import { Checkbox } from "@/components/ui/checkbox"

const pharmacistSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  licenseNumber: z.string().min(2, "License number is required"),
  hire_date: z.string().min(1, "Hire date is required"),
  employmentDate: z.string().optional(),
  qualification: z.string().optional(),
  specilization: z.string().optional(), // CSV for UI
  shift_type: z.enum(["day", "night", "rotational", "on-call"]).optional(),
  can_disperse_controlled_drugs: z.boolean().default(false),
  can_manage_inventory: z.boolean().default(false),
  profilePhoto: z.string().optional(),
  department_id: z.string().optional(),
})

type PharmacistFormValues = z.infer<typeof pharmacistSchema>

interface PharmacistModalProps {
  pharmacist?: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PharmacistModal({ pharmacist, open, onOpenChange }: PharmacistModalProps) {
  const isEdit = !!pharmacist
  
  const form = useForm<PharmacistFormValues>({
    resolver: zodResolver(pharmacistSchema) as any,
    defaultValues: {
      firstName: pharmacist?.firstName || "",
      lastName: pharmacist?.lastName || "",
      email: pharmacist?.email || "",
      phone: pharmacist?.phone || "",
      licenseNumber: pharmacist?.licenseNumber || "",
      hire_date: pharmacist?.hire_date ? new Date(pharmacist.hire_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      employmentDate: pharmacist?.employmentDate ? new Date(pharmacist.employmentDate).toISOString().split('T')[0] : "",
      qualification: pharmacist?.qualification || "",
      specilization: Array.isArray(pharmacist?.specilization) ? pharmacist.specilization.join(", ") : "",
      shift_type: pharmacist?.shift_type || "day",
      can_disperse_controlled_drugs: pharmacist?.can_disperse_controlled_drugs || false,
      can_manage_inventory: pharmacist?.can_manage_inventory || false,
      profilePhoto: pharmacist?.profilePhoto || "",
      department_id: pharmacist?.department_id || "",
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
    if (pharmacist && open) {
        form.reset({
            firstName: pharmacist.firstName || "",
            lastName: pharmacist.lastName || "",
            email: pharmacist.email || "",
            phone: pharmacist.phone || "",
            licenseNumber: pharmacist.licenseNumber || "",
            hire_date: pharmacist.hire_date ? new Date(pharmacist.hire_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            employmentDate: pharmacist.employmentDate ? new Date(pharmacist.employmentDate).toISOString().split('T')[0] : "",
            qualification: pharmacist.qualification || "",
            specilization: Array.isArray(pharmacist.specilization) ? pharmacist.specilization.join(", ") : "",
            shift_type: pharmacist.shift_type || "day",
            can_disperse_controlled_drugs: pharmacist.can_disperse_controlled_drugs || false,
            can_manage_inventory: pharmacist.can_manage_inventory || false,
            profilePhoto: pharmacist.profilePhoto || "",
            department_id: pharmacist.department_id || "",
        })
    }
  }, [pharmacist, open, form])

  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: PharmacistFormValues) {
    const tId = toast.loading(isEdit ? "Updating pharmacist profile..." : "Inviting pharmacist...")
    try {
      const specs = data.specilization ? data.specilization.split(",").map(s => s.trim()).filter(Boolean) : []
      const payload = {
          ...data,
          specilization: specs,
          hire_date: new Date(data.hire_date).toISOString(),
          employmentDate: data.employmentDate ? new Date(data.employmentDate).toISOString() : undefined
      }

      const result = isEdit 
        ? await updatePharmacistMetadata(pharmacist.userId, payload)
        : await createPharmacist(payload)

      if (result.success) {
        toast.success(isEdit ? "Profile updated" : "Pharmacist invited successfully", { id: tId })
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
              <DialogTitle>{isEdit ? 'Edit Pharmacist Profile' : 'Invite New Pharmacist'}</DialogTitle>
              <DialogDescription>
                {isEdit 
                  ? `Update professional details for ${pharmacist.firstName} ${pharmacist.lastName}.` 
                  : "Register a pharmacy professional. They will receive an invitation to access the prescription management system."}
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
                            <FormControl><Input type="email" placeholder="john.doe@pharm.meditrack.com" {...field} /></FormControl>
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
                          <FormLabel>Pharmacy License Number</FormLabel>
                          <FormControl><Input placeholder="PH-112233" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pharmacy Unit</FormLabel>
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
                      name="hire_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hire Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>

                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Qualification</FormLabel>
                        <FormControl><Input placeholder="Pharm.D / B.Pharm" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specilization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specializations (Comma separated)</FormLabel>
                        <FormControl>
                            <Input placeholder="Clinical Pharmacy, Hospital Pharmacy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 bg-muted/30 p-4 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-2">Pharmacy Privileges</h4>
                    <FormField
                      control={form.control}
                      name="can_disperse_controlled_drugs"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Disperse Controlled Drugs</FormLabel>
                            <FormDescription>
                              Allowed to handle and disperse regulated substances.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="can_manage_inventory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Manage Pharmacy Inventory</FormLabel>
                            <FormDescription>
                              Access to update stock levels and manage procurement.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
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
                    className="px-8 shadow-lg shadow-emerald-500/20"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Save Changes' : 'Invite Pharmacist'}
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
