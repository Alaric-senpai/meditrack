"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Building2, Loader2 } from "lucide-react"
import { listDepartments, assignDoctorToDepartment, assignNurseToDepartment, assignLabTechToDepartment } from "@/actions/departments.actions"
import { toast } from "sonner"

interface AssignDepartmentDialogProps {
  user: {
    userId: string
    firstName: string
    lastName: string
    role: "doctor" | "nurse" | "lab_tech" | "pharmacist" | "admin" | "patient"
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignDepartmentDialog({ user, open, onOpenChange }: AssignDepartmentDialogProps) {
  const [departments, setDepartments] = React.useState<any[]>([])
  const [selectedDept, setSelectedDept] = React.useState<string>("")
  const [loading, setLoading] = React.useState(false)
  const [fetching, setFetching] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setFetching(true)
      listDepartments().then(res => {
        if (res.success) {
          setDepartments(res.departments)
        }
        setFetching(false)
      })
    }
  }, [open])

  async function handleAssign() {
    if (!user || !selectedDept) return

    setLoading(true)
    try {
      let result;
      if (user.role === 'doctor') {
          result = await assignDoctorToDepartment(user.userId, selectedDept);
      } else if (user.role === 'nurse') {
          result = await assignNurseToDepartment(user.userId, selectedDept);
      } else if (user.role === 'lab_tech') {
          result = await assignLabTechToDepartment(user.userId, selectedDept);
      } else {
          toast.error("Assignment not supported for this role");
          setLoading(false);
          return;
      }

      if (result.success) {
        toast.success(`Assigned ${user.firstName} to ${departments.find(d => d.$id === selectedDept)?.name}`)
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to assign department")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-600" />
            Assign Department
          </DialogTitle>
          <DialogDescription>
            Select a service unit for {user?.firstName} {user?.lastName}. This will associate their clinical records with the department.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <Select onValueChange={setSelectedDept} value={selectedDept}>
            <SelectTrigger>
              <SelectValue placeholder={fetching ? "Loading departments..." : "Choose a department"} />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.$id} value={dept.$id}>
                  {dept.name} ({dept.code})
                </SelectItem>
              ))}
              {departments.length === 0 && !fetching && (
                <p className="p-2 text-xs text-center text-muted-foreground">No active departments found.</p>
              )}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleAssign} 
            disabled={loading || !selectedDept || fetching}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
