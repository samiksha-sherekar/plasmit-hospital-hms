import type { LucideIcon } from "lucide-react";
import { CalendarClock, CreditCard, FlaskConical, IdCard, PackageCheck, Radio, ReceiptText, Search, TestTube2, UserRound } from "lucide-react";

export type BillingDeskStep = "patient" | "referral" | "appointments" | "pathology" | "radiology" | "packages" | "quick-tests" | "individual-tests" | "summary" | "payment";
export type BillingDeskPatient = {
  id: string;
  name: string;
  uhid: string;
  phone: string;
  ageGender: string;
  bloodGroup: string;
  registeredAt: string;
  payer: string;
  address: string;
  city: string;
  source: string;
  doctor: string;
};
export type BillingDeskService = {
  id: string;
  name: string;
  category: "Pathology" | "Radiology" | "Package" | "Quick Test" | "Individual Test" | "Appointment";
  group: string;
  price: number;
  discount: number;
  tax: number;
  urgency?: "Routine" | "Urgent" | "Stat";
  meta: string;
};

export const billingDeskSteps: { id: BillingDeskStep; label: string; icon: LucideIcon }[] = [
  { id: "patient", label: "Patient", icon: IdCard },
  { id: "referral", label: "Referral", icon: UserRound },
  { id: "appointments", label: "Appointments", icon: CalendarClock },
  { id: "pathology", label: "Pathology", icon: FlaskConical },
  { id: "radiology", label: "Radiology", icon: Radio },
  { id: "packages", label: "Packages", icon: PackageCheck },
  { id: "quick-tests", label: "Quick Tests", icon: TestTube2 },
  { id: "individual-tests", label: "Individual Tests", icon: Search },
  { id: "summary", label: "Bill Summary", icon: ReceiptText },
  { id: "payment", label: "Payment", icon: CreditCard },
];

export const billingPatients: BillingDeskPatient[] = [
  { id: "pat-001", name: "Meera Joshi", uhid: "PLH-240118", phone: "+91 98765 11220", ageGender: "42/F", bloodGroup: "B+", registeredAt: "18 Jan 2024", payer: "Star Health", address: "A-14 Green Park", city: "Delhi", source: "OPD", doctor: "Dr. Kavita Rao" },
  { id: "pat-002", name: "Arjun Kapoor", uhid: "PLH-240221", phone: "+91 98111 78002", ageGender: "36/M", bloodGroup: "O+", registeredAt: "21 Feb 2024", payer: "Self", address: "Tower 8, Noida Sector 62", city: "Noida", source: "Corporate", doctor: "Dr. Aman Verma" },
  { id: "pat-003", name: "Riya Malhotra", uhid: "PLH-240417", phone: "+91 99880 44552", ageGender: "29/F", bloodGroup: "A-", registeredAt: "17 Apr 2024", payer: "CGHS", address: "Civil Lines", city: "Gurugram", source: "Walk-in", doctor: "Dr. Neha Malik" },
  { id: "pat-004", name: "Kabir Sharma", uhid: "PLH-250108", phone: "+91 97170 22091", ageGender: "8/M", bloodGroup: "AB+", registeredAt: "08 Jan 2025", payer: "Self", address: "Mayur Vihar", city: "Delhi", source: "Pediatric OPD", doctor: "Dr. Sameer Khan" },
];

export const billingServices: BillingDeskService[] = [
  { id: "svc-001", name: "CBC with ESR", category: "Pathology", group: "Hematology", price: 650, discount: 0, tax: 5, urgency: "Routine", meta: "Sample: EDTA" },
  { id: "svc-002", name: "Liver Function Test", category: "Pathology", group: "Biochemistry", price: 1250, discount: 5, tax: 5, urgency: "Urgent", meta: "Fasting optional" },
  { id: "svc-003", name: "Thyroid Profile", category: "Pathology", group: "Hormone", price: 1450, discount: 0, tax: 5, urgency: "Routine", meta: "T3/T4/TSH" },
  { id: "svc-004", name: "Chest X-ray PA", category: "Radiology", group: "X-ray", price: 900, discount: 0, tax: 5, urgency: "Routine", meta: "No contrast" },
  { id: "svc-005", name: "USG Abdomen", category: "Radiology", group: "Ultrasound", price: 1800, discount: 0, tax: 5, urgency: "Urgent", meta: "Fasting preferred" },
  { id: "svc-006", name: "CT Brain Plain", category: "Radiology", group: "CT", price: 4500, discount: 5, tax: 5, urgency: "Stat", meta: "No contrast" },
  { id: "svc-007", name: "Executive Health Package", category: "Package", group: "Preventive", price: 6999, discount: 15, tax: 5, meta: "CBC, LFT, KFT, ECG, X-ray" },
  { id: "svc-008", name: "Cardiac Risk Package", category: "Package", group: "Cardiology", price: 5200, discount: 10, tax: 5, meta: "Lipid, ECG, Echo screening" },
  { id: "svc-009", name: "Blood Sugar Random", category: "Quick Test", group: "Favorites", price: 180, discount: 0, tax: 5, meta: "One-click add" },
  { id: "svc-010", name: "ECG 12 Lead", category: "Quick Test", group: "Favorites", price: 600, discount: 0, tax: 5, meta: "Immediate handoff" },
  { id: "svc-011", name: "Vitamin D", category: "Individual Test", group: "Biochemistry", price: 1900, discount: 0, tax: 5, meta: "Serum sample" },
  { id: "svc-012", name: "OPD Consultation Fee", category: "Appointment", group: "Cardiology", price: 1200, discount: 0, tax: 0, meta: "10:40 AM slot" },
];

export const billingHints = [
  "Patient has pending pathology bill.",
  "Insurance requires pre-approval.",
  "Duplicate test already added.",
  "High-value billing package detected.",
];

export const billingApiEndpoints = [
  "GET /api/v1/billing/patients",
  "GET /api/v1/billing/tests",
  "GET /api/v1/billing/packages",
  "POST /api/v1/billing/create",
  "POST /api/v1/billing/payment",
  "GET /api/v1/billing/history/:patientId",
];
