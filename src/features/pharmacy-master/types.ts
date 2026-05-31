export type PharmacyStatus = "Active" | "Inactive";

export type DrugCategory = {
  id: string;
  categoryName: string;
  code: string;
  status: PharmacyStatus;
  description: string;
};

export type DrugSubCategory = {
  id: string;
  categoryId: string;
  subCategoryName: string;
  code: string;
  status: PharmacyStatus;
  description: string;
};

export type DrugMasterRecord = {
  id: string;
  drugName: string;
  genericName: string;
  brandName: string;
  categoryId: string;
  subCategoryId: string;
  manufacturer: string;
  form: string;
  strength: string;
  unit: string;
  route: string;
  hsnCode: string;
  gstPercent: number;
  reorderLevel: number;
  minimumStock: number;
  maximumStock: number;
  storageCondition: string;
  prescriptionRequired: "Yes" | "No";
  status: PharmacyStatus;
};

export type SupplierRecord = {
  id: string;
  supplierName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
  paymentTerms: string;
  status: PharmacyStatus;
};

export type ManufacturerRecord = {
  id: string;
  manufacturerName: string;
  code: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  gstNumber: string;
  address: string;
  status: PharmacyStatus;
};

export type UnitRecord = {
  id: string;
  unitName: string;
  unitCode: string;
  description: string;
  status: PharmacyStatus;
};

export type RackStoreLocationRecord = {
  id: string;
  locationName: string;
  storeName: string;
  rackNumber: string;
  shelfNumber: string;
  description: string;
  status: PharmacyStatus;
};

export type MasterMode = "create" | "edit" | "clone";
