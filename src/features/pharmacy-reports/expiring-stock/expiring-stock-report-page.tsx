"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Archive } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect } from "@/features/admin/admin-shared";
import { ReportPageShell } from "@/features/pharmacy-reports/components/report-page-shell";
import { expiringStockReportRecords } from "@/features/pharmacy-reports/data/report-data";
import type { ExpiringStockReportRecord } from "@/features/pharmacy-reports/types";
import { formatCurrency, formatDate, includesReportText } from "@/features/pharmacy-reports/utils";

const expiryWindows = ["All windows", "Within 30 days", "Within 60 days", "Within 90 days"];

export function ExpiringStockReportPage() {
  const [search, setSearch] = React.useState("");
  const [expiryWindow, setExpiryWindow] = React.useState("All windows");

  const filtered = expiringStockReportRecords.filter((record) => {
    const text = `${record.drugName} ${record.batchNo} ${record.expiryDate} ${record.daysLeft} ${record.qty} ${record.mrp} ${record.alert}`;
    return includesReportText(text, search) && (expiryWindow === "All windows" || record.alert === expiryWindow);
  });

  const columns = React.useMemo<ColumnDef<ExpiringStockReportRecord>[]>(() => [
    { header: "Drug name", accessorKey: "drugName" },
    { header: "Batch no.", accessorKey: "batchNo" },
    { header: "Expiry date", accessorFn: (row) => row.expiryDate, cell: ({ row }) => formatDate(row.original.expiryDate) },
    { header: "Days left", accessorKey: "daysLeft" },
    { header: "Qty", accessorKey: "qty" },
    { header: "MRP (₹)", accessorFn: (row) => row.mrp, cell: ({ row }) => formatCurrency(row.original.mrp) },
    { header: "Alert", cell: ({ row }) => <Badge tone={row.original.alert === "Within 30 days" ? "danger" : row.original.alert === "Within 60 days" ? "warning" : "info"}>{row.original.alert}</Badge> },
  ], []);

  return (
    <div className="space-y-4 mt-4">
      <FilterBar search={search} onSearch={setSearch} placeholder="Search drug, batch, expiry date, alert...">
        <NativeSelect label="" value={expiryWindow} onChange={setExpiryWindow} options={expiryWindows} />
      </FilterBar>
      <DataTable data={filtered} columns={columns} />
    </div>
  );
}
