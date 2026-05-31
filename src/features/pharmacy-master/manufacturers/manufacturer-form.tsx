"use client";

import { FormGrid, SelectField, TextareaField, TextField } from "@/features/pharmacy-master/components/master-fields";
import type { ManufacturerRecord } from "@/features/pharmacy-master/types";

export function ManufacturerForm({ value, errors, onChange }: { value: ManufacturerRecord; errors: Partial<Record<keyof ManufacturerRecord, string>>; onChange: (value: ManufacturerRecord) => void }) {
  return (
    <div className="space-y-3">
      <FormGrid>
        <TextField label="Manufacturer Name" required value={value.manufacturerName} error={errors.manufacturerName} onChange={(manufacturerName) => onChange({ ...value, manufacturerName })} />
        <TextField label="Code" value={value.code} error={errors.code} onChange={(code) => onChange({ ...value, code: code.toUpperCase() })} />
        <TextField label="Contact Person" value={value.contactPerson} error={errors.contactPerson} onChange={(contactPerson) => onChange({ ...value, contactPerson })} />
        <TextField label="Phone Number" value={value.phoneNumber} error={errors.phoneNumber} onChange={(phoneNumber) => onChange({ ...value, phoneNumber })} />
        <TextField label="Email" value={value.email} error={errors.email} onChange={(email) => onChange({ ...value, email })} />
        <TextField label="GST Number" value={value.gstNumber} error={errors.gstNumber} onChange={(gstNumber) => onChange({ ...value, gstNumber: gstNumber.toUpperCase() })} />
        <SelectField label="Status" required value={value.status} error={errors.status} onChange={(status) => onChange({ ...value, status: status as ManufacturerRecord["status"] })} options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} />
      </FormGrid>
      <TextareaField label="Address" value={value.address} error={errors.address} onChange={(address) => onChange({ ...value, address })} />
    </div>
  );
}

