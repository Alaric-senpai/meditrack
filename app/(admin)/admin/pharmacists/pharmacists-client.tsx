"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pill } from "lucide-react"
import { PharmacistModal } from "@/components/admin/pharmacist-modal"
import { UsersTable, AdminUser } from "@/components/admin/users-table"

export function PharmacistsPageClient({ initialData }: { initialData: AdminUser[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                <Pill className="h-6 w-6" />
           </div>
           <div>
                <h2 className="text-2xl font-bold tracking-tight">Pharmacy Staff</h2>
                <p className="text-muted-foreground">Manage pharmacists, drug dispersal privileges, and inventory access.</p>
           </div>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Pharmacist
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <UsersTable data={initialData} />
      </div>

      <PharmacistModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
