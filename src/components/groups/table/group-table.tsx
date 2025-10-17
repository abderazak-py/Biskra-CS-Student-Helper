"use client"

import React, { useEffect, useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";

import DataTable from "@/components/tabel/data-tabel";
import { Group } from "./columns";

interface GroupTableProps {
    columns: ColumnDef<Group>[];
    data?: Group[];
    filterName?: string;
}

export default function GroupTable({
                                       columns,
                                       data: initialData = [],
                                       filterName
                                   }: GroupTableProps) {

    const [columnVisibility] = useState({
        id: false,
        name: true,
        description: true
    });

    const [rowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: initialData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: { rowSelection, columnVisibility, columnFilters },
        initialState: { pagination: { pageSize: 14 } },
    });

    // Apply filter programmatically
    useEffect(() => {
        table.getColumn("name")?.setFilterValue(filterName ?? "");
    }, [filterName, table]);

    return (
        <div className="h-[calc(100vh-180px)] mt-2">
            <DataTable table={table} />
        </div>
    );
}
