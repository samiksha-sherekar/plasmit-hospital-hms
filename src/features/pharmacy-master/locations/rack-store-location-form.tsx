"use client";

import { FormGrid, SelectField, TextareaField, TextField } from "@/features/pharmacy-master/components/master-fields";
import type { RackStoreLocationRecord } from "@/features/pharmacy-master/types";

export function RackStoreLocationForm({ value, errors, onChange }: { value: RackStoreLocationRecord; errors: Partial<Record<keyof RackStoreLocationRecord, string>>; onChange: (value: RackStoreLocationRecord) => void }) {
  return (
    <div className="space-y-3">
      <FormGrid>
        <TextField label="Location Name" required value={value.locationName} error={errors.locationName} onChange={(locationName) => onChange({ ...value, locationName })} />
        <TextField label="Store Name" required value={value.storeName} error={errors.storeName} onChange={(storeName) => onChange({ ...value, storeName })} />
        <TextField label="Rack Number" value={value.rackNumber} error={errors.rackNumber} onChange={(rackNumber) => onChange({ ...value, rackNumber })} />
        <TextField label="Shelf Number" value={value.shelfNumber} error={errors.shelfNumber} onChange={(shelfNumber) => onChange({ ...value, shelfNumber })} />
        <SelectField label="Status" required value={value.status} error={errors.status} onChange={(status) => onChange({ ...value, status: status as RackStoreLocationRecord["status"] })} options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} />
      </FormGrid>
      <TextareaField label="Description" value={value.description} error={errors.description} onChange={(description) => onChange({ ...value, description })} />
    </div>
  );
}

