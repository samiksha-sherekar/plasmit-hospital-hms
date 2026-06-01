"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { PackageMinus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { InventoryActions } from "@/features/pharmacy-inventory/components/inventory-actions";
import { InventoryRecordForm, type InventoryField } from "@/features/pharmacy-inventory/components/inventory-record-form";
import { InventoryShell } from "@/features/pharmacy-inventory/components/inventory-shell";
import { initialStockAdjustments } from "@/features/pharmacy-inventory/data/inventory-data";
import type { InventoryMode, StockAdjustmentRecord } from "@/features/pharmacy-inventory/types";

const fields: InventoryField<StockAdjustmentRecord>[] = [
  { key: "adjustmentNumber", label: "Adjustment Number" },
  { key: "date", label: "Date", type: "date" },
  { key: "drug", label: "Drug" },
  { key: "batch", label: "Batch" },
  { key: "currentQuantity", label: "Current Quantity", type: "number" },
  { key: "adjustedQuantity", label: "Adjusted Quantity", type: "number" },
  { key: "difference", label: "Difference", type: "number" },
  { key: "reason", label: "Reason", type: "select", options: ["Damaged", "Lost", "Expired", "Physical Count Difference"] },
  { key: "remarks", label: "Remarks", type: "textarea" },
];

const emptyRecord = (): StockAdjustmentRecord => ({ id: `adj-${Date.now()}`, adjustmentNumber: `ADJ-${Date.now().toString().slice(-4)}`, date: new Date().toISOString().slice(0, 10), drug: "", batch: "", currentQuantity: 0, adjustedQuantity: 0, difference: 0, reason: "Physical Count Difference", remarks: "", status: "Submitted", submittedBy: "Pharmacist", submittedDate: new Date().toISOString().slice(0, 10), approvedBy: "", approvedDate: "", rejectedReason: "" });

export function StockAdjustmentPage() {
  const [records, setRecords] = React.useState(initialStockAdjustments);
  const [search, setSearch] = React.useState("");
  const [mode, setMode] = React.useState<InventoryMode>("create");
  const [draft, setDraft] = React.useState<StockAdjustmentRecord>(emptyRecord);
  const [open, setOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<StockAdjustmentRecord | null>(null);
  const filtered = records.filter((record) => `${record.adjustmentNumber} ${record.drug} ${record.batch} ${record.reason}`.toLowerCase().includes(search.toLowerCase()));
  const columns = React.useMemo<ColumnDef<StockAdjustmentRecord>[]>(() => [
    { header: "Adjustment Number", accessorKey: "adjustmentNumber" },
    { header: "Date", accessorKey: "date" },
    { header: "Drug", accessorKey: "drug" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Current Qty", accessorKey: "currentQuantity" },
    { header: "Adjusted Qty", accessorKey: "adjustedQuantity" },
    { header: "Difference", accessorKey: "difference" },
    { header: "Reason", accessorKey: "reason" },
    { header: "Remarks", accessorKey: "remarks" },
    { header: "Actions", cell: ({ row }) => <InventoryActions canEdit onView={() => openRecord(row.original, "view")} onEdit={() => openRecord(row.original, "edit")} onDelete={() => setDeleteTarget(row.original)} /> },
  ], []);

  function openRecord(record: StockAdjustmentRecord, nextMode: InventoryMode) { setDraft(record); setMode(nextMode); setOpen(true); }
  function save() { const nextDraft = { ...draft, difference: draft.adjustedQuantity - draft.currentQuantity }; setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? nextDraft : record) : [nextDraft, ...current]); toast.success(mode === "edit" ? "Stock adjustment updated" : "Stock adjustment created"); setOpen(false); }

  return (
    <InventoryShell title="Stock Adjustment" icon={PackageMinus} actionLabel="Create adjustment" onCreate={() => openRecord(emptyRecord(), "create")}>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search adjustment, drug, batch, reason..." />
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "view" ? "View stock adjustment" : mode === "edit" ? "Edit stock adjustment" : "Create stock adjustment"} submitLabel={mode === "view" ? "Close" : mode === "edit" ? "Update adjustment" : "Create adjustment"} onSubmit={mode === "view" ? () => setOpen(false) : save}>
        <InventoryRecordForm value={draft} fields={fields} readOnly={mode === "view"} onChange={setDraft} />
      </MasterDialog>
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(nextOpen) => !nextOpen && setDeleteTarget(null)} description={`Delete ${deleteTarget?.adjustmentNumber ?? "this adjustment"}?`} onConfirm={() => { if (deleteTarget) setRecords((current) => current.filter((record) => record.id !== deleteTarget.id)); setOpen(false); toast.success("Stock adjustment deleted"); }} />
    </InventoryShell>
  );
}
