"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, HeartPulse } from "lucide-react"
import { NurseModal } from "@/components/admin/nurse-modal"
import { UsersTable, AdminUser } from "@/components/admin/users-table"

export function NursesPageClient({ initialData }: { initialData: AdminUser[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <HeartPulse className="h-6 w-6" />
           </div>
           <div>
                <h2 className="text-2xl font-bold tracking-tight">Nursing Staff</h2>
                <p className="text-muted-foreground">Manage nursing assignments and departmental roles.</p>
           </div>
        </div>
        <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Nurse
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <UsersTable data={initialData} />
      </div>

      <NurseModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
