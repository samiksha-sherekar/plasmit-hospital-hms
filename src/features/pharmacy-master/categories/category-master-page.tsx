"use client";

import * as React from "react";
import { Tags } from "lucide-react";
import { toast } from "sonner";

import { FilterBar, NativeSelect } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { MasterPageShell } from "@/features/pharmacy-master/components/master-page-shell";
import { initialDrugCategories } from "@/features/pharmacy-master/data/pharmacy-master-data";
import { CategoryForm } from "@/features/pharmacy-master/categories/category-form";
import { CategoryTable } from "@/features/pharmacy-master/categories/category-table";
import type { DrugCategory, MasterMode } from "@/features/pharmacy-master/types";
import { includesText, makeId, toggleStatus, validateCategory } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

const emptyCategory = (): DrugCategory => ({ id: makeId("cat"), categoryName: "", code: "", status: "Active", description: "" });

export function CategoryMasterPage() {
  const [records, setRecords] = React.useState(initialDrugCategories);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [mode, setMode] = React.useState<MasterMode>("create");
  const [draft, setDraft] = React.useState<DrugCategory>(emptyCategory);
  const [errors, setErrors] = React.useState<Partial<Record<keyof DrugCategory, string>>>({});
  const [open, setOpen] = React.useState(false);

  const filtered = records.filter((record) => {
    const text = `${record.categoryName} ${record.code} ${record.status} ${record.description}`;
    return includesText(text, search) && (status === "All status" || record.status === status);
  });

  function openCreate() {
    setMode("create");
    setDraft(emptyCategory());
    setErrors({});
    setOpen(true);
  }

  function openEdit(record: DrugCategory) {
    setMode("edit");
    setDraft({ ...record });
    setErrors({});
    setOpen(true);
  }

  function save() {
    const nextErrors = validateCategory(draft, records);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]);
    toast.success(mode === "edit" ? "Category updated" : "Category created");
    setOpen(false);
  }

  function remove(record: DrugCategory) {
    setRecords((current) => current.filter((item) => item.id !== record.id));
    toast.success("Category deleted");
    setOpen(false);
  }

  return (
    <MasterPageShell title="Category Master" description="CRUD for pharmacy medicine categories with Active/Inactive control." icon={Tags} actionLabel="New category" onCreate={openCreate}>
      <FilterBar search={search} onSearch={setSearch} placeholder="Search category name, code, status, description...">
        <NativeSelect label="Status" value={status} onChange={setStatus} options={["All status", "Active", "Inactive"]} />
      </FilterBar>
      <CategoryTable records={filtered} onEdit={openEdit} onToggle={(record) => setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: toggleStatus(item.status) } : item))} onDelete={remove} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "edit" ? "Edit category" : "New category"} description="Category Name, Code, Status, and Description" submitLabel={mode === "edit" ? "Update category" : "Create category"} onSubmit={save} onDelete={mode === "edit" ? () => remove(draft) : undefined}>
        <CategoryForm value={draft} errors={errors} onChange={setDraft} />
      </MasterDialog>
    </MasterPageShell>
  );
}
