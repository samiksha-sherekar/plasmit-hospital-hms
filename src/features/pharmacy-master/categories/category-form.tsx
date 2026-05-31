"use client";

import type { DrugCategory } from "@/features/pharmacy-master/types";
import { FormGrid, SelectField, TextareaField, TextField } from "@/features/pharmacy-master/components/master-fields";

export function CategoryForm({
  value,
  errors,
  onChange,
}: {
  value: DrugCategory;
  errors: Partial<Record<keyof DrugCategory, string>>;
  onChange: (value: DrugCategory) => void;
}) {
  return (
    <div className="space-y-3">
      <FormGrid>
        <TextField label="Category Name" required value={value.categoryName} error={errors.categoryName} onChange={(categoryName) => onChange({ ...value, categoryName })} />
        <TextField label="Code" required value={value.code} error={errors.code} onChange={(code) => onChange({ ...value, code: code.toUpperCase() })} />
        <SelectField
          label="Status"
          required
          value={value.status}
          error={errors.status}
          onChange={(status) => onChange({ ...value, status: status as DrugCategory["status"] })}
          options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]}
        />
      </FormGrid>
      <TextareaField label="Description" value={value.description} error={errors.description} onChange={(description) => onChange({ ...value, description })} />
    </div>
  );
}

