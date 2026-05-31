"use client";

import type { SupplierRecord } from "@/features/pharmacy-master/types";
import { FormGrid, SelectField, TextareaField, TextField } from "@/features/pharmacy-master/components/master-fields";

export function SupplierForm({
  value,
  errors,
  onChange,
}: {
  value: SupplierRecord;
  errors: Partial<Record<keyof SupplierRecord, string>>;
  onChange: (value: SupplierRecord) => void;
}) {
  return (
    <div className="space-y-3">
      <FormGrid>
        <TextField label="Supplier Name" required value={value.supplierName} error={errors.supplierName} onChange={(supplierName) => onChange({ ...value, supplierName })} />
        <TextField label="Contact Person" required value={value.contactPerson} error={errors.contactPerson} onChange={(contactPerson) => onChange({ ...value, contactPerson })} />
        <TextField label="Phone" required value={value.phone} error={errors.phone} onChange={(phone) => onChange({ ...value, phone })} />
        <TextField label="Email" value={value.email} error={errors.email} onChange={(email) => onChange({ ...value, email })} />
        <TextField label="GST Number" required value={value.gstNumber} error={errors.gstNumber} onChange={(gstNumber) => onChange({ ...value, gstNumber: gstNumber.toUpperCase() })} />
        <TextField label="Payment Terms" required value={value.paymentTerms} error={errors.paymentTerms} onChange={(paymentTerms) => onChange({ ...value, paymentTerms })} />
        <SelectField label="Status" required value={value.status} error={errors.status} onChange={(status) => onChange({ ...value, status: status as SupplierRecord["status"] })} options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} />
      </FormGrid>
      <TextareaField label="Address" value={value.address} error={errors.address} onChange={(address) => onChange({ ...value, address })} />
    </div>
  );
}

