"use client"

import { ColumnDef } from "@tanstack/react-table"
import {FactorModel} from "@/model/factorModel";
import {Badge} from "@/components/ui/badge";

export const factorColumns = (): ColumnDef<FactorModel>[] => [
  {
    accessorKey: "id",
    header: "ID",
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "Factor Name",
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
  ,
  {
    accessorKey: "learners",
    header: "Learner Count",
    enableHiding: true,
    cell:(row)=>{
      return(
          <Badge variant={"secondary"}>
            {row.row.original.learners}
          </Badge>
      )
    }
  }
];
