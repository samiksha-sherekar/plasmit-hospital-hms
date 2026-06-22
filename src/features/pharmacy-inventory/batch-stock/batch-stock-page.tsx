"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Boxes } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { InventoryActions } from "@/features/pharmacy-inventory/components/inventory-actions";
import { InventoryRecordForm, type InventoryField } from "@/features/pharmacy-inventory/components/inventory-record-form";
import { InventoryShell } from "@/features/pharmacy-inventory/components/inventory-shell";
import { initialBatchStock } from "@/features/pharmacy-inventory/data/inventory-data";
import type { BatchStockRecord } from "@/features/pharmacy-inventory/types";

const fields: InventoryField<BatchStockRecord>[] = [
  { key: "drug", label: "Drug" },
  { key: "batchNumber", label: "Batch Number" },
  { key: "manufacturingDate", label: "Manufacturing Date", type: "date" },
  { key: "expiryDate", label: "Expiry Date", type: "date" },
  { key: "availableQuantity", label: "Available Quantity", type: "number" },
  { key: "purchasePrice", label: "Purchase Price", type: "number" },
  { key: "mrp", label: "MRP", type: "number" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status", type: "select", options: ["Available", "Near Expiry", "Expired"] },
];

export function BatchStockPage() {
  const [records] = React.useState(initialBatchStock);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [selected, setSelected] = React.useState<BatchStockRecord | null>(null);
  const filtered = records.filter((record) => `${record.drug} ${record.batchNumber} ${record.location} ${record.status}`.toLowerCase().includes(search.toLowerCase()) && (status === "All status" || record.status === status));
  const columns = React.useMemo<ColumnDef<BatchStockRecord>[]>(() => [
    { header: "Drug", accessorKey: "drug" },
    { header: "Batch Number", accessorKey: "batchNumber" },
    { header: "Manufacturing Date", accessorKey: "manufacturingDate" },
    { header: "Expiry Date", accessorKey: "expiryDate" },
    { header: "Available Qty", accessorKey: "availableQuantity" },
    { header: "Purchase Price", accessorKey: "purchasePrice" },
    { header: "MRP", accessorKey: "mrp" },
    { header: "Location", accessorKey: "location" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Actions", cell: ({ row }) => <InventoryActions onView={() => setSelected(row.original)} /> },
  ], []);
  return (
    <div className="space-y-6 mt-4">
      <FilterBar search={search} onSearch={setSearch} placeholder="Search drug, batch, location, status..."><NativeSelect label="" value={status} onChange={setStatus} options={["All status", "Available", "Near Expiry", "Expired"]} /></FilterBar>
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} title="View batch stock" submitLabel="Close" onSubmit={() => setSelected(null)}>
        {selected ? <InventoryRecordForm value={selected} fields={fields} readOnly onChange={setSelected} /> : null}
      </MasterDialog>
    </div>
  );
}
