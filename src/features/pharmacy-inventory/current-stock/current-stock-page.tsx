"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { FileDown, Store } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { InventoryActions } from "@/features/pharmacy-inventory/components/inventory-actions";
import { InventoryRecordForm, type InventoryField } from "@/features/pharmacy-inventory/components/inventory-record-form";
import { InventoryShell } from "@/features/pharmacy-inventory/components/inventory-shell";
import { initialCurrentStock } from "@/features/pharmacy-inventory/data/inventory-data";
import type { CurrentStockRecord } from "@/features/pharmacy-inventory/types";

const fields: InventoryField<CurrentStockRecord>[] = [
  { key: "drug", label: "Drug" },
  { key: "batchNumber", label: "Batch Number" },
  { key: "availableQuantity", label: "Available Quantity", type: "number" },
  { key: "reservedQuantity", label: "Reserved Quantity", type: "number" },
  { key: "unit", label: "Unit" },
  { key: "storeLocation", label: "Store Location" },
  { key: "reorderLevel", label: "Reorder Level", type: "number" },
  { key: "expiryDate", label: "Expiry Date", type: "date" },
  { key: "status", label: "Status", type: "select", options: ["Available", "Low Stock", "Expired"] },
];

export function CurrentStockPage() {
  const [records] = React.useState(initialCurrentStock);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [selected, setSelected] = React.useState<CurrentStockRecord | null>(null);
  const filtered = records.filter((record) => `${record.drug} ${record.batchNumber} ${record.storeLocation} ${record.status}`.toLowerCase().includes(search.toLowerCase()) && (status === "All status" || record.status === status));
  const columns = React.useMemo<ColumnDef<CurrentStockRecord>[]>(() => [
    { header: "Drug", accessorKey: "drug" },
    { header: "Batch Number", accessorKey: "batchNumber" },
    { header: "Available Qty", accessorKey: "availableQuantity" },
    { header: "Reserved Qty", accessorKey: "reservedQuantity" },
    { header: "Unit", accessorKey: "unit" },
    { header: "Store Location", accessorKey: "storeLocation" },
    { header: "Reorder Level", accessorKey: "reorderLevel" },
    { header: "Expiry Date", accessorKey: "expiryDate" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Actions", cell: ({ row }) => <InventoryActions canExport onView={() => setSelected(row.original)} onExport={() => toast.success(`Export queued for ${row.original.batchNumber}`)} /> },
  ], []);
  return (
    <InventoryShell title="Current Stock" icon={Store}>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search drug, batch, store, status...">
        <NativeSelect label="Status" value={status} onChange={setStatus} options={["All status", "Available", "Low Stock", "Expired"]} />
      </FilterBar>
      <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary" onClick={() => toast.success("Current stock export queued")} type="button"><FileDown className="h-4 w-4" />Export current stock</button>
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} title="View current stock" submitLabel="Close" onSubmit={() => setSelected(null)}>
        {selected ? <InventoryRecordForm value={selected} fields={fields} readOnly onChange={setSelected} /> : null}
      </MasterDialog>
    </InventoryShell>
  );
}
