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
import {CourseModel} from "@/model/courseModel";
import { LearnerModel } from "@/model/learnerModel";

interface LeanerTableProps {
    columns: ColumnDef<LearnerModel>[];
    data?: LearnerModel[];
    onLearnerClick?: (row: LearnerModel) => void
}

export default function LearnerTable({
                                       columns,
                                       data: initialData = [],
                                         onLearnerClick
                                   }: LeanerTableProps) {

    const [columnVisibility] = useState({
        id: false,
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


    return (
        <div className="h-[calc(100vh-180px)] mt-2">
            <DataTable table={table} onRowClick={onLearnerClick} />
        </div>
    );
}
