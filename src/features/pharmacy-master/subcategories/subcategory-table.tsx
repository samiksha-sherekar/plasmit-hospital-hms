"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/features/admin/admin-shared";
import { MasterRowActions } from "@/features/pharmacy-master/components/master-row-actions";
import type { DrugCategory, DrugSubCategory } from "@/features/pharmacy-master/types";
import { categoryName } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

export function SubCategoryTable({
  records,
  categories,
  onEdit,
  onToggle,
  onDelete,
}: {
  records: DrugSubCategory[];
  categories: DrugCategory[];
  onEdit: (record: DrugSubCategory) => void;
  onToggle: (record: DrugSubCategory) => void;
  onDelete: (record: DrugSubCategory) => void;
}) {
  const columns = React.useMemo<ColumnDef<DrugSubCategory>[]>(() => [
    { header: "Category", cell: ({ row }) => categoryName(categories, row.original.categoryId) },
    { header: "Sub Category Name", accessorKey: "subCategoryName" },
    { header: "Code", accessorKey: "code" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Description", accessorKey: "description" },
    { header: "Actions", cell: ({ row }) => <MasterRowActions onEdit={() => onEdit(row.original)} onToggle={() => onToggle(row.original)} onDelete={() => onDelete(row.original)} /> },
  ], [categories, onDelete, onEdit, onToggle]);

  return <DataTable data={records} columns={columns} />;
}

