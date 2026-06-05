import type { DoseUnit, DrugCategory, DurationUnit, TimeUnit, DrugOrder } from "./types";

export const orderCategories: DrugCategory[] = ["SOS", "STAT", "Bolus", "Diluent", "Intermittent", "Continuous"];
export const forms = ["Tablet", "Capsule", "Syrup", "Drops", "Spray", "Inhaler", "Ointment", "Dermal Patch", "Lozenge", "Suspension", "Eye drops", "Ear drops", "Injection", "IV Fluid"];
export const frequencies = ["TID", "BID", "One time Daily", "QID", "SOS", "Every 3 hours", "Every 4 hours", "Every 5 hours"];
export const formARoutes = ["Oral", "Topical", "Eye", "Ear", "Nasal", "Sublingual", "Transdermal", "Ocular", "Vaginal", "Otic", "Chewable"];
export const injectionRoutes = ["Intramuscular (IM)", "Subcutaneous (SC)", "Spinal", "Intravenous (IV)"];
export const routes = ["Oral", "Subcutaneous (SC)", "Intravenous (IV)", "Intramuscular (IM)", "Spinal", "Anal", "Topical", "Eye", "Sublingual", "Chewable", "Transdermal", "Ocular", "Vaginal", "Otic", "Nasal"];
export const doseUnits: DoseUnit[] = ["mg", "ml", "microgram", "gram", "litre", "drops", "units"];
export const timeUnits: TimeUnit[] = ["sec", "min", "hour", "day"];
export const infusionTimeUnits: TimeUnit[] = ["sec", "min", "hour"];
export const durationUnits: DurationUnit[] = ["Days", "Weeks", "Months"];
export const instructions = ["After food", "Before food", "Evening", "Bed time", "Early morning before food", "Mix with water", "Mix with milk", "Apply on skin", "Inhale through nose", "Drops in eye", "Drops in mouth", "Drops in ear", "Drops in nose", "After lunch", "After dinner", "After breakfast"];
export const pharmacies = ["Outpatient pharmacy 1", "Outpatient pharmacy 2", "Emergency pharmacy", "Inpatient pharmacy"];
export const sites = ["Deltoid", "Vastus lateralis", "Gluteus maximus", "Gluteus medius", "Gluteus dorsalis", "Spinal"];
export const diluents = ["Normal Saline", "Dextrose"];

export const frequencyMultiplier: Record<string, number> = {
  TID: 3,
  BID: 2,
  "One time Daily": 1,
  QID: 4,
  SOS: 1,
  "Every 4 hours": 6,
  "Every 3 hours": 8,
  "Every 5 hours": 5,
  Continuous: 1,
  Intermittent: 1,
};

export const initialOrders: DrugOrder[] = [
  { id: "drug-001", category: "Scheduled", genericName: "Paracetamol", name: "Dolo 650", form: "Tablet", dosage: "650", doseUnit: "mg", maxDosage: "3000", frequency: "TID", days: "3", route: "Oral", availableQty: 124, pharmacy: "Inpatient pharmacy", startDate: "2026-06-05", endDate: "", instructions: "After food", orderedQty: 5850, dispensedQty: 0, receivedQty: 0, administeredQty: 0 },
  { id: "drug-002", category: "Scheduled", genericName: "Paracetamol", name: "Paracip 500", form: "Tablet", dosage: "500", doseUnit: "mg", maxDosage: "3000", frequency: "TID", days: "3", route: "Oral", availableQty: 86, pharmacy: "Inpatient pharmacy", startDate: "2026-06-05", endDate: "", instructions: "After food", orderedQty: 4500, dispensedQty: 0, receivedQty: 0, administeredQty: 0 },
  { id: "drug-003", category: "Scheduled", genericName: "Enoxaparin", name: "Clexane 60mg", form: "Injection", dosage: "60", doseUnit: "mg", maxDosage: "", frequency: "BID", days: "10", route: "Subcutaneous (SC)", availableQty: 32, pharmacy: "Emergency pharmacy", startDate: "2026-06-05", endDate: "", instructions: "", orderedQty: 1200, dispensedQty: 0, receivedQty: 0, administeredQty: 0, diluents: ["Normal Saline"] },
  { id: "drug-004", category: "Intermittent", genericName: "Enoxaparin", name: "Clexane 40mg", form: "Injection", dosage: "40", doseUnit: "mg", maxDosage: "", frequency: "BID", days: "10", route: "Intravenous (IV)", availableQty: 24, pharmacy: "Emergency pharmacy", startDate: "2026-06-05", endDate: "", instructions: "", orderedQty: 800, dispensedQty: 0, receivedQty: 0, administeredQty: 0, diluents: ["Normal Saline", "Dextrose"] },
  { id: "drug-005", category: "Scheduled", genericName: "Rivaroxaban", name: "Xaralto 20mg", form: "Tablet", dosage: "20", doseUnit: "mg", maxDosage: "", frequency: "One time Daily", days: "30", route: "Oral", availableQty: 58, pharmacy: "Inpatient pharmacy", startDate: "2026-06-05", endDate: "", instructions: "Bed time", orderedQty: 600, dispensedQty: 0, receivedQty: 0, administeredQty: 0, hasContraindication: true },
  { id: "drug-006", category: "Scheduled", genericName: "Prednisolone", name: "Omnocortil 10", form: "Tablet", dosage: "10", doseUnit: "mg", maxDosage: "", frequency: "One time Daily", days: "10", route: "Oral", availableQty: 44, pharmacy: "Inpatient pharmacy", startDate: "2026-06-05", endDate: "", instructions: "After breakfast", orderedQty: 100, dispensedQty: 0, receivedQty: 0, administeredQty: 0 },
  { id: "drug-007", category: "Scheduled", genericName: "Prednisolone optho eye drops", name: "Pred forte Ophthalmic suspension", form: "Suspension", dosage: "5", doseUnit: "drops", maxDosage: "", frequency: "BID", days: "5", route: "Eye", availableQty: 18, pharmacy: "Outpatient pharmacy 1", startDate: "2026-06-05", endDate: "", instructions: "Drops in eye", orderedQty: 50, dispensedQty: 0, receivedQty: 0, administeredQty: 0 },
  { id: "drug-008", category: "Scheduled", genericName: "Citrizine hydrochloride", name: "Cetrizine cold DS", form: "Syrup", dosage: "5", doseUnit: "ml", maxDosage: "", frequency: "BID", days: "5", route: "Oral", availableQty: 21, pharmacy: "Outpatient pharmacy 2", startDate: "2026-06-05", endDate: "", instructions: "After dinner", orderedQty: 50, dispensedQty: 0, receivedQty: 0, administeredQty: 0 },
  { id: "drug-009", category: "Continuous", genericName: "Sodium Chloride", name: "Normal Saline", form: "IV Fluid", dosage: "100", doseUnit: "ml", maxDosage: "", frequency: "One time Daily", days: "1", route: "Intravenous (IV)", availableQty: 40, pharmacy: "Inpatient pharmacy", startDate: "2026-06-05", endDate: "", instructions: "", orderedQty: 2400, dispensedQty: 0, receivedQty: 0, administeredQty: 0, diluents: ["Normal Saline"] },
];
