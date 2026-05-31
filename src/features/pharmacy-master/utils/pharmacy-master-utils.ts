import type { DrugCategory, DrugMasterRecord, DrugSubCategory, ManufacturerRecord, PharmacyStatus, RackStoreLocationRecord, SupplierRecord, UnitRecord } from "@/features/pharmacy-master/types";

export function includesText(value: string, search: string) {
  return value.toLowerCase().includes(search.toLowerCase());
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function toggleStatus(status: PharmacyStatus): PharmacyStatus {
  return status === "Active" ? "Inactive" : "Active";
}

export function categoryName(categories: DrugCategory[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.categoryName ?? categoryId;
}

export function subCategoryName(subCategories: DrugSubCategory[], subCategoryId: string) {
  return subCategories.find((subcategory) => subcategory.id === subCategoryId)?.subCategoryName ?? subCategoryId;
}

export function subCategoriesForCategory(subCategories: DrugSubCategory[], categoryId: string) {
  return subCategories.filter((subcategory) => subcategory.categoryId === categoryId && subcategory.status === "Active");
}

export function hasDuplicateCode<T extends { id: string; code: string }>(records: T[], code: string, currentId?: string) {
  return records.some((record) => record.code.trim().toLowerCase() === code.trim().toLowerCase() && record.id !== currentId);
}

export function validateCategory(record: DrugCategory, records: DrugCategory[]) {
  const errors: Partial<Record<keyof DrugCategory, string>> = {};
  if (!record.categoryName.trim()) errors.categoryName = "Category name is required.";
  if (!record.code.trim()) errors.code = "Code is required.";
  if (record.code.trim() && hasDuplicateCode(records, record.code, record.id)) errors.code = "Code already exists.";
  return errors;
}

export function validateSubCategory(record: DrugSubCategory, records: DrugSubCategory[]) {
  const errors: Partial<Record<keyof DrugSubCategory, string>> = {};
  if (!record.categoryId) errors.categoryId = "Category is required.";
  if (!record.subCategoryName.trim()) errors.subCategoryName = "Sub category name is required.";
  if (!record.code.trim()) errors.code = "Code is required.";
  if (record.code.trim() && hasDuplicateCode(records, record.code, record.id)) errors.code = "Code already exists.";
  return errors;
}

export function validateDrug(record: DrugMasterRecord, records: DrugMasterRecord[]) {
  const errors: Partial<Record<keyof DrugMasterRecord, string>> = {};
  if (!record.drugName.trim()) errors.drugName = "Drug name is required.";
  if (!record.genericName.trim()) errors.genericName = "Generic name is required.";
  if (!record.categoryId) errors.categoryId = "Category is required.";
  if (!record.subCategoryId) errors.subCategoryId = "Sub category is required.";
  if (!record.manufacturer.trim()) errors.manufacturer = "Manufacturer is required.";
  if (!record.form.trim()) errors.form = "Form is required.";
  if (!record.strength.trim()) errors.strength = "Strength is required.";
  if (!record.unit.trim()) errors.unit = "Unit is required.";
  if (!record.route.trim()) errors.route = "Route is required.";
  if (!record.hsnCode.trim()) errors.hsnCode = "HSN code is required.";
  if (!Number.isFinite(record.gstPercent) || record.gstPercent < 0) errors.gstPercent = "GST % must be 0 or more.";
  if (!Number.isFinite(record.minimumStock) || record.minimumStock < 0) errors.minimumStock = "Minimum stock must be 0 or more.";
  if (!Number.isFinite(record.maximumStock) || record.maximumStock < record.minimumStock) errors.maximumStock = "Maximum stock must be greater than minimum stock.";
  if (!Number.isFinite(record.reorderLevel) || record.reorderLevel < 0) errors.reorderLevel = "Reorder level must be 0 or more.";
  if (records.some((drug) => drug.drugName.trim().toLowerCase() === record.drugName.trim().toLowerCase() && drug.id !== record.id)) errors.drugName = "Drug name already exists.";
  return errors;
}

export function validateSupplier(record: SupplierRecord, records: SupplierRecord[]) {
  const errors: Partial<Record<keyof SupplierRecord, string>> = {};
  if (!record.supplierName.trim()) errors.supplierName = "Supplier name is required.";
  if (!record.contactPerson.trim()) errors.contactPerson = "Contact person is required.";
  if (!record.phone.trim()) errors.phone = "Phone is required.";
  if (record.phone.trim() && !/^[0-9+\-\s]{8,15}$/.test(record.phone.trim())) errors.phone = "Enter a valid phone number.";
  if (record.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email.trim())) errors.email = "Enter a valid email.";
  if (!record.gstNumber.trim()) errors.gstNumber = "GST number is required.";
  if (!record.address.trim()) errors.address = "Address is required.";
  if (!record.paymentTerms.trim()) errors.paymentTerms = "Payment terms are required.";
  if (records.some((supplier) => supplier.supplierName.trim().toLowerCase() === record.supplierName.trim().toLowerCase() && supplier.id !== record.id)) errors.supplierName = "Supplier name already exists.";
  return errors;
}

export function validateManufacturer(record: ManufacturerRecord, records: ManufacturerRecord[]) {
  const errors: Partial<Record<keyof ManufacturerRecord, string>> = {};
  if (!record.manufacturerName.trim()) errors.manufacturerName = "Manufacturer name is required.";
  if (record.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email.trim())) errors.email = "Enter a valid email.";
  if (record.phoneNumber.trim() && !/^[0-9+\-\s]{8,15}$/.test(record.phoneNumber.trim())) errors.phoneNumber = "Enter a valid phone number.";
  if (records.some((item) => item.manufacturerName.trim().toLowerCase() === record.manufacturerName.trim().toLowerCase() && item.id !== record.id)) errors.manufacturerName = "Manufacturer already exists.";
  return errors;
}

export function validateUnit(record: UnitRecord, records: UnitRecord[]) {
  const errors: Partial<Record<keyof UnitRecord, string>> = {};
  if (!record.unitName.trim()) errors.unitName = "Unit name is required.";
  if (!record.status) errors.status = "Status is required.";
  if (records.some((item) => item.unitName.trim().toLowerCase() === record.unitName.trim().toLowerCase() && item.id !== record.id)) errors.unitName = "Unit already exists.";
  return errors;
}

export function validateRackStoreLocation(record: RackStoreLocationRecord, records: RackStoreLocationRecord[]) {
  const errors: Partial<Record<keyof RackStoreLocationRecord, string>> = {};
  if (!record.locationName.trim()) errors.locationName = "Location name is required.";
  if (!record.storeName.trim()) errors.storeName = "Store name is required.";
  if (!record.status) errors.status = "Status is required.";
  if (records.some((item) => item.locationName.trim().toLowerCase() === record.locationName.trim().toLowerCase() && item.id !== record.id)) errors.locationName = "Location already exists.";
  return errors;
}
