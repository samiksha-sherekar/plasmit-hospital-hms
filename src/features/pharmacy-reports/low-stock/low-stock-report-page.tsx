"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Tags } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { ReportPageShell } from "@/features/pharmacy-reports/components/report-page-shell";
import { lowStockReportRecords } from "@/features/pharmacy-reports/data/report-data";
import type { LowStockReportRecord } from "@/features/pharmacy-reports/types";
import { includesReportText } from "@/features/pharmacy-reports/utils";

export function LowStockReportPage() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All categories");
  const [status, setStatus] = React.useState("All status");

  const categories = React.useMemo(() => ["All categories", ...Array.from(new Set(lowStockReportRecords.map((record) => record.category)))], []);
  const statuses = React.useMemo(() => ["All status", ...Array.from(new Set(lowStockReportRecords.map((record) => record.status)))], []);
  const filtered = lowStockReportRecords.filter((record) => {
    const text = `${record.drugName} ${record.category} ${record.currentQty} ${record.reorderLevel} ${record.shortfall} ${record.location} ${record.status}`;
    return includesReportText(text, search) && (category === "All categories" || record.category === category) && (status === "All status" || record.status === status);
  });

  const columns = React.useMemo<ColumnDef<LowStockReportRecord>[]>(() => [
    { header: "Drug name", accessorKey: "drugName" },
    { header: "Category", accessorKey: "category" },
    { header: "Current qty", accessorKey: "currentQty" },
    { header: "Reorder level", accessorKey: "reorderLevel" },
    // { header: "Shortfall", accessorKey: "shortfall" },
    { header: "Location", accessorKey: "location" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], []);

  return (
    <ReportPageShell title="Low Stock">
      <FilterBar search={search} onSearch={setSearch} placeholder="Search drug, category, location, status...">
        <NativeSelect label="Category" value={category} onChange={setCategory} options={categories} />
        <NativeSelect label="Status" value={status} onChange={setStatus} options={statuses} />
      </FilterBar>
      <DataTable data={filtered} columns={columns} />
    </ReportPageShell>
  );
}
