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
import {CourseDetailModel, CourseModel} from "@/model/courseModel";

interface CourseTableProps {
    columns: ColumnDef<CourseDetailModel>[];
    data?: CourseDetailModel[];
    filterName?: string;
    onCourseClick?: (row: CourseDetailModel) => void

}

export default function CourseTable({
                                       columns,
                                       data: initialData = [],
                                        onCourseClick
                                   }: CourseTableProps) {

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
        initialState: { pagination: { pageSize: 12 } },
    });



    return (
        <div className="h-[calc(100vh-180px)] mt-2">
            <DataTable table={table} onRowClick={(row)=> onCourseClick ? onCourseClick(row) : undefined} />
        </div>
    );
}
