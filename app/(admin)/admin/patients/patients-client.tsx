"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, UserPlus } from "lucide-react"
import { PatientModal } from "@/components/admin/patient-modal"
import { PatientsTable, Patient } from "@/components/admin/patients-table"

export function PatientsPageClient({ initialData }: { initialData: Patient[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <UserPlus className="h-6 w-6" />
           </div>
           <div>
                <h2 className="text-2xl font-bold tracking-tight">Patient Administration</h2>
                <p className="text-muted-foreground">Comprehensive patient record management and registration.</p>
           </div>
        </div>
        <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Register Patient
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <PatientsTable data={initialData} />
      </div>

      <PatientModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
