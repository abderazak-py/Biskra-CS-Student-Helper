"use client"

import { flexRender } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Table as TableType } from "@tanstack/react-table"
import React from "react"
import { SquareLibrary } from "lucide-react"
import { DataTablePagination } from "@/components/tabel/tabel-pagination"

type DataTableProps<TData> = {
    table: TableType<TData>
    onRowClick?: (row: TData) => void
}

export default function DataTable<TData>({
                                             table,
                                             onRowClick = (row) => {
                                             },
                                         }: DataTableProps<TData>) {
    const isEmpty = !table.getRowModel().rows?.length

    return (
        <div className="rounded-lg border bg-card shadow-sm flex flex-col h-full">
            {/* Table Container with Enhanced Scrolling */}
            <div className="flex-1 overflow-auto relative">
                <Table>
                    <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-transparent border-b-2"
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="font-semibold text-foreground"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {!isEmpty ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="transition-colors hover:bg-muted/50 cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        animationFillMode: "backwards",
                                    }}
                                    onClick={() => onRowClick(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="h-[550px]"
                                >
                                    <div className="flex flex-col items-center justify-center h-full space-y-3 text-muted-foreground animate-in fade-in zoom-in-95 duration-500">
                                        <div className="rounded-full bg-muted p-4">
                                            <SquareLibrary size={32} className="opacity-50" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="font-medium text-base">No data available</p>
                                            <p className="text-sm opacity-70">
                                                Your table will appear here once data is loaded
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer */}
            <div className="border-t bg-muted/30 px-2">
                <DataTablePagination table={table} />
            </div>
        </div>
    )
}
