"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Repeat } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { InventoryActions } from "@/features/pharmacy-inventory/components/inventory-actions";
import { InventoryRecordForm, type InventoryField } from "@/features/pharmacy-inventory/components/inventory-record-form";
import { InventoryShell } from "@/features/pharmacy-inventory/components/inventory-shell";
import { initialStockTransfers } from "@/features/pharmacy-inventory/data/inventory-data";
import type { InventoryMode, StockTransferRecord } from "@/features/pharmacy-inventory/types";

const fields: InventoryField<StockTransferRecord>[] = [
  { key: "transferNumber", label: "Transfer Number" },
  { key: "fromStore", label: "From Store" },
  { key: "toStore", label: "To Store" },
  { key: "drug", label: "Drug" },
  { key: "batch", label: "Batch" },
  { key: "transferQuantity", label: "Transfer Quantity", type: "number" },
  { key: "transferDate", label: "Transfer Date", type: "date" },
  { key: "remarks", label: "Remarks", type: "textarea" },
];

const emptyRecord = (): StockTransferRecord => ({ id: `trf-${Date.now()}`, transferNumber: `TRF-${Date.now().toString().slice(-4)}`, fromStore: "Main Store", toStore: "", drug: "", batch: "", transferQuantity: 0, transferDate: new Date().toISOString().slice(0, 10), remarks: "", status: "Submitted", submittedBy: "Pharmacist", submittedDate: new Date().toISOString().slice(0, 10), approvedBy: "", approvedDate: "", rejectedReason: "" });

export function StockTransferPage() {
  const [records, setRecords] = React.useState(initialStockTransfers);
  const [search, setSearch] = React.useState("");
  const [mode, setMode] = React.useState<InventoryMode>("create");
  const [draft, setDraft] = React.useState<StockTransferRecord>(emptyRecord);
  const [open, setOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<StockTransferRecord | null>(null);
  const filtered = records.filter((record) => `${record.transferNumber} ${record.fromStore} ${record.toStore} ${record.drug} ${record.batch}`.toLowerCase().includes(search.toLowerCase()));
  const columns = React.useMemo<ColumnDef<StockTransferRecord>[]>(() => [
    { header: "Transfer Number", accessorKey: "transferNumber" },
    { header: "From Store", accessorKey: "fromStore" },
    { header: "To Store", accessorKey: "toStore" },
    { header: "Drug", accessorKey: "drug" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Transfer Qty", accessorKey: "transferQuantity" },
    { header: "Transfer Date", accessorKey: "transferDate" },
    { header: "Remarks", accessorKey: "remarks" },
    { header: "Actions", cell: ({ row }) => <InventoryActions canEdit onView={() => openRecord(row.original, "view")} onEdit={() => openRecord(row.original, "edit")} onDelete={() => setDeleteTarget(row.original)} /> },
  ], []);

  function openRecord(record: StockTransferRecord, nextMode: InventoryMode) { setDraft(record); setMode(nextMode); setOpen(true); }
  function save() { setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]); toast.success(mode === "edit" ? "Stock transfer updated" : "Stock transfer created"); setOpen(false); }

  return (
    <InventoryShell title="Stock Transfer" icon={Repeat} actionLabel="Create transfer" onCreate={() => openRecord(emptyRecord(), "create")}>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search transfer, store, drug, batch...">
        <Button onClick={() => openRecord(emptyRecord(), "create")}>
          <Repeat className="h-4 w-4" />
          Create transfer
        </Button>
      </FilterBar>
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "view" ? "View stock transfer" : mode === "edit" ? "Edit stock transfer" : "Create stock transfer"} submitLabel={mode === "view" ? "Close" : mode === "edit" ? "Update transfer" : "Create transfer"} onSubmit={mode === "view" ? () => setOpen(false) : save}>
        <InventoryRecordForm value={draft} fields={fields} readOnly={mode === "view"} onChange={setDraft} />
      </MasterDialog>
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(nextOpen) => !nextOpen && setDeleteTarget(null)} description={`Delete ${deleteTarget?.transferNumber ?? "this transfer"}?`} onConfirm={() => { if (deleteTarget) setRecords((current) => current.filter((record) => record.id !== deleteTarget.id)); setOpen(false); toast.success("Stock transfer deleted"); }} />
    </InventoryShell>
  );
}
