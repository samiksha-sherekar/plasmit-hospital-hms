"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/features/admin/admin-shared";
import { MasterRowActions } from "@/features/pharmacy-master/components/master-row-actions";
import type { ManufacturerRecord } from "@/features/pharmacy-master/types";

export function ManufacturerTable({ records, onEdit, onToggle, onDelete }: { records: ManufacturerRecord[]; onEdit: (record: ManufacturerRecord) => void; onToggle: (record: ManufacturerRecord) => void; onDelete: (record: ManufacturerRecord) => void }) {
  const columns = React.useMemo<ColumnDef<ManufacturerRecord>[]>(() => [
    { header: "Manufacturer Name", accessorKey: "manufacturerName" },
    { header: "Code", accessorKey: "code" },
    { header: "Contact Person", accessorKey: "contactPerson" },
    { header: "Phone Number", accessorKey: "phoneNumber" },
    { header: "Email", accessorKey: "email" },
    { header: "GST Number", accessorKey: "gstNumber" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Actions", cell: ({ row }) => <MasterRowActions onEdit={() => onEdit(row.original)} onToggle={() => onToggle(row.original)} onDelete={() => onDelete(row.original)} /> },
  ], [onDelete, onEdit, onToggle]);

  return <DataTable data={records} columns={columns} />;
}

