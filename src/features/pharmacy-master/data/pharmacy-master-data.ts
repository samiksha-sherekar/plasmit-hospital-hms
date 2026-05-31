import type { DrugCategory, DrugMasterRecord, DrugSubCategory, ManufacturerRecord, RackStoreLocationRecord, SupplierRecord, UnitRecord } from "@/features/pharmacy-master/types";

export const initialDrugCategories: DrugCategory[] = [
  { id: "cat-antibiotic", categoryName: "Antibiotics", code: "ABX", status: "Active", description: "Anti-infective medicines used for bacterial infections." },
  { id: "cat-analgesic", categoryName: "Analgesics", code: "ANL", status: "Active", description: "Pain relief and antipyretic medicines." },
  { id: "cat-cardiac", categoryName: "Cardiac", code: "CRD", status: "Active", description: "Cardiology and blood pressure medicines." },
  { id: "cat-gastro", categoryName: "Gastrointestinal", code: "GST", status: "Inactive", description: "Acidity, antiemetic, and digestive support medicines." },
];

export const initialDrugSubCategories: DrugSubCategory[] = [
  { id: "sub-penicillin", categoryId: "cat-antibiotic", subCategoryName: "Penicillins", code: "PNC", status: "Active", description: "Penicillin and beta-lactam antibiotic group." },
  { id: "sub-cephalosporin", categoryId: "cat-antibiotic", subCategoryName: "Cephalosporins", code: "CEP", status: "Active", description: "Cephalosporin injections and oral preparations." },
  { id: "sub-nsaid", categoryId: "cat-analgesic", subCategoryName: "NSAIDs", code: "NSA", status: "Active", description: "Non-steroidal anti-inflammatory medicines." },
  { id: "sub-opioid", categoryId: "cat-analgesic", subCategoryName: "Opioid Analgesics", code: "OPD", status: "Inactive", description: "Controlled pain relief medicines requiring prescription." },
  { id: "sub-antihypertensive", categoryId: "cat-cardiac", subCategoryName: "Antihypertensives", code: "AHT", status: "Active", description: "Blood pressure control medicines." },
  { id: "sub-antacid", categoryId: "cat-gastro", subCategoryName: "Antacids", code: "ATC", status: "Inactive", description: "Acidity and reflux management medicines." },
];

export const initialDrugMasterRecords: DrugMasterRecord[] = [
  {
    id: "drug-amox-500",
    drugName: "Amoxicillin 500",
    genericName: "Amoxicillin",
    brandName: "Amoxcare",
    categoryId: "cat-antibiotic",
    subCategoryId: "sub-penicillin",
    manufacturer: "Cipla",
    form: "Capsule",
    strength: "500 mg",
    unit: "Strip",
    route: "Oral",
    hsnCode: "300410",
    gstPercent: 12,
    reorderLevel: 60,
    minimumStock: 40,
    maximumStock: 500,
    storageCondition: "Room Temperature",
    prescriptionRequired: "Yes",
    status: "Active",
  },
  {
    id: "drug-cef-1g",
    drugName: "Ceftriaxone 1g",
    genericName: "Ceftriaxone",
    brandName: "Cefaxone",
    categoryId: "cat-antibiotic",
    subCategoryId: "sub-cephalosporin",
    manufacturer: "Sun Pharma",
    form: "Injection",
    strength: "1 g",
    unit: "Vial",
    route: "IV/IM",
    hsnCode: "300420",
    gstPercent: 12,
    reorderLevel: 30,
    minimumStock: 20,
    maximumStock: 250,
    storageCondition: "Room Temperature",
    prescriptionRequired: "Yes",
    status: "Active",
  },
  {
    id: "drug-para-650",
    drugName: "Paracetamol 650",
    genericName: "Paracetamol",
    brandName: "Dolo",
    categoryId: "cat-analgesic",
    subCategoryId: "sub-nsaid",
    manufacturer: "Micro Labs",
    form: "Tablet",
    strength: "650 mg",
    unit: "Strip",
    route: "Oral",
    hsnCode: "300490",
    gstPercent: 12,
    reorderLevel: 100,
    minimumStock: 75,
    maximumStock: 800,
    storageCondition: "Room Temperature",
    prescriptionRequired: "No",
    status: "Active",
  },
];

export const initialManufacturers: ManufacturerRecord[] = [
  { id: "mfg-cipla", manufacturerName: "Cipla", code: "CIP", contactPerson: "Amit Rao", phoneNumber: "9876500011", email: "supply@cipla.example", gstNumber: "27AAACC1450B1ZQ", address: "Mumbai", status: "Active" },
  { id: "mfg-sun", manufacturerName: "Sun Pharma", code: "SUN", contactPerson: "Pooja Shah", phoneNumber: "9876500022", email: "orders@sun.example", gstNumber: "27AACCS1440G1ZT", address: "Vadodara", status: "Active" },
  { id: "mfg-micro", manufacturerName: "Micro Labs", code: "MIC", contactPerson: "", phoneNumber: "", email: "", gstNumber: "", address: "Bengaluru", status: "Active" },
];

export const initialUnits: UnitRecord[] = [
  { id: "unit-mg", unitName: "mg", unitCode: "MG", description: "Milligram", status: "Active" },
  { id: "unit-mcg", unitName: "mcg", unitCode: "MCG", description: "Microgram", status: "Active" },
  { id: "unit-g", unitName: "g", unitCode: "G", description: "Gram", status: "Active" },
  { id: "unit-ml", unitName: "ml", unitCode: "ML", description: "Millilitre", status: "Active" },
  { id: "unit-units", unitName: "units", unitCode: "UNT", description: "International units", status: "Active" },
];

export const initialRackStoreLocations: RackStoreLocationRecord[] = [
  { id: "loc-main-a1", locationName: "Main Rack A1", storeName: "Main Pharmacy", rackNumber: "A1", shelfNumber: "S1", description: "Fast moving oral medicines", status: "Active" },
  { id: "loc-cold-c1", locationName: "Cold Chain C1", storeName: "Cold Store", rackNumber: "C1", shelfNumber: "", description: "Refrigerated medicines", status: "Active" },
];

export const initialSuppliers: SupplierRecord[] = [
  {
    id: "sup-medilink",
    supplierName: "Medilink Distributors",
    contactPerson: "Rahul Sharma",
    phone: "9876543210",
    email: "orders@medilink.example",
    gstNumber: "27ABCDE1234F1Z5",
    address: "Andheri East, Mumbai",
    paymentTerms: "Net 30",
    status: "Active",
  },
  {
    id: "sup-careplus",
    supplierName: "CarePlus Pharma Supply",
    contactPerson: "Neha Patel",
    phone: "9822211110",
    email: "supply@careplus.example",
    gstNumber: "24AABCU9603R1ZV",
    address: "Satellite Road, Ahmedabad",
    paymentTerms: "Net 15",
    status: "Active",
  },
];
