"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { PurchaseActions } from "@/features/pharmacy-purchase/components/purchase-actions";
import { PurchaseRecordForm, type PurchaseField } from "@/features/pharmacy-purchase/components/purchase-record-form";
import { PurchaseShell } from "@/features/pharmacy-purchase/components/purchase-shell";
import { initialPurchaseRequisitions } from "@/features/pharmacy-purchase/data/purchase-data";
import type { PurchaseMode, PurchaseRequisitionRecord } from "@/features/pharmacy-purchase/types";

const fields: PurchaseField<PurchaseRequisitionRecord>[] = [
  { key: "prNumber", label: "PR Number", required: true },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "requestedBy", label: "Requested By", required: true },
  { key: "priority", label: "Priority", type: "select", options: ["Low", "Normal", "High", "Urgent"] },
  { key: "remarks", label: "Remarks", type: "textarea" },
  { key: "drug", label: "Drug", required: true },
  { key: "requiredQuantity", label: "Required Quantity", type: "number" },
  { key: "currentStock", label: "Current Stock", type: "number" },
  { key: "reorderLevel", label: "Reorder Level", type: "number" },
  { key: "itemRemarks", label: "Item Remarks", type: "textarea" },
];

const emptyRecord = (): PurchaseRequisitionRecord => ({
  id: `pr-${Date.now()}`,
  prNumber: `PR-${Date.now().toString().slice(-4)}`,
  date: new Date().toISOString().slice(0, 10),
  requestedBy: "Pharmacy",
  priority: "Normal",
  remarks: "",
  status: "Submitted",
  submittedBy: "Pharmacist",
  submittedDate: new Date().toISOString().slice(0, 10),
  approvedBy: "",
  approvedDate: "",
  rejectedReason: "",
  drug: "",
  requiredQuantity: 0,
  currentStock: 0,
  reorderLevel: 0,
  itemRemarks: "",
});

export function PurchaseRequisitionPage() {
  const [records, setRecords] = React.useState(initialPurchaseRequisitions);
  const [search, setSearch] = React.useState("");
  const [mode, setMode] = React.useState<PurchaseMode>("create");
  const [draft, setDraft] = React.useState<PurchaseRequisitionRecord>(emptyRecord);
  const [open, setOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<PurchaseRequisitionRecord | null>(null);

  const filtered = records.filter((record) => `${record.prNumber} ${record.requestedBy} ${record.priority} ${record.drug}`.toLowerCase().includes(search.toLowerCase()));

  const columns = React.useMemo<ColumnDef<PurchaseRequisitionRecord>[]>(() => [
    { header: "PR Number", accessorKey: "prNumber" },
    { header: "Date", accessorKey: "date" },
    { header: "Requested By", accessorKey: "requestedBy" },
    { header: "Priority", accessorKey: "priority" },
    { header: "Drug", accessorKey: "drug" },
    { header: "Required Qty", accessorKey: "requiredQuantity" },
    { header: "Current Stock", accessorKey: "currentStock" },
    { header: "Reorder Level", accessorKey: "reorderLevel" },
    { header: "Remarks", accessorKey: "remarks" },
    { header: "Actions", cell: ({ row }) => <PurchaseActions canEdit canDelete onView={() => openRecord(row.original, "view")} onEdit={() => openRecord(row.original, "edit")} onDelete={() => setDeleteTarget(row.original)} /> },
  ], []);

  function openRecord(record: PurchaseRequisitionRecord, nextMode: PurchaseMode) {
    setDraft(record);
    setMode(nextMode);
    setOpen(true);
  }

  function save() {
    setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]);
    toast.success(mode === "edit" ? "Purchase requisition updated" : "Purchase requisition created");
    setOpen(false);
  }

  return (
    <div className="space-y-4 mt-4">
      <FilterBar search={search} onSearch={setSearch} placeholder="Search PR number, drug, requested by, priority...">
        <Button onClick={() => openRecord(emptyRecord(), "create")}>
          <ClipboardList className="h-4 w-4" />
          Create PR
        </Button>
      </FilterBar>
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "view" ? "View purchase requisition" : mode === "edit" ? "Edit purchase requisition" : "Create purchase requisition"} submitLabel={mode === "view" ? "Close" : mode === "edit" ? "Update PR" : "Create PR"} onSubmit={mode === "view" ? () => setOpen(false) : save} onDelete={mode === "edit" ? () => setDeleteTarget(draft) : undefined}>
        <PurchaseRecordForm value={draft} fields={fields} readOnly={mode === "view"} onChange={setDraft} />
      </MasterDialog>
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(nextOpen) => !nextOpen && setDeleteTarget(null)} description={`Delete ${deleteTarget?.prNumber ?? "this PR"}?`} onConfirm={() => { if (deleteTarget) setRecords((current) => current.filter((record) => record.id !== deleteTarget.id)); setOpen(false); toast.success("Purchase requisition deleted"); }} />
    </div>
  );
}
