"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Group = {
  id: string;
  name: string;
  description: string;
};

export const groupColumns = (): ColumnDef<Group>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "Group Name",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value.toLowerCase().includes((filterValue as string).toLowerCase());
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    enableHiding: true,
  }
];
