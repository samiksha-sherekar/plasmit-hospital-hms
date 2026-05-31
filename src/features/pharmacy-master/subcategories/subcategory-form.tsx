"use client";

import type { DrugCategory, DrugSubCategory } from "@/features/pharmacy-master/types";
import { FormGrid, SelectField, TextareaField, TextField } from "@/features/pharmacy-master/components/master-fields";

export function SubCategoryForm({
  value,
  categories,
  errors,
  onChange,
}: {
  value: DrugSubCategory;
  categories: DrugCategory[];
  errors: Partial<Record<keyof DrugSubCategory, string>>;
  onChange: (value: DrugSubCategory) => void;
}) {
  return (
    <div className="space-y-3">
      <FormGrid>
        <SelectField label="Category" required value={value.categoryId} error={errors.categoryId} onChange={(categoryId) => onChange({ ...value, categoryId })} options={categories.map((category) => ({ label: category.categoryName, value: category.id }))} />
        <TextField label="Sub Category Name" required value={value.subCategoryName} error={errors.subCategoryName} onChange={(subCategoryName) => onChange({ ...value, subCategoryName })} />
        <TextField label="Code" required value={value.code} error={errors.code} onChange={(code) => onChange({ ...value, code: code.toUpperCase() })} />
        <SelectField label="Status" required value={value.status} error={errors.status} onChange={(status) => onChange({ ...value, status: status as DrugSubCategory["status"] })} options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} />
      </FormGrid>
      <TextareaField label="Description" value={value.description} error={errors.description} onChange={(description) => onChange({ ...value, description })} />
    </div>
  );
}

