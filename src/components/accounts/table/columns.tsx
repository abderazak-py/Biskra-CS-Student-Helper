"use client"

import { ColumnDef } from "@tanstack/react-table"
import {CourseDetailModel, CourseModel} from "@/model/courseModel"
import { Badge } from "@/components/ui/badge"
import {AccountModel} from "@/model/accountModel";

export const accountColumn = (): ColumnDef<AccountModel>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: true,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string
      return value.toLowerCase().includes((filterValue as string).toLowerCase())
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string
      return value.toLowerCase().includes((filterValue as string).toLowerCase())
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: "Role",
    enableHiding: true,
    cell:(row)=>{
      return(
          <Badge>
            {row.row.original.role}
          </Badge>
      )
    }
  },

]
