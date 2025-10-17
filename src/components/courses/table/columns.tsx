"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CourseDetailModel } from "@/model/courseModel"
import { Badge } from "@/components/ui/badge"

const MAX_VISIBLE = 6 // Number of badges to show before "+N more"

export const courseColumn = (): ColumnDef<CourseDetailModel>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: true,
  },
  {
    accessorKey: "title",
    header: "Course Title",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string
      return value.toLowerCase().includes((filterValue as string).toLowerCase())
    },
    cell: ({ row }) => (
        <div className="w-48 truncate" title={row.original.title}>
          {row.original.title}
        </div>
    )
  },
  {
    accessorKey: "description",
    header: "Description",
    enableHiding: true,
    cell: ({ row }) => (
        <div className="w-64 truncate" title={row.original.description}>
          {row.original.description}
        </div>
    )
  },
  {
    accessorKey: "groups",
    header: "Groups",
    enableHiding: true,
    cell: ({ row }) => {
      const groups = row.original.groups || []
      const visibleGroups = groups.slice(0, MAX_VISIBLE)
      const remainingCount = groups.length - visibleGroups.length

      return (
          <div className="flex gap-1 items-center">
            {visibleGroups.map((group, index) => (
                <Badge key={index} variant="secondary" title={group.groupName}>
                  {group.groupName}
                </Badge>
            ))}
            {remainingCount > 0 && (
                <Badge variant="default">+{remainingCount} more</Badge>
            )}
          </div>
      )
    }
  },
  {
    accessorKey: "factors",
    header: "Factors",
    enableHiding: true,
    cell: ({ row }) => {
      const factors = row.original.factors || []
      const visibleFactors = factors.slice(0, MAX_VISIBLE)
      const remainingCount = factors.length - visibleFactors.length

      return (
          <div className="flex gap-1 items-center">
            {visibleFactors.map((factor, index) => (
                <Badge key={index} variant="secondary" title={factor.factorName}>
                  {factor.factorName}
                </Badge>
            ))}
            {remainingCount > 0 && (
                <Badge variant="default">+{remainingCount} more</Badge>
            )}
          </div>
      )
    }
  }
]
