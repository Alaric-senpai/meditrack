"use client"

import * as React from "react"
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
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
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export type AuditLog = {
    $id: string;
    userId: string;
    action: string;
    resource: string;
    status: string;
    details: string;
    ipAddress?: string;
    $createdAt: string;
}

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <span className="font-medium">{row.getValue("action")}</span>,
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("userId")}</span>,
  },
  {
    accessorKey: "resource",
    header: "Resource",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("resource")}</Badge>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
            <Badge variant={status === 'success' ? 'default' : 'destructive'} className="capitalize">
                {status}
            </Badge>
        )
    },
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => <span className="text-xs text-muted-foreground truncate max-w-[200px] inline-block" title={row.getValue("details")}>{row.getValue("details")}</span>,
  },
  {
    accessorKey: "$createdAt",
    header: "Timestamp",
    cell: ({ row }) => <span className="text-sm">{format(new Date(row.getValue("$createdAt")), "PPpp")}</span>,
  },
]

export function AuditLogsTable({ data }: { data: AuditLog[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
        <div className="rounded-md border bg-card">
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
                    No logs found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-end space-x-2">
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
  )
}
