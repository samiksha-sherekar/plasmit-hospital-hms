"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { PurchaseActions } from "@/features/pharmacy-purchase/components/purchase-actions";
import { PurchaseRecordForm, type PurchaseField } from "@/features/pharmacy-purchase/components/purchase-record-form";
import { PurchaseShell } from "@/features/pharmacy-purchase/components/purchase-shell";
import { initialPurchaseReturns, purchaseStatuses } from "@/features/pharmacy-purchase/data/purchase-data";
import type { PurchaseMode, PurchaseReturnRecord } from "@/features/pharmacy-purchase/types";

const fields: PurchaseField<PurchaseReturnRecord>[] = [
  { key: "returnNumber", label: "Return Number", required: true },
  { key: "supplier", label: "Supplier", required: true },
  { key: "returnDate", label: "Return Date", type: "date", required: true },
  { key: "reason", label: "Reason", type: "select", options: ["Damaged", "Expired", "Wrong Item", "Excess Supply"] },
  { key: "status", label: "Status", type: "select", options: ["Submitted", "Approved", "Rejected", "Returned"] },
  { key: "drug", label: "Drug", required: true },
  { key: "batch", label: "Batch", required: true },
  { key: "returnQuantity", label: "Return Quantity", type: "number" },
  { key: "purchasePrice", label: "Purchase Price", type: "number" },
  { key: "amount", label: "Amount", type: "number" },
];

const emptyRecord = (): PurchaseReturnRecord => ({ id: `ret-${Date.now()}`, returnNumber: `RET-${Date.now().toString().slice(-4)}`, supplier: "", returnDate: new Date().toISOString().slice(0, 10), reason: "Damaged", status: "Submitted", submittedBy: "Pharmacist", submittedDate: new Date().toISOString().slice(0, 10), approvedBy: "", approvedDate: "", rejectedReason: "", drug: "", batch: "", returnQuantity: 0, purchasePrice: 0, amount: 0 });

export function PurchaseReturnPage() {
  const [records, setRecords] = React.useState(initialPurchaseReturns);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [mode, setMode] = React.useState<PurchaseMode>("create");
  const [draft, setDraft] = React.useState<PurchaseReturnRecord>(emptyRecord);
  const [open, setOpen] = React.useState(false);

  const filtered = records.filter((record) => `${record.returnNumber} ${record.supplier} ${record.reason} ${record.drug} ${record.batch} ${record.status}`.toLowerCase().includes(search.toLowerCase()) && (status === "All status" || record.status === status));
  const columns = React.useMemo<ColumnDef<PurchaseReturnRecord>[]>(() => [
    { header: "Return Number", accessorKey: "returnNumber" },
    { header: "Supplier", accessorKey: "supplier" },
    { header: "Return Date", accessorKey: "returnDate" },
    { header: "Reason", accessorKey: "reason" },
    { header: "Drug", accessorKey: "drug" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Return Qty", accessorKey: "returnQuantity" },
    { header: "Purchase Price", accessorKey: "purchasePrice" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Actions", cell: ({ row }) => <PurchaseActions canPrint onView={() => openRecord(row.original, "view")} onPrint={() => toast.success(`Print queued for ${row.original.returnNumber}`)} /> },
  ], []);

  function openRecord(record: PurchaseReturnRecord, nextMode: PurchaseMode) { setDraft(record); setMode(nextMode); setOpen(true); }
  function save() { const amount = draft.returnQuantity * draft.purchasePrice; setRecords((current) => [{ ...draft, amount: Number(amount.toFixed(2)) }, ...current]); toast.success("Purchase return created"); setOpen(false); }

  return (
    <div className="space-y-4 mt-4">
      <FilterBar search={search} onSearch={setSearch} placeholder="Search return, supplier, reason, drug, batch..."><NativeSelect label="" value={status} onChange={setStatus} options={purchaseStatuses.returns} /></FilterBar>
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "view" ? "View purchase return" : "Create purchase return"} submitLabel={mode === "view" ? "Close" : "Create return"} onSubmit={mode === "view" ? () => setOpen(false) : save}>
        <PurchaseRecordForm value={draft} fields={fields} readOnly={mode === "view"} onChange={setDraft} />
      </MasterDialog>
    </div>
  );
}
