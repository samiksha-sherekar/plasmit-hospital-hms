"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/features/admin/admin-shared";
import { MasterRowActions } from "@/features/pharmacy-master/components/master-row-actions";
import type { SupplierRecord } from "@/features/pharmacy-master/types";

export function SupplierTable({
  records,
  onEdit,
  onToggle,
  onDelete,
}: {
  records: SupplierRecord[];
  onEdit: (record: SupplierRecord) => void;
  onToggle: (record: SupplierRecord) => void;
  onDelete: (record: SupplierRecord) => void;
}) {
  const columns = React.useMemo<ColumnDef<SupplierRecord>[]>(() => [
    { header: "Supplier Name", accessorKey: "supplierName" },
    { header: "Contact Person", accessorKey: "contactPerson" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    { header: "GST Number", accessorKey: "gstNumber" },
    { header: "Payment Terms", accessorKey: "paymentTerms" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Actions", cell: ({ row }) => <MasterRowActions onEdit={() => onEdit(row.original)} onToggle={() => onToggle(row.original)} onDelete={() => onDelete(row.original)} /> },
  ], [onDelete, onEdit, onToggle]);

  return <DataTable data={records} columns={columns} />;
}

