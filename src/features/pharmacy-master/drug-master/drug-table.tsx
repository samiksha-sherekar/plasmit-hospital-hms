"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/features/admin/admin-shared";
import { MasterRowActions } from "@/features/pharmacy-master/components/master-row-actions";
import type { DrugCategory, DrugMasterRecord, DrugSubCategory } from "@/features/pharmacy-master/types";
import { categoryName, subCategoryName } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

export function DrugTable({
  records,
  categories,
  subCategories,
  onEdit,
  onClone,
  onToggle,
  onDelete,
}: {
  records: DrugMasterRecord[];
  categories: DrugCategory[];
  subCategories: DrugSubCategory[];
  onEdit: (record: DrugMasterRecord) => void;
  onClone: (record: DrugMasterRecord) => void;
  onToggle: (record: DrugMasterRecord) => void;
  onDelete: (record: DrugMasterRecord) => void;
}) {
  const columns = React.useMemo<ColumnDef<DrugMasterRecord>[]>(() => [
    { header: "Drug Name", accessorKey: "drugName" },
    { header: "Generic Name", accessorKey: "genericName" },
    { header: "Brand Name", accessorKey: "brandName" },
    { header: "Category", cell: ({ row }) => categoryName(categories, row.original.categoryId) },
    { header: "Sub Category", cell: ({ row }) => subCategoryName(subCategories, row.original.subCategoryId) },
    { header: "Manufacturer", accessorKey: "manufacturer" },
    { header: "Form", accessorKey: "form" },
    { header: "Strength", accessorKey: "strength" },
    { header: "Unit", accessorKey: "unit" },
    { header: "Route", accessorKey: "route" },
    { header: "HSN", accessorKey: "hsnCode" },
    { header: "GST %", accessorKey: "gstPercent" },
    { header: "Reorder", accessorKey: "reorderLevel" },
    { header: "Min/Max", cell: ({ row }) => `${row.original.minimumStock}/${row.original.maximumStock}` },
    { header: "Prescription", cell: ({ row }) => <Badge tone={row.original.prescriptionRequired === "Yes" ? "warning" : "muted"}>{row.original.prescriptionRequired}</Badge> },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Actions", cell: ({ row }) => <MasterRowActions onEdit={() => onEdit(row.original)} onClone={() => onClone(row.original)} onToggle={() => onToggle(row.original)} onDelete={() => onDelete(row.original)} /> },
  ], [categories, onClone, onDelete, onEdit, onToggle, subCategories]);

  return <DataTable data={records} columns={columns} />;
}
