"use client";

import * as React from "react";
import { Truck } from "lucide-react";
import { toast } from "sonner";

import { FilterBar, NativeSelect } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { MasterPageShell } from "@/features/pharmacy-master/components/master-page-shell";
import { initialSuppliers } from "@/features/pharmacy-master/data/pharmacy-master-data";
import { SupplierForm } from "@/features/pharmacy-master/suppliers/supplier-form";
import { SupplierTable } from "@/features/pharmacy-master/suppliers/supplier-table";
import type { MasterMode, SupplierRecord } from "@/features/pharmacy-master/types";
import { includesText, makeId, toggleStatus, validateSupplier } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

const emptySupplier = (): SupplierRecord => ({
  id: makeId("sup"),
  supplierName: "",
  contactPerson: "",
  phone: "",
  email: "",
  gstNumber: "",
  address: "",
  paymentTerms: "",
  status: "Active",
});

export function SupplierMasterPage() {
  const [records, setRecords] = React.useState(initialSuppliers);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [mode, setMode] = React.useState<MasterMode>("create");
  const [draft, setDraft] = React.useState<SupplierRecord>(emptySupplier);
  const [errors, setErrors] = React.useState<Partial<Record<keyof SupplierRecord, string>>>({});
  const [open, setOpen] = React.useState(false);

  const filtered = records.filter((record) => {
    const text = `${record.supplierName} ${record.contactPerson} ${record.phone} ${record.email} ${record.gstNumber} ${record.address} ${record.paymentTerms} ${record.status}`;
    return includesText(text, search) && (status === "All status" || record.status === status);
  });

  function openCreate() {
    setMode("create");
    setDraft(emptySupplier());
    setErrors({});
    setOpen(true);
  }

  function openEdit(record: SupplierRecord) {
    setMode("edit");
    setDraft(record);
    setErrors({});
    setOpen(true);
  }

  function save() {
    const nextErrors = validateSupplier(draft, records);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]);
    toast.success(mode === "edit" ? "Supplier updated" : "Supplier created");
    setOpen(false);
  }

  function remove(record: SupplierRecord) {
    setRecords((current) => current.filter((item) => item.id !== record.id));
    toast.success("Supplier deleted");
    setOpen(false);
  }

  return (
    <MasterPageShell title="Supplier Master" description="CRUD for supplier records with contact, GST, payment terms, and Active/Inactive control." icon={Truck} actionLabel="New supplier" onCreate={openCreate}>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search supplier, contact, phone, email, GST, terms...">
        <NativeSelect label="Status" value={status} onChange={setStatus} options={["All status", "Active", "Inactive"]} />
      </FilterBar>
      <SupplierTable records={filtered} onEdit={openEdit} onToggle={(record) => setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: toggleStatus(item.status) } : item))} onDelete={remove} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "edit" ? "Edit supplier" : "New supplier"} description="Supplier Name, Contact Person, Phone, Email, GST Number, Address, Payment Terms, and Status" submitLabel={mode === "edit" ? "Update supplier" : "Create supplier"} onSubmit={save} onDelete={mode === "edit" ? () => remove(draft) : undefined}>
        <SupplierForm value={draft} errors={errors} onChange={setDraft} />
      </MasterDialog>
    </MasterPageShell>
  );
}
