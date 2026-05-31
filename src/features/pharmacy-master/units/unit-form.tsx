"use client";

import { FormGrid, SelectField, TextareaField, TextField } from "@/features/pharmacy-master/components/master-fields";
import type { UnitRecord } from "@/features/pharmacy-master/types";

export function UnitForm({ value, errors, onChange }: { value: UnitRecord; errors: Partial<Record<keyof UnitRecord, string>>; onChange: (value: UnitRecord) => void }) {
  return (
    <div className="space-y-3">
      <FormGrid>
        <TextField label="Unit Name" required value={value.unitName} error={errors.unitName} onChange={(unitName) => onChange({ ...value, unitName })} />
        <TextField label="Unit Code" value={value.unitCode} error={errors.unitCode} onChange={(unitCode) => onChange({ ...value, unitCode: unitCode.toUpperCase() })} />
        <SelectField label="Status" required value={value.status} error={errors.status} onChange={(status) => onChange({ ...value, status: status as UnitRecord["status"] })} options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} />
      </FormGrid>
      <TextareaField label="Description" value={value.description} error={errors.description} onChange={(description) => onChange({ ...value, description })} />
    </div>
  );
}

