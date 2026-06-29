"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";

import type { NurseOrderDetailsModel } from "./types";

type AdministrationLogRow = NurseOrderDetailsModel["administrations"][number];

const columns: ColumnDef<AdministrationLogRow>[] = [
  { accessorKey: "administrationDate", header: "Administration Date" },
  { accessorKey: "scheduledTime", header: "Scheduled Time" },
  { accessorKey: "actualTime", header: "Actual Time" },
  { accessorKey: "doseGiven", header: "Dose Given" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "nurse", header: "Nurse" },
  { accessorKey: "remarks", header: "Remarks" },
];

export function AdministrationHistoryTab({ order }: { order: NurseOrderDetailsModel }) {
  if (!order.administrations.length) {
    return <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">No administration history available.</div>;
  }

  return <DataTable columns={columns} data={order.administrations} />;
}
