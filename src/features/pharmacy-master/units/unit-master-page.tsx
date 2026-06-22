"use client";

import * as React from "react";
import { Layers3 } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { MasterPageShell } from "@/features/pharmacy-master/components/master-page-shell";
import { MasterRowActions } from "@/features/pharmacy-master/components/master-row-actions";
import { initialUnits } from "@/features/pharmacy-master/data/pharmacy-master-data";
import { UnitForm } from "@/features/pharmacy-master/units/unit-form";
import type { MasterMode, UnitRecord } from "@/features/pharmacy-master/types";
import { includesText, makeId, toggleStatus, validateUnit } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

const emptyUnit = (): UnitRecord => ({ id: makeId("unit"), unitName: "", unitCode: "", description: "", status: "Active" });

export function UnitMasterPage() {
  const [records, setRecords] = React.useState(initialUnits);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [mode, setMode] = React.useState<MasterMode>("create");
  const [draft, setDraft] = React.useState<UnitRecord>(emptyUnit);
  const [errors, setErrors] = React.useState<Partial<Record<keyof UnitRecord, string>>>({});
  const [open, setOpen] = React.useState(false);
  const filtered = records.filter((record) => includesText(`${record.unitName} ${record.unitCode} ${record.description} ${record.status}`, search) && (status === "All status" || record.status === status));
  const columns = React.useMemo<ColumnDef<UnitRecord>[]>(() => [
    { header: "Unit Name", accessorKey: "unitName" },
    { header: "Unit Code", accessorKey: "unitCode" },
    { header: "Description", accessorKey: "description" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Actions", cell: ({ row }) => <MasterRowActions onEdit={() => openEdit(row.original)} onToggle={() => setRecords((current) => current.map((item) => item.id === row.original.id ? { ...item, status: toggleStatus(item.status) } : item))} onDelete={() => remove(row.original)} /> },
  ], []);

  function openCreate() { setMode("create"); setDraft(emptyUnit()); setErrors({}); setOpen(true); }
  function openEdit(record: UnitRecord) { setMode("edit"); setDraft(record); setErrors({}); setOpen(true); }
  function save() { const nextErrors = validateUnit(draft, records); setErrors(nextErrors); if (Object.keys(nextErrors).length) return; setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]); toast.success(mode === "edit" ? "Unit updated" : "Unit created"); setOpen(false); }
  function remove(record: UnitRecord) { setRecords((current) => current.filter((item) => item.id !== record.id)); toast.success("Unit deleted"); setOpen(false); }

  return (
    <div className="space-y-6 mt-4">      <FilterBar search={search} onSearch={setSearch} placeholder="Search unit, code, description..."><NativeSelect label="" value={status} onChange={setStatus} options={["All status", "Active", "Inactive"]} /><Button onClick={openCreate}><Layers3 className="h-4 w-4" />New unit</Button></FilterBar>
      <DataTable data={filtered} columns={columns} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "edit" ? "Edit unit" : "New unit"} submitLabel={mode === "edit" ? "Update unit" : "Create unit"} onSubmit={save} onDelete={mode === "edit" ? () => remove(draft) : undefined}><UnitForm value={draft} errors={errors} onChange={setDraft} /></MasterDialog>
    </div>
  );
}
