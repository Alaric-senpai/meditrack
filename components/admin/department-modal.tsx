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
import { createDepartment, updateDepartment } from "@/actions/departments.actions"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  code: z.string().min(2, "Department code is required (e.g. CARD)"),
  type: z.string().min(2, "Department type is required"),
  description: z.string().min(2, "Description is required"),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

interface DepartmentModalProps {
  department?: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentModal({ department, open, onOpenChange }: DepartmentModalProps) {
  const isEdit = !!department

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema) as any,
    defaultValues: {
      name: department?.name || "",
      code: department?.code || "",
      type: department?.type || "Clinical",
      description: department?.description || "",
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: DepartmentFormValues) {
    const tId = toast.loading(isEdit ? "Updating department..." : "Creating department...")
    try {
      const result = isEdit
        ? await updateDepartment(department.$id, data)
        : await createDepartment(data)

      if (result.success) {
        toast.success(isEdit ? "Department updated" : "Department created successfully", { id: tId })
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
      <DialogContent className="sm:max-w-lg p-0 border-none bg-transparent shadow-none overflow-hidden h-auto max-h-[95vh]">
        <div className="bg-background rounded-lg border shadow-2xl flex flex-col max-h-[90vh] w-full overflow-hidden">
          <div className="p-6 border-b shrink-0 bg-background z-20">
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit Department' : 'Create New Department'}</DialogTitle>
              <DialogDescription>
                Define the metadata and organizational scope for this department.
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="flex-1 min-h-0 px-6">
                <div className="py-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl><Input placeholder="Cardiology Units" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department Code</FormLabel>
                          <FormControl><Input placeholder="CARD" {...field} className="uppercase font-mono"/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Clinical">Clinical</SelectItem>
                              <SelectItem value="Administrative">Administrative</SelectItem>
                              <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                              <SelectItem value="Emergency">Emergency</SelectItem>
                              <SelectItem value="Laboratory">Laboratory</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe the department's focus and responsibilities..." className="resize-none h-32" {...field} /></FormControl>
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
                    className="px-8"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? 'Save Changes' : 'Create Department'}
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
