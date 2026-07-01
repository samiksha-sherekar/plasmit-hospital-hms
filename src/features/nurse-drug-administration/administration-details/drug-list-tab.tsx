"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";

import { AdministrationDrawer, type AdministrationActionType } from "./administration-drawer";
import type { MedicationAdministration, MedicationStatusFilter } from "./types";

type MedicationAction = "Administer" | "Manage" | "Review" | "Continue";

type MedicationRow = MedicationAdministration & {
  action: MedicationAction;
};

const statusOptions: Array<MedicationStatusFilter | "All"> = ["All", "Received", "Due", "Overdue", "Running", "Partially Administered", "Held", "Missed", "Refused", "Administered"];
const priorityOptions = ["All", "Routine", "Urgent", "Immediate", "Low", "Normal", "High"];
const categoryOptions = ["All", "Scheduled", "SOS", "STAT", "Bolus", "Diluent", "Intermittent", "Continuous", "Discontinued", "Unscheduled"];

function normalize(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

function getStatusLabel(row: MedicationAdministration) {
  if (row.orderStatus === "Pending") return "Pending";
  if (row.orderStatus === "Dispensed") return "Dispensed";
  if (row.orderStatus === "Returned") return "Returned";
  if (row.orderStatus === "Discontinued") return "Discontinued";
  if (row.status === "Running") return "Running";
  if (row.status === "Partial") return "Partially Administered";
  if (row.status === "Held") return "Held";
  if (row.status === "Missed") return "Missed";
  if (row.status === "Refused") return "Refused";
  if (row.status === "Administered") return "Administered";
  if (row.status === "Overdue") return "Overdue";
  if (row.status === "Due") return "Due";
  return row.orderStatus === "Received" ? "Received" : "Due";
}

function getAction(status: string): MedicationAction {
  if (status === "Due" || status === "Overdue") return "Administer";
  if (status === "Running") return "Manage";
  if (status === "Held" || status === "Missed" || status === "Refused") return "Review";
  if (status === "Partially Administered") return "Continue";
  return "Administer";
}

function getDrawerActionType(status: string): AdministrationActionType {
  if (status === "Due" || status === "Overdue") return "administer";
  if (status === "Running") return "manage";
  if (status === "Held" || status === "Missed" || status === "Refused") return "review";
  if (status === "Partially Administered") return "continue";
  return "administer";
}
function getNextDue(row: MedicationAdministration) {
  return row.nextDueTime || row.timeline[0]?.time || "-";
}

function toRows(orders: MedicationAdministration[]): MedicationRow[] {
  return orders
    .filter((row) => {
      const statusLabel = getStatusLabel(row);
      return !["Pending", "Dispensed", "Returned", "Discontinued"].includes(statusLabel);
    })
    .map((row) => ({
      ...row,
      action: getAction(getStatusLabel(row)),
    }));
}

export function MedicationListTab({ orders, onAdminister }: { orders: MedicationAdministration[]; onAdminister: (order: MedicationAdministration) => void }) {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<(typeof categoryOptions)[number]>("All");
  const [status, setStatus] = React.useState<(typeof statusOptions)[number]>("All");
  const [priority, setPriority] = React.useState<(typeof priorityOptions)[number]>("All");
  const [date, setDate] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedMedication, setSelectedMedication] = React.useState<MedicationAdministration | null>(null);
  const [actionType, setActionType] = React.useState<AdministrationActionType | null>(null);

  const rows = React.useMemo(() => {
    return toRows(orders).filter((row) => {
      const statusLabel = getStatusLabel(row);
      const q = normalize(search);
      if (q && ![row.drugName, row.category, row.frequency, getNextDue(row), row.priority, statusLabel].some((value) => normalize(value).includes(q))) return false;
      if (category !== "All" && row.category !== category) return false;
      if (priority !== "All" && row.priority !== priority) return false;
      if (status !== "All" && statusLabel !== status) return false;
      if (date && !normalize(row.orderDate).includes(normalize(date))) return false;
      return true;
    });
  }, [orders, search, category, status, priority, date]);

  const openDrawer = (medication: MedicationAdministration) => {
    const statusLabel = getStatusLabel(medication);
    setSelectedMedication(medication);
    setActionType(getDrawerActionType(statusLabel));
    setDrawerOpen(true);
  };

  const columns = React.useMemo<ColumnDef<MedicationRow>[]>(
    () => [
      { accessorKey: "drugName", header: "Drug" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "frequency", header: "Frequency" },
      { accessorKey: "nextDueTime", header: "Next Due", cell: ({ row }) => getNextDue(row.original) },
      { accessorKey: "priority", header: "Priority", cell: ({ row }) => <Badge tone={row.original.priority === "Urgent" || row.original.priority === "High" ? "danger" : row.original.priority === "Immediate" ? "warning" : "muted"}>{row.original.priority}</Badge> },
      { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge tone={row.original.status === "Administered" ? "success" : row.original.status === "Overdue" ? "danger" : row.original.status === "Due" ? "warning" : "muted"}>{getStatusLabel(row.original)}</Badge> },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Button size="sm" onClick={() => openDrawer(row.original)}>{row.original.action}</Button>,
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-xl border border-border bg-white p-4 shadow-soft">
        <div className="text-base font-semibold text-foreground">Medication List</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Input placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="h-10 rounded-md border border-input px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
            {categoryOptions.map((option) => <option key={option} value={option}>{option === "All" ? "Category Filter" : option}</option>)}
          </select>
          <select className="h-10 rounded-md border border-input px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
            {statusOptions.map((option) => <option key={option} value={option}>{option === "All" ? "Status Filter" : option}</option>)}
          </select>
          <select className="h-10 rounded-md border border-input px-3 text-sm" value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)}>
            {priorityOptions.map((option) => <option key={option} value={option}>{option === "All" ? "Priority Filter" : option}</option>)}
          </select>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
      </div>
      <DataTable columns={columns} data={rows} />
      {!rows.length ? <div className="rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted-foreground">No medications match the selected filters.</div> : null}

      <AdministrationDrawer open={drawerOpen} onOpenChange={setDrawerOpen} selectedMedication={selectedMedication} actionType={actionType} />
    </div>
  );
}




