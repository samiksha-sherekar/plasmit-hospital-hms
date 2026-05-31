"use client";

import * as React from "react";

import { FormGrid, SelectField, TextField } from "@/features/pharmacy-master/components/master-fields";
import type { DrugCategory, DrugMasterRecord, DrugSubCategory, ManufacturerRecord } from "@/features/pharmacy-master/types";
import { subCategoriesForCategory } from "@/features/pharmacy-master/utils/pharmacy-master-utils";

const formOptions = ["Tablet", "Capsule", "Injection", "Syrup", "IV Fluid", "Drops", "Cream"];
const unitOptions = ["mg", "mcg", "g", "ml", "units"];
const routeOptions = ["Oral", "IV", "IM", "SC", "Topical", "Eye", "Ear"];
const storageOptions = ["Room Temperature", "Cold Storage", "Refrigerated", "Frozen"];

export function DrugForm({
  value,
  categories,
  subCategories,
  manufacturers,
  errors,
  onChange,
}: {
  value: DrugMasterRecord;
  categories: DrugCategory[];
  subCategories: DrugSubCategory[];
  manufacturers: ManufacturerRecord[];
  errors: Partial<Record<keyof DrugMasterRecord, string>>;
  onChange: (value: DrugMasterRecord) => void;
}) {
  const relatedSubCategories = React.useMemo(() => subCategoriesForCategory(subCategories, value.categoryId), [subCategories, value.categoryId]);

  function updateNumber(key: "gstPercent" | "reorderLevel" | "minimumStock" | "maximumStock", nextValue: string) {
    onChange({ ...value, [key]: nextValue === "" ? Number.NaN : Number(nextValue) });
  }

  return (
    <FormGrid>
      <TextField label="Drug Name" required value={value.drugName} error={errors.drugName} onChange={(drugName) => onChange({ ...value, drugName })} />
      <TextField label="Generic Name" required value={value.genericName} error={errors.genericName} onChange={(genericName) => onChange({ ...value, genericName })} />
      <TextField label="Brand Name" value={value.brandName} error={errors.brandName} onChange={(brandName) => onChange({ ...value, brandName })} />
      <SelectField
        label="Category"
        required
        value={value.categoryId}
        error={errors.categoryId}
        onChange={(categoryId) => {
          const nextSubCategoryId = subCategoriesForCategory(subCategories, categoryId)[0]?.id ?? "";
          onChange({ ...value, categoryId, subCategoryId: nextSubCategoryId });
        }}
        options={categories.filter((category) => category.status === "Active").map((category) => ({ label: category.categoryName, value: category.id }))}
      />
      <SelectField label="Sub Category" required value={value.subCategoryId} error={errors.subCategoryId} onChange={(subCategoryId) => onChange({ ...value, subCategoryId })} options={relatedSubCategories.map((item) => ({ label: item.subCategoryName, value: item.id }))} />
      <SelectField label="Manufacturer" required value={value.manufacturer} error={errors.manufacturer} onChange={(manufacturer) => onChange({ ...value, manufacturer })} options={manufacturers.filter((item) => item.status === "Active").map((item) => ({ label: item.manufacturerName, value: item.manufacturerName }))} />
      <SelectField label="Form" required value={value.form} error={errors.form} onChange={(form) => onChange({ ...value, form })} options={formOptions.map((item) => ({ label: item, value: item }))} />
      <TextField label="Strength" required value={value.strength} error={errors.strength} onChange={(strength) => onChange({ ...value, strength })} />
      <SelectField label="Unit" required value={value.unit} error={errors.unit} onChange={(unit) => onChange({ ...value, unit })} options={unitOptions.map((item) => ({ label: item, value: item }))} />
      <SelectField label="Route" required value={value.route} error={errors.route} onChange={(route) => onChange({ ...value, route })} options={routeOptions.map((item) => ({ label: item, value: item }))} />
      <TextField label="HSN Code" required value={value.hsnCode} error={errors.hsnCode} onChange={(hsnCode) => onChange({ ...value, hsnCode })} />
      <TextField label="GST %" type="number" value={Number.isNaN(value.gstPercent) ? "" : value.gstPercent} error={errors.gstPercent} onChange={(nextValue) => updateNumber("gstPercent", nextValue)} />
      <TextField label="Reorder Level" type="number" value={Number.isNaN(value.reorderLevel) ? "" : value.reorderLevel} error={errors.reorderLevel} onChange={(nextValue) => updateNumber("reorderLevel", nextValue)} />
      <TextField label="Minimum Stock" type="number" value={Number.isNaN(value.minimumStock) ? "" : value.minimumStock} error={errors.minimumStock} onChange={(nextValue) => updateNumber("minimumStock", nextValue)} />
      <TextField label="Maximum Stock" type="number" value={Number.isNaN(value.maximumStock) ? "" : value.maximumStock} error={errors.maximumStock} onChange={(nextValue) => updateNumber("maximumStock", nextValue)} />
      <SelectField label="Storage Condition" value={value.storageCondition} error={errors.storageCondition} onChange={(storageCondition) => onChange({ ...value, storageCondition })} options={storageOptions.map((item) => ({ label: item, value: item }))} />
      <SelectField label="Prescription Required" value={value.prescriptionRequired} error={errors.prescriptionRequired} onChange={(prescriptionRequired) => onChange({ ...value, prescriptionRequired: prescriptionRequired as DrugMasterRecord["prescriptionRequired"] })} options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
      <SelectField label="Status" required value={value.status} error={errors.status} onChange={(status) => onChange({ ...value, status: status as DrugMasterRecord["status"] })} options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} />
    </FormGrid>
  );
}
