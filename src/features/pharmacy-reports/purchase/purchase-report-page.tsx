"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ReceiptText } from "lucide-react";

import { AlertBanner } from "@/components/ui/alert-banner";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { ReportPageShell } from "@/features/pharmacy-reports/components/report-page-shell";
import { purchaseReportRecords } from "@/features/pharmacy-reports/data/report-data";
import type { PurchaseReportRecord } from "@/features/pharmacy-reports/types";
import { formatCurrency, formatDate, includesReportText } from "@/features/pharmacy-reports/utils";

export function PurchaseReportPage() {
  const [search, setSearch] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [supplier, setSupplier] = React.useState("All suppliers");

  const suppliers = React.useMemo(() => ["All suppliers", ...Array.from(new Set(purchaseReportRecords.map((record) => record.supplier)))], []);
  const dateError = fromDate && toDate && toDate < fromDate ? "To date cannot be earlier than from date." : "";
  const filtered = dateError ? [] : purchaseReportRecords.filter((record) => {
    const text = `${record.poNumber} ${record.poDate} ${record.supplier} ${record.drug} ${record.qty} ${record.amount} ${record.grnDone} ${record.status}`;
    return includesReportText(text, search)
      && (!fromDate || record.poDate >= fromDate)
      && (!toDate || record.poDate <= toDate)
      && (supplier === "All suppliers" || record.supplier === supplier);
  });

  const columns = React.useMemo<ColumnDef<PurchaseReportRecord>[]>(() => [
    { header: "PO no.", accessorKey: "poNumber" },
    { header: "PO date", accessorFn: (row) => row.poDate, cell: ({ row }) => formatDate(row.original.poDate) },
    { header: "Supplier", accessorKey: "supplier" },
    { header: "Drug", accessorKey: "drug" },
    { header: "Qty", accessorKey: "qty" },
    { header: "Amount (₹)", accessorFn: (row) => row.amount, cell: ({ row }) => formatCurrency(row.original.amount) },
    { header: "GRN done", accessorKey: "grnDone" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], []);

  return (
    <ReportPageShell title="Purchase Report" icon={ReceiptText}>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search PO no., supplier, drug, status...">
        <label className="flex min-w-[150px] items-center gap-2 text-xs text-muted-foreground">
          <span className="sr-only">From date</span>
          <Input type="date" value={fromDate} max={toDate || undefined} onChange={(event) => setFromDate(event.target.value)} aria-label="From date" />
        </label>
        <label className="flex min-w-[150px] items-center gap-2 text-xs text-muted-foreground">
          <span className="sr-only">To date</span>
          <Input type="date" value={toDate} min={fromDate || undefined} onChange={(event) => setToDate(event.target.value)} aria-label="To date" aria-invalid={Boolean(dateError)} />
        </label>
        <NativeSelect label="Supplier" value={supplier} onChange={setSupplier} options={suppliers} />
      </FilterBar>
      {dateError ? <AlertBanner icon={ReceiptText} tone="danger" title="Invalid date range">{dateError}</AlertBanner> : null}
      <DataTable data={filtered} columns={columns} />
    </ReportPageShell>
  );
}
