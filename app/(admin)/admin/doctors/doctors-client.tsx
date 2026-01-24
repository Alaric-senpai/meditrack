"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Stethoscope } from "lucide-react"
import { DoctorModal } from "@/components/admin/doctor-modal"
import { UsersTable, AdminUser } from "@/components/admin/users-table"

export function DoctorsPageClient({ initialData }: { initialData: AdminUser[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                <Stethoscope className="h-6 w-6" />
           </div>
           <div>
                <h2 className="text-2xl font-bold tracking-tight">Doctor Management</h2>
                <p className="text-muted-foreground">Manage clinical privileges and medical specialties.</p>
           </div>
        </div>
        <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <UsersTable data={initialData} />
      </div>

      <DoctorModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
