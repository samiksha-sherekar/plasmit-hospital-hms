"use client";

import * as React from "react";
import { MapPinned } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { MasterPageShell } from "@/features/pharmacy-master/components/master-page-shell";
import { MasterRowActions } from "@/features/pharmacy-master/components/master-row-actions";
import { initialRackStoreLocations } from "@/features/pharmacy-master/data/pharmacy-master-data";
import { RackStoreLocationForm } from "@/features/pharmacy-master/locations/rack-store-location-form";
import type { MasterMode, RackStoreLocationRecord } from "@/features/pharmacy-master/types";
import { includesText, makeId, toggleStatus, validateRackStoreLocation } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

const emptyLocation = (): RackStoreLocationRecord => ({ id: makeId("loc"), locationName: "", storeName: "", rackNumber: "", shelfNumber: "", description: "", status: "Active" });

export function RackStoreLocationPage() {
  const [records, setRecords] = React.useState(initialRackStoreLocations);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [mode, setMode] = React.useState<MasterMode>("create");
  const [draft, setDraft] = React.useState<RackStoreLocationRecord>(emptyLocation);
  const [errors, setErrors] = React.useState<Partial<Record<keyof RackStoreLocationRecord, string>>>({});
  const [open, setOpen] = React.useState(false);
  const filtered = records.filter((record) => includesText(`${record.locationName} ${record.storeName} ${record.rackNumber} ${record.shelfNumber} ${record.description} ${record.status}`, search) && (status === "All status" || record.status === status));
  const columns = React.useMemo<ColumnDef<RackStoreLocationRecord>[]>(() => [
    { header: "Location Name", accessorKey: "locationName" },
    { header: "Store Name", accessorKey: "storeName" },
    { header: "Rack Number", accessorKey: "rackNumber" },
    { header: "Shelf Number", accessorKey: "shelfNumber" },
    { header: "Description", accessorKey: "description" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Actions", cell: ({ row }) => <MasterRowActions onEdit={() => openEdit(row.original)} onToggle={() => setRecords((current) => current.map((item) => item.id === row.original.id ? { ...item, status: toggleStatus(item.status) } : item))} onDelete={() => remove(row.original)} /> },
  ], [openEdit, remove]);

  function openCreate() { setMode("create"); setDraft(emptyLocation()); setErrors({}); setOpen(true); }
  function openEdit(record: RackStoreLocationRecord) { setMode("edit"); setDraft({ ...record }); setErrors({}); setOpen(true); }
  function save() { const nextErrors = validateRackStoreLocation(draft, records); setErrors(nextErrors); if (Object.keys(nextErrors).length) return; setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]); toast.success(mode === "edit" ? "Location updated" : "Location created"); setOpen(false); }
  function remove(record: RackStoreLocationRecord) { setRecords((current) => current.filter((item) => item.id !== record.id)); toast.success("Location deleted"); setOpen(false); }

  return (
    <div className="space-y-6 mt-4">      
      <FilterBar search={search} onSearch={setSearch} placeholder="Search location, store, rack, shelf..."><NativeSelect label="" value={status} onChange={setStatus} options={["All status", "Active", "Inactive"]} /><Button onClick={openCreate}><MapPinned className="h-4 w-4" />New location</Button></FilterBar>
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "edit" ? "Edit location" : "New location"} submitLabel={mode === "edit" ? "Update location" : "Create location"} onSubmit={save} onDelete={mode === "edit" ? () => remove(draft) : undefined}><RackStoreLocationForm value={draft} errors={errors} onChange={setDraft} /></MasterDialog>
    </div>
  );
}
