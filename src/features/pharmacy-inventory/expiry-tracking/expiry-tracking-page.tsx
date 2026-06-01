"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Archive } from "lucide-react";

import { AlertBanner } from "@/components/ui/alert-banner";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { InventoryShell } from "@/features/pharmacy-inventory/components/inventory-shell";
import { initialExpiryTracking } from "@/features/pharmacy-inventory/data/inventory-data";
import type { ExpiryTrackingRecord } from "@/features/pharmacy-inventory/types";

export function ExpiryTrackingPage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const filtered = initialExpiryTracking.filter((record) => `${record.drug} ${record.batchNumber} ${record.location} ${record.status}`.toLowerCase().includes(search.toLowerCase()) && (status === "All status" || record.status === status));
  const columns = React.useMemo<ColumnDef<ExpiryTrackingRecord>[]>(() => [
    { header: "Drug", accessorKey: "drug" },
    { header: "Batch Number", accessorKey: "batchNumber" },
    { header: "Expiry Date", accessorKey: "expiryDate" },
    { header: "Days Remaining", accessorKey: "daysRemaining" },
    { header: "Current Stock", accessorKey: "currentStock" },
    { header: "Location", accessorKey: "location" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], []);
  return (
    <InventoryShell title="Expiry Tracking" icon={Archive}>
      <AlertBanner icon={Archive} tone="warning" title="Expiry alerts">Near-expiry and expired batches are highlighted for pharmacy review before dispensing.</AlertBanner>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search drug, batch, location..."><NativeSelect label="Status" value={status} onChange={setStatus} options={["All status", "Safe", "Near Expiry", "Expired"]} /></FilterBar>
      <DataTable data={filtered} columns={columns} />
    </InventoryShell>
  );
}
