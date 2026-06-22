"use client";

import * as React from "react";
import { Layers3 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FilterBar, NativeSelect } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { MasterPageShell } from "@/features/pharmacy-master/components/master-page-shell";
import { initialDrugCategories, initialDrugSubCategories } from "@/features/pharmacy-master/data/pharmacy-master-data";
import { SubCategoryForm } from "@/features/pharmacy-master/subcategories/subcategory-form";
import { SubCategoryTable } from "@/features/pharmacy-master/subcategories/subcategory-table";
import type { DrugSubCategory, MasterMode } from "@/features/pharmacy-master/types";
import { categoryName, includesText, makeId, toggleStatus, validateSubCategory } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

const emptySubCategory = (): DrugSubCategory => ({ id: makeId("sub"), categoryId: initialDrugCategories[0]?.id ?? "", subCategoryName: "", code: "", status: "Active", description: "" });

export function SubCategoryMasterPage() {
  const [records, setRecords] = React.useState(initialDrugSubCategories);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All categories");
  const [status, setStatus] = React.useState("All status");
  const [mode, setMode] = React.useState<MasterMode>("create");
  const [draft, setDraft] = React.useState<DrugSubCategory>(emptySubCategory);
  const [errors, setErrors] = React.useState<Partial<Record<keyof DrugSubCategory, string>>>({});
  const [open, setOpen] = React.useState(false);

  const filtered = records.filter((record) => {
    const parent = categoryName(initialDrugCategories, record.categoryId);
    const text = `${parent} ${record.subCategoryName} ${record.code} ${record.status} ${record.description}`;
    return includesText(text, search) && (category === "All categories" || parent === category) && (status === "All status" || record.status === status);
  });

  function openCreate() {
    setMode("create");
    setDraft(emptySubCategory());
    setErrors({});
    setOpen(true);
  }

  function openEdit(record: DrugSubCategory) {
    setMode("edit");
    setDraft({ ...record });
    setErrors({});
    setOpen(true);
  }

  function save() {
    const nextErrors = validateSubCategory(draft, records);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setRecords((current) => mode === "edit" ? current.map((record) => record.id === draft.id ? draft : record) : [draft, ...current]);
    toast.success(mode === "edit" ? "Sub category updated" : "Sub category created");
    setOpen(false);
  }

  function remove(record: DrugSubCategory) {
    setRecords((current) => current.filter((item) => item.id !== record.id));
    toast.success("Sub category deleted");
    setOpen(false);
  }

  return (
    <div className="space-y-6 mt-4">
        <FilterBar search={search} onSearch={setSearch} placeholder="Search category, subcategory, code, status, description...">
        <NativeSelect label="" value={category} onChange={setCategory} options={["All categories", ...initialDrugCategories.map((item) => item.categoryName)]} />
        <NativeSelect label="" value={status} onChange={setStatus} options={["All status", "Active", "Inactive"]} />
        <Button onClick={openCreate}><Layers3 className="h-4 w-4" />New subcategory</Button>
      </FilterBar>
      <SubCategoryTable records={filtered} categories={initialDrugCategories} onEdit={openEdit} onToggle={(record) => setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: toggleStatus(item.status) } : item))} onDelete={remove} />
      <MasterDialog open={open} onOpenChange={setOpen} title={mode === "edit" ? "Edit subcategory" : "New subcategory"} description="" submitLabel={mode === "edit" ? "Update subcategory" : "Create subcategory"} onSubmit={save} onDelete={mode === "edit" ? () => remove(draft) : undefined}>
        <SubCategoryForm value={draft} categories={initialDrugCategories} errors={errors} onChange={setDraft} />
      </MasterDialog>
    </div>
  );
}
