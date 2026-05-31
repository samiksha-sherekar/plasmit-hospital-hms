"use client";

import * as React from "react";
import { Pill } from "lucide-react";
import { toast } from "sonner";

import { FilterBar, NativeSelect } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { MasterPageShell } from "@/features/pharmacy-master/components/master-page-shell";
import { initialDrugCategories, initialDrugMasterRecords, initialDrugSubCategories, initialManufacturers } from "@/features/pharmacy-master/data/pharmacy-master-data";
import { DrugForm } from "@/features/pharmacy-master/drug-master/drug-form";
import { DrugTable } from "@/features/pharmacy-master/drug-master/drug-table";
import type { DrugMasterRecord, MasterMode } from "@/features/pharmacy-master/types";
import { categoryName, includesText, makeId, subCategoriesForCategory, subCategoryName, toggleStatus, validateDrug } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

const firstCategory = initialDrugCategories.find((category) => category.status === "Active") ?? initialDrugCategories[0];
const firstSubCategory = subCategoriesForCategory(initialDrugSubCategories, firstCategory?.id ?? "")[0] ?? initialDrugSubCategories[0];
const firstManufacturer = initialManufacturers.find((manufacturer) => manufacturer.status === "Active") ?? initialManufacturers[0];

const emptyDrug = (): DrugMasterRecord => ({
  id: makeId("drug"),
  drugName: "",
  genericName: "",
  brandName: "",
  categoryId: firstCategory?.id ?? "",
  subCategoryId: firstSubCategory?.id ?? "",
  manufacturer: firstManufacturer?.manufacturerName ?? "",
  form: "Tablet",
  strength: "",
  unit: "mg",
  route: "Oral",
  hsnCode: "",
  gstPercent: 0,
  reorderLevel: 0,
  minimumStock: 0,
  maximumStock: 0,
  storageCondition: "Room Temperature",
  prescriptionRequired: "Yes",
  status: "Active",
});

export function DrugMasterPage() {
  const [records, setRecords] = React.useState(initialDrugMasterRecords);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All categories");
  const [status, setStatus] = React.useState("All status");
  const [mode, setMode] = React.useState<MasterMode>("create");
  const [draft, setDraft] = React.useState<DrugMasterRecord>(emptyDrug);
  const [errors, setErrors] = React.useState<Partial<Record<keyof DrugMasterRecord, string>>>({});
  const [open, setOpen] = React.useState(false);

  const filtered = records.filter((record) => {
    const parent = categoryName(initialDrugCategories, record.categoryId);
    const child = subCategoryName(initialDrugSubCategories, record.subCategoryId);
    const text = `${record.drugName} ${record.genericName} ${record.brandName} ${parent} ${child} ${record.manufacturer} ${record.form} ${record.strength} ${record.unit} ${record.route} ${record.hsnCode} ${record.status}`;
    return includesText(text, search) && (category === "All categories" || parent === category) && (status === "All status" || record.status === status);
  });

  function openCreate() {
    setMode("create");
    setDraft(emptyDrug());
    setErrors({});
    setOpen(true);
  }

  function openEdit(record: DrugMasterRecord) {
    setMode("edit");
    setDraft(record);
    setErrors({});
    setOpen(true);
  }

  function openClone(record: DrugMasterRecord) {
    setMode("clone");
    setDraft({ ...record, id: makeId("drug"), drugName: `${record.drugName} Copy`, status: "Active" });
    setErrors({});
    setOpen(true);
  }

  function save() {
    const nextErrors = validateDrug(draft, records);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]);
    toast.success(mode === "edit" ? "Drug updated" : mode === "clone" ? "Drug cloned" : "Drug created");
    setOpen(false);
  }

  function remove(record: DrugMasterRecord) {
    setRecords((current) => current.filter((item) => item.id !== record.id));
    toast.success("Drug deleted");
    setOpen(false);
  }

  return (
    <MasterPageShell title="Drug Master" breadcrumbTitle="Drug Master" description="CRUD, clone, Active/Inactive, and dependent Category/Sub Category mapping for pharmacy drugs." icon={Pill} actionLabel="New drug" onCreate={openCreate}>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search drug, generic, category, form, route, status...">
        <NativeSelect label="Category" value={category} onChange={setCategory} options={["All categories", ...initialDrugCategories.map((item) => item.categoryName)]} />
        <NativeSelect label="Status" value={status} onChange={setStatus} options={["All status", "Active", "Inactive"]} />
      </FilterBar>
      <DrugTable records={filtered} categories={initialDrugCategories} subCategories={initialDrugSubCategories} onEdit={openEdit} onClone={openClone} onToggle={(record) => setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: toggleStatus(item.status) } : item))} onDelete={remove} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "edit" ? "Edit drug" : mode === "clone" ? "Clone drug" : "New drug"} submitLabel={mode === "edit" ? "Update drug" : mode === "clone" ? "Save clone" : "Create drug"} onSubmit={save} onDelete={mode === "edit" ? () => remove(draft) : undefined}>
        <DrugForm value={draft} categories={initialDrugCategories} subCategories={initialDrugSubCategories} manufacturers={initialManufacturers} errors={errors} onChange={setDraft} />
      </MasterDialog>
    </MasterPageShell>
  );
}
