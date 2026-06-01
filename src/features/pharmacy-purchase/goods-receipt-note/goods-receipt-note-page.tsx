"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { PackageCheck } from "lucide-react";
import { toast } from "sonner";

import { AlertBanner } from "@/components/ui/alert-banner";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { PurchaseActions } from "@/features/pharmacy-purchase/components/purchase-actions";
import { PurchaseRecordForm, type PurchaseField } from "@/features/pharmacy-purchase/components/purchase-record-form";
import { PurchaseShell } from "@/features/pharmacy-purchase/components/purchase-shell";
import { initialGrns } from "@/features/pharmacy-purchase/data/purchase-data";
import type { GrnRecord, PurchaseMode } from "@/features/pharmacy-purchase/types";

const fields: PurchaseField<GrnRecord>[] = [
  { key: "grnNumber", label: "GRN Number", required: true },
  { key: "grnDate", label: "GRN Date", type: "date", required: true },
  { key: "poNumber", label: "PO Number", required: true },
  { key: "supplier", label: "Supplier", required: true },
  { key: "invoiceNumber", label: "Invoice Number" },
  { key: "invoiceDate", label: "Invoice Date", type: "date" },
  { key: "drug", label: "Drug", required: true },
  { key: "batchNumber", label: "Batch Number", required: true },
  { key: "manufacturingDate", label: "Manufacturing Date", type: "date" },
  { key: "expiryDate", label: "Expiry Date", type: "date" },
  { key: "receivedQuantity", label: "Received Quantity", type: "number" },
  { key: "freeQuantity", label: "Free Quantity", type: "number" },
  { key: "purchasePrice", label: "Purchase Price", type: "number" },
  { key: "mrp", label: "MRP", type: "number" },
];

const emptyRecord = (): GrnRecord => ({ id: `grn-${Date.now()}`, grnNumber: `GRN-${Date.now().toString().slice(-4)}`, grnDate: new Date().toISOString().slice(0, 10), poNumber: "", supplier: "", invoiceNumber: "", invoiceDate: "", drug: "", batchNumber: "", manufacturingDate: "", expiryDate: "", receivedQuantity: 0, freeQuantity: 0, purchasePrice: 0, mrp: 0, status: "Received" });

export function GoodsReceiptNotePage() {
  const [records, setRecords] = React.useState(initialGrns);
  const [search, setSearch] = React.useState("");
  const [mode, setMode] = React.useState<PurchaseMode>("create");
  const [draft, setDraft] = React.useState<GrnRecord>(emptyRecord);
  const [open, setOpen] = React.useState(false);

  const filtered = records.filter((record) => `${record.grnNumber} ${record.poNumber} ${record.supplier} ${record.drug} ${record.batchNumber}`.toLowerCase().includes(search.toLowerCase()));
  const columns = React.useMemo<ColumnDef<GrnRecord>[]>(() => [
    { header: "GRN Number", accessorKey: "grnNumber" },
    { header: "GRN Date", accessorKey: "grnDate" },
    { header: "PO Number", accessorKey: "poNumber" },
    { header: "Supplier", accessorKey: "supplier" },
    { header: "Invoice Number", accessorKey: "invoiceNumber" },
    { header: "Invoice Date", accessorKey: "invoiceDate" },
    { header: "Drug", accessorKey: "drug" },
    { header: "Batch Number", accessorKey: "batchNumber" },
    { header: "Mfg Date", accessorKey: "manufacturingDate" },
    { header: "Expiry Date", accessorKey: "expiryDate" },
    { header: "Received Qty", accessorKey: "receivedQuantity" },
    { header: "Free Qty", accessorKey: "freeQuantity" },
    { header: "Purchase Price", accessorKey: "purchasePrice" },
    { header: "MRP", accessorKey: "mrp" },
    { header: "Actions", cell: ({ row }) => <PurchaseActions canPrint onView={() => openRecord(row.original, "view")} onPrint={() => toast.success(`Print queued for ${row.original.grnNumber}`)} /> },
  ], []);

  function openRecord(record: GrnRecord, nextMode: PurchaseMode) { setDraft(record); setMode(nextMode); setOpen(true); }
  function save() { setRecords((current) => [draft, ...current]); toast.success("GRN saved and inventory stock increased automatically"); setOpen(false); }

  return (
    <PurchaseShell title="Goods Receipt Note (GRN)" icon={PackageCheck} onCreate={() => openRecord(emptyRecord(), "create")}>
      <AlertBanner icon={PackageCheck} tone="success" title="Inventory auto update">Saving GRN increases Current Stock and Batch Stock for the received batch.</AlertBanner>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search GRN, PO, supplier, drug, batch..." />
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "view" ? "View GRN" : "Create GRN"} submitLabel={mode === "view" ? "Close" : "Save GRN"} onSubmit={mode === "view" ? () => setOpen(false) : save}>
        <PurchaseRecordForm value={draft} fields={fields} readOnly={mode === "view"} onChange={setDraft} />
      </MasterDialog>
    </PurchaseShell>
  );
}
