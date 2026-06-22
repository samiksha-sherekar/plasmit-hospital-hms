"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FilterBar } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { PurchaseActions } from "@/features/pharmacy-purchase/components/purchase-actions";
import { PurchaseRecordForm, type PurchaseField } from "@/features/pharmacy-purchase/components/purchase-record-form";
import { PurchaseShell } from "@/features/pharmacy-purchase/components/purchase-shell";
import { initialPurchaseOrders } from "@/features/pharmacy-purchase/data/purchase-data";
import type { PurchaseMode, PurchaseOrderRecord } from "@/features/pharmacy-purchase/types";

const fields: PurchaseField<PurchaseOrderRecord>[] = [
  { key: "poNumber", label: "PO Number", required: true },
  { key: "poDate", label: "PO Date", type: "date", required: true },
  { key: "supplier", label: "Supplier", required: true },
  { key: "expectedDeliveryDate", label: "Expected Delivery Date", type: "date" },
  { key: "remarks", label: "Remarks", type: "textarea" },
  { key: "drug", label: "Drug", required: true },
  { key: "orderedQuantity", label: "Ordered Quantity", type: "number" },
  { key: "unitPrice", label: "Unit Price", type: "number" },
  { key: "discount", label: "Discount %", type: "number" },
  { key: "gst", label: "GST %", type: "number" },
  { key: "amount", label: "Amount", type: "number" },
];

const emptyRecord = (): PurchaseOrderRecord => ({ id: `po-${Date.now()}`, poNumber: `PO-${Date.now().toString().slice(-4)}`, poDate: new Date().toISOString().slice(0, 10), supplier: "", expectedDeliveryDate: "", remarks: "", status: "Submitted", drug: "", orderedQuantity: 0, unitPrice: 0, discount: 0, gst: 0, amount: 0 });

export function PurchaseOrderPage() {
  const [records, setRecords] = React.useState(initialPurchaseOrders);
  const [search, setSearch] = React.useState("");
  const [mode, setMode] = React.useState<PurchaseMode>("create");
  const [draft, setDraft] = React.useState<PurchaseOrderRecord>(emptyRecord);
  const [open, setOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<PurchaseOrderRecord | null>(null);

  const filtered = records.filter((record) => `${record.poNumber} ${record.supplier} ${record.drug}`.toLowerCase().includes(search.toLowerCase()));
  const columns = React.useMemo<ColumnDef<PurchaseOrderRecord>[]>(() => [
    { header: "PO Number", accessorKey: "poNumber" },
    { header: "PO Date", accessorKey: "poDate" },
    { header: "Supplier", accessorKey: "supplier" },
    { header: "Expected Delivery", accessorKey: "expectedDeliveryDate" },
    { header: "Drug", accessorKey: "drug" },
    { header: "Ordered Qty", accessorKey: "orderedQuantity" },
    { header: "Unit Price", accessorKey: "unitPrice" },
    { header: "Discount", cell: ({ row }) => `${row.original.discount}%` },
    { header: "GST", cell: ({ row }) => `${row.original.gst}%` },
    { header: "Amount", accessorKey: "amount" },
    { header: "Actions", cell: ({ row }) => <PurchaseActions canEdit canDelete onView={() => openRecord(row.original, "view")} onEdit={() => openRecord(row.original, "edit")} onDelete={() => setDeleteTarget(row.original)} /> },
  ], []);

  function openRecord(record: PurchaseOrderRecord, nextMode: PurchaseMode) { setDraft(record); setMode(nextMode); setOpen(true); }
  function save() { const amount = draft.orderedQuantity * draft.unitPrice * (1 - draft.discount / 100) * (1 + draft.gst / 100); setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? { ...draft, amount: Number(amount.toFixed(2)) } : record) : [{ ...draft, amount: Number(amount.toFixed(2)) }, ...current]); toast.success(mode === "edit" ? "Purchase order updated" : "Purchase order created"); setOpen(false); }

  return (
    <div className="space-y-4 mt-4">
      <FilterBar search={search} onSearch={setSearch} placeholder="Search PO number, supplier, drug...">
        <Button onClick={() => openRecord(emptyRecord(), "create")}>
          <ShoppingCart className="h-4 w-4" />
          Create PO
        </Button>
      </FilterBar>
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "view" ? "View purchase order" : mode === "edit" ? "Edit purchase order" : "Create purchase order"} submitLabel={mode === "view" ? "Close" : mode === "edit" ? "Update PO" : "Create PO"} onSubmit={mode === "view" ? () => setOpen(false) : save}>
        <PurchaseRecordForm value={draft} fields={fields} readOnly={mode === "view"} onChange={setDraft} />
      </MasterDialog>
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(nextOpen) => !nextOpen && setDeleteTarget(null)} description={`Delete ${deleteTarget?.poNumber ?? "this PO"}?`} onConfirm={() => { if (deleteTarget) setRecords((current) => current.filter((record) => record.id !== deleteTarget.id)); setOpen(false); toast.success("Purchase order deleted"); }} />
    </div>
  );
}
