"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, FlaskConical } from "lucide-react"
import { LabTechModal } from "@/components/admin/lab-tech-modal"
import { UsersTable, AdminUser } from "@/components/admin/users-table"

export function LabTechsPageClient({ initialData }: { initialData: AdminUser[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                <FlaskConical className="h-6 w-6" />
           </div>
           <div>
                <h2 className="text-2xl font-bold tracking-tight">Laboratory Staff</h2>
                <p className="text-muted-foreground">Manage diagnostic personnel and laboratory certifications.</p>
           </div>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Technician
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <UsersTable data={initialData} />
      </div>

      <LabTechModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
