"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, MoreHorizontal, Shield, Ban, CheckCircle, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toggleUserStatus, updateUserRole, revokeUserSessions } from "@/actions/admin-user.actions"
import { toast } from "sonner"
import { DoctorModal } from "./doctor-modal"
import { NurseModal } from "./nurse-modal"
import { UserDetailsDrawer } from "./user-details-drawer"
import { AssignDepartmentDialog } from "./assign-department-dialog"
import { Building2 } from "lucide-react"

export type AdminUser = {
  $id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "doctor" | "nurse" | "lab_tech" | "pharmacist" | "patient"
  status?: "active" | "inactive"
  phone?: string
  lastLogin?: string
  specialty?: string
  bio?: string
  profilePhoto?: string
  department?: string
}

export const columns: ColumnDef<AdminUser>[] = [
  {
    id: "name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: "User",
    cell: ({ row }) => {
      const user = row.original
      const name = `${user.firstName} ${user.lastName}`
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.profilePhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt={name} className="object-cover" />
            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      
      const colors: Record<string, string> = {
        admin: "bg-amber-100 text-amber-700 border-amber-200",
        doctor: "bg-blue-100 text-blue-700 border-blue-200",
        nurse: "bg-blue-50 text-blue-600 border-blue-100",
        lab_tech: "bg-purple-100 text-purple-700 border-purple-200",
        pharmacist: "bg-emerald-100 text-emerald-700 border-emerald-200",
        patient: "bg-teal-100 text-teal-700 border-teal-200",
      }

      return (
        <Badge variant="outline" className={`${colors[role] || "bg-slate-100 text-slate-700"} capitalize`}>
          {role.replace("_", " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const dept = row.getValue("department") as string
      return dept ? (
        <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 uppercase">
          {dept}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-xs italic">Unassigned</span>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || 'active'
      return (
        <div className="flex items-center gap-2">
           {status === 'active' ? (
             <CheckCircle className="h-4 w-4 text-green-500" />
           ) : (
             <Ban className="h-4 w-4 text-red-500" />
           )}
           <span className="capitalize text-sm">{status}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => {
       const phone = row.getValue("phone") as string
       return phone ? (
         <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Smartphone className="h-3 w-3" />
            {phone}
         </div>
       ) : <span className="text-muted-foreground text-xs">-</span>
    }
  },
  {
    id: "actions",
    enableHiding: false, 
    cell: ({ row }) => {
      const user = row.original

      const [showEditModal, setShowEditModal] = React.useState(false)
      const [showDetailsDrawer, setShowDetailsDrawer] = React.useState(false)
      const [showAssignDept, setShowAssignDept] = React.useState(false)
      const isDoctor = user.role === 'doctor'
      const isNurse = user.role === 'nurse'
      const isClinician = isDoctor || isNurse

      return (
        <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.userId)}
                >
                  Copy User ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setShowDetailsDrawer(true)
                }}>View details</DropdownMenuItem>
                
                {(isDoctor || isNurse) && (
                    <>
                        <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                            Edit Professional Info
                        </DropdownMenuItem>
                        {!user.department && (
                            <DropdownMenuItem onClick={() => setShowAssignDept(true)} className="text-amber-600">
                                <Building2 className="mr-2 h-4 w-4" />
                                Assign Department
                            </DropdownMenuItem>
                        )}
                        {user.department && (
                            <DropdownMenuItem onClick={() => setShowAssignDept(true)}>
                                Change Department
                            </DropdownMenuItem>
                        )}
                    </>
                )}

                <DropdownMenuItem 
                   className="text-red-600 focus:text-red-600"
                   onClick={async () => {
                       const tId = toast.loading('Updating status...')
                       try {
                           const result = await toggleUserStatus(user.userId, user.status || 'active')
                           if (result.success) {
                               toast.success('User status updated', { id: tId })
                           } else {
                               toast.error(result.message || 'Failed to update user', { id: tId })
                           }
                       } catch (error) {
                           toast.error('An unexpected error occurred', { id: tId })
                       }
                   }}
                >
                    {user.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="text-amber-600 focus:text-amber-600"
                    onClick={async () => {
                        const tId = toast.loading('Revoking sessions...')
                        try {
                            const result = await revokeUserSessions(user.userId)
                            if (result.success) {
                                toast.success('All active sessions revoked.', { id: tId })
                            } else {
                                toast.error(result.message || 'Failed to revoke sessions', { id: tId })
                            }
                        } catch (error) {
                            toast.error('An unexpected error occurred', { id: tId })
                        }
                    }}
                >
                    Revoke Sessions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isDoctor && (
                <DoctorModal 
                    doctor={user}
                    open={showEditModal}
                    onOpenChange={setShowEditModal}
                />
            )}

            {isNurse && (
                <NurseModal 
                    nurse={user}
                    open={showEditModal}
                    onOpenChange={setShowEditModal}
                />
            )}

            <UserDetailsDrawer 
                userId={showDetailsDrawer ? user.userId : null}
                role={showDetailsDrawer ? user.role : null}
                open={showDetailsDrawer}
                onOpenChange={setShowDetailsDrawer}
            />

            {isClinician && (
                <AssignDepartmentDialog 
                    user={user as any}
                    open={showAssignDept}
                    onOpenChange={setShowAssignDept}
                />
            )}
        </>
      )
    },
  },
]

export function UsersTable({ data }: { data: AdminUser[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name/email..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
