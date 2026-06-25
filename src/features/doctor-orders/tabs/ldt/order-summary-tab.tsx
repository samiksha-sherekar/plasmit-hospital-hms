"use client";

import * as React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import type { LdtSummaryRow } from "./types";

type Props = {
  rows: LdtSummaryRow[];
  onView: (row: LdtSummaryRow) => void;
  onEdit: (row: LdtSummaryRow) => void;
  onDelete: (row: LdtSummaryRow) => void;
};

export function LdtOrderSummaryTab({ rows, onView, onEdit, onDelete }: Props) {
  const columns = React.useMemo<ColumnDef<LdtSummaryRow>[]>(
    () => [
      { header: "Order No", accessorKey: "orderNo" },
      { header: "LDT Type", accessorKey: "ldtType" },
      { header: "Priority", accessorKey: "priority" },
      { header: "Indication", accessorKey: "indication" },
      { header: "Order Date", accessorKey: "orderDate" },
      { header: "Status", accessorKey: "status" },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {/* <Button size="sm" variant="outline" type="button" onClick={() => onView(row.original)}>
              <Eye className="h-4 w-4" />
              View
            </Button> */}
            <Button size="sm" variant="outline" type="button" onClick={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4" />
              
            </Button>
            <Button size="sm" variant="outline" type="button" className="text-danger" onClick={() => onDelete(row.original)}>
              <Trash2 className="h-4 w-4" />
              
            </Button>
          </div>
        ),
      },
    ],
    [onDelete, onEdit, onView],
  );

  return <DataTable data={rows} columns={columns} />;
}
