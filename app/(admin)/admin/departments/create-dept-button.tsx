"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DepartmentModal } from "@/components/admin/department-modal"

export function CreateDepartmentButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Department
      </Button>
      <DepartmentModal open={open} onOpenChange={setOpen} />
    </>
  )
}
