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

const staticAdministrations: AdministrationLogRow[] = [
  {
    id: "adm-001",
    administrationDate: "2026-06-29",
    scheduledTime: "08:00",
    actualTime: "2026-06-29 08:10",
    doseGiven: "500 mg",
    status: "Administered",
    nurse: "Nurse A",
    remarks: "Completed as scheduled.",
  },
  {
    id: "adm-002",
    administrationDate: "2026-06-29",
    scheduledTime: "14:00",
    actualTime: "2026-06-29 14:25",
    doseGiven: "500 mg",
    status: "Late administered",
    nurse: "Nurse B",
    remarks: "Delay due to patient rounding.",
  },
  {
    id: "adm-003",
    administrationDate: "2026-06-30",
    scheduledTime: "20:00",
    actualTime: "-",
    doseGiven: "500 mg",
    status: "Not administered",
    nurse: "-",
    remarks: "Pending shift handover.",
  },
];

export function AdministrationHistoryTab({ order }: { order: NurseOrderDetailsModel }) {
  if (!staticAdministrations.length) {
    return <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">No administration history available.</div>;
  }

  return <DataTable columns={columns} data={staticAdministrations} />;
}