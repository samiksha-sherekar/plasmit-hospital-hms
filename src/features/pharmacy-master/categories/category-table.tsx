"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/features/admin/admin-shared";
import { MasterRowActions } from "@/features/pharmacy-master/components/master-row-actions";
import type { DrugCategory } from "@/features/pharmacy-master/types";

export function CategoryTable({
  records,
  onEdit,
  onToggle,
  onDelete,
}: {
  records: DrugCategory[];
  onEdit: (record: DrugCategory) => void;
  onToggle: (record: DrugCategory) => void;
  onDelete: (record: DrugCategory) => void;
}) {
  const columns = React.useMemo<ColumnDef<DrugCategory>[]>(() => [
    { header: "Category Name", accessorKey: "categoryName" },
    { header: "Code", accessorKey: "code" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Description", accessorKey: "description" },
    { header: "Actions", cell: ({ row }) => <MasterRowActions onEdit={() => onEdit(row.original)} onToggle={() => onToggle(row.original)} onDelete={() => onDelete(row.original)} /> },
  ], [onDelete, onEdit, onToggle]);

  return <DataTable data={records} columns={columns} />;
}

