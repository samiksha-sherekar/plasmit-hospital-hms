"use client";

import * as React from "react";
import { Factory, Layers3 } from "lucide-react";
import { toast } from "sonner";

import { FilterBar, NativeSelect } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { MasterPageShell } from "@/features/pharmacy-master/components/master-page-shell";
import { initialManufacturers } from "@/features/pharmacy-master/data/pharmacy-master-data";
import { ManufacturerForm } from "@/features/pharmacy-master/manufacturers/manufacturer-form";
import { ManufacturerTable } from "@/features/pharmacy-master/manufacturers/manufacturer-table";
import type { ManufacturerRecord, MasterMode } from "@/features/pharmacy-master/types";
import { includesText, makeId, toggleStatus, validateManufacturer } from "@/features/pharmacy-master/utils/pharmacy-master-utils";
import { Button } from "@/components/ui/button";

const emptyManufacturer = (): ManufacturerRecord => ({ id: makeId("mfg"), manufacturerName: "", code: "", contactPerson: "", phoneNumber: "", email: "", gstNumber: "", address: "", status: "Active" });

export function ManufacturerMasterPage() {
  const [records, setRecords] = React.useState(initialManufacturers);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [mode, setMode] = React.useState<MasterMode>("create");
  const [draft, setDraft] = React.useState<ManufacturerRecord>(emptyManufacturer);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ManufacturerRecord, string>>>({});
  const [open, setOpen] = React.useState(false);
  const filtered = records.filter((record) => includesText(`${record.manufacturerName} ${record.code} ${record.contactPerson} ${record.phoneNumber} ${record.email} ${record.gstNumber} ${record.address} ${record.status}`, search) && (status === "All status" || record.status === status));

  function openCreate() { setMode("create"); setDraft(emptyManufacturer()); setErrors({}); setOpen(true); }
  function openEdit(record: ManufacturerRecord) { setMode("edit"); setDraft(record); setErrors({}); setOpen(true); }
  function save() {
    const nextErrors = validateManufacturer(draft, records);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]);
    toast.success(mode === "edit" ? "Manufacturer updated" : "Manufacturer created");
    setOpen(false);
  }
  function remove(record: ManufacturerRecord) { setRecords((current) => current.filter((item) => item.id !== record.id)); toast.success("Manufacturer deleted"); setOpen(false); }

  return (
    <MasterPageShell title="Manufacturer Master" icon={Factory} actionLabel="New manufacturer" onCreate={openCreate} actions={<></>}>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search manufacturer, code, contact, phone, email, GST..."><NativeSelect label="" value={status} onChange={setStatus} options={["All status", "Active", "Inactive"]} /><Button onClick={openCreate}><Layers3 className="h-4 w-4" />New manufacturer</Button></FilterBar>
      <ManufacturerTable records={filtered} onEdit={openEdit} onToggle={(record) => setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: toggleStatus(item.status) } : item))} onDelete={remove} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "edit" ? "Edit manufacturer" : "New manufacturer"} submitLabel={mode === "edit" ? "Update manufacturer" : "Create manufacturer"} onSubmit={save} onDelete={mode === "edit" ? () => remove(draft) : undefined}>
        <ManufacturerForm value={draft} errors={errors} onChange={setDraft} />
      </MasterDialog>
    </MasterPageShell>
  );
}
