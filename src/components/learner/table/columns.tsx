"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {LearnerModel} from "@/model/learnerModel";


export const learnerColumns = (): ColumnDef<LearnerModel>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: true,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value.toLowerCase().includes((filterValue as string).toLowerCase());
    }
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value.toLowerCase().includes((filterValue as string).toLowerCase());
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "groupName",
    header: "Group Name",
    cell:(row)=>{
      const groupName = row.row.original.groupName
      return(
        <Badge variant="secondary">
          {groupName}
        </Badge>
      )
    }
  },{
    accessorKey: "factors.factorName",
    header: "Factors Names",
    cell: (row) => {
      const factors = row.row.original.factors;

      return (
          <div className="flex items-center gap-1 flex-wrap">
            {factors? (
                factors?.map((factor, index) => (
                    <Badge key={index} variant="secondary">
                      {factor.factorName}
                    </Badge>
                ))
            ) : <Badge variant={"destructive"}>No factors found</Badge>}
          </div>
      );
    }
  },
];
