import type { ExpiringStockReportRecord, LowStockReportRecord, PurchaseReportRecord } from "@/features/pharmacy-reports/types";

export const lowStockReportRecords: LowStockReportRecord[] = [
  { id: "low-1", drugName: "Cefixime 200 mg", category: "Antibiotics", currentQty: 92, reorderLevel: 150, shortfall: 58, location: "Pharmacy / A2", status: "Low Stock" },
  { id: "low-2", drugName: "NS 500 ml", category: "IV Fluid", currentQty: 110, reorderLevel: 200, shortfall: 90, location: "Main Store / F1", status: "Low Stock" },
  { id: "low-3", drugName: "Adrenaline Inj", category: "Emergency", currentQty: 24, reorderLevel: 50, shortfall: 26, location: "Crash Cart Store", status: "Approved" },
  { id: "low-4", drugName: "Pantoprazole 40 mg", category: "Gastrointestinal", currentQty: 132, reorderLevel: 180, shortfall: 48, location: "OPD Pharmacy / P2", status: "Ordered" },
  { id: "low-5", drugName: "Metoprolol 25 mg", category: "Cardiac", currentQty: 36, reorderLevel: 80, shortfall: 44, location: "Main Store / C3", status: "Low Stock" },
  { id: "low-6", drugName: "Diclofenac Gel", category: "Analgesics", currentQty: 18, reorderLevel: 60, shortfall: 42, location: "OPD Pharmacy / A1", status: "Ordered" },
  { id: "low-7", drugName: "Salbutamol Nebule", category: "Respiratory", currentQty: 28, reorderLevel: 75, shortfall: 47, location: "Emergency Store", status: "Approved" },
  { id: "low-8", drugName: "Insulin Regular", category: "Endocrine", currentQty: 12, reorderLevel: 40, shortfall: 28, location: "Cold Chain C1", status: "Low Stock" },
  { id: "low-9", drugName: "Ringer Lactate 500 ml", category: "IV Fluid", currentQty: 84, reorderLevel: 180, shortfall: 96, location: "Main Store / F2", status: "Ordered" },
  { id: "low-10", drugName: "Azithromycin 500 mg", category: "Antibiotics", currentQty: 45, reorderLevel: 120, shortfall: 75, location: "Main Store / A4", status: "Low Stock" },
  { id: "low-11", drugName: "Amlodipine 5 mg", category: "Cardiac", currentQty: 65, reorderLevel: 100, shortfall: 35, location: "OPD Pharmacy / C1", status: "Approved" },
  { id: "low-12", drugName: "Omeprazole 20 mg", category: "Gastrointestinal", currentQty: 70, reorderLevel: 140, shortfall: 70, location: "Pharmacy / G3", status: "Low Stock" },
];

export const expiringStockReportRecords: ExpiringStockReportRecord[] = [
  { id: "exp-1", drugName: "Ondansetron Inj", batchNo: "OND-2309", expiryDate: "2026-06-15", daysLeft: 10, qty: 86, mrp: 34, alert: "Within 30 days" },
  { id: "exp-2", drugName: "Vitamin D3 Sachet", batchNo: "D3-2407", expiryDate: "2026-06-28", daysLeft: 23, qty: 42, mrp: 18, alert: "Within 30 days" },
  { id: "exp-3", drugName: "Pantoprazole 40 mg", batchNo: "PAN-2412", expiryDate: "2026-07-25", daysLeft: 50, qty: 640, mrp: 5, alert: "Within 60 days" },
  { id: "exp-4", drugName: "Paracetamol 500 mg", batchNo: "PCM-2401", expiryDate: "2026-08-30", daysLeft: 86, qty: 1240, mrp: 2, alert: "Within 90 days" },
  { id: "exp-5", drugName: "Insulin Regular", batchNo: "INS-2404", expiryDate: "2026-06-20", daysLeft: 15, qty: 12, mrp: 148, alert: "Within 30 days" },
  { id: "exp-6", drugName: "Ceftriaxone 1g", batchNo: "CEF-2402", expiryDate: "2026-07-14", daysLeft: 39, qty: 95, mrp: 58, alert: "Within 60 days" },
  { id: "exp-7", drugName: "Metoprolol 25 mg", batchNo: "MET-2401", expiryDate: "2026-08-12", daysLeft: 68, qty: 36, mrp: 4.5, alert: "Within 90 days" },
  { id: "exp-8", drugName: "Ringer Lactate 500 ml", batchNo: "RL-2408", expiryDate: "2026-07-05", daysLeft: 30, qty: 84, mrp: 42, alert: "Within 30 days" },
  { id: "exp-9", drugName: "Azithromycin 500 mg", batchNo: "AZI-2403", expiryDate: "2026-08-01", daysLeft: 57, qty: 45, mrp: 28, alert: "Within 60 days" },
  { id: "exp-10", drugName: "Amlodipine 5 mg", batchNo: "AML-2406", expiryDate: "2026-08-27", daysLeft: 83, qty: 65, mrp: 3.2, alert: "Within 90 days" },
  { id: "exp-11", drugName: "Salbutamol Nebule", batchNo: "SAL-2405", expiryDate: "2026-06-25", daysLeft: 20, qty: 28, mrp: 16, alert: "Within 30 days" },
  { id: "exp-12", drugName: "Omeprazole 20 mg", batchNo: "OME-2402", expiryDate: "2026-07-30", daysLeft: 55, qty: 70, mrp: 6, alert: "Within 60 days" },
];

export const purchaseReportRecords: PurchaseReportRecord[] = [
  { id: "pur-1", poNumber: "PO-0001", poDate: "2026-06-01", supplier: "Medline Distributors", drug: "Cefixime 200 mg", qty: 500, amount: 3675, grnDone: "No", status: "Draft" },
  { id: "pur-2", poNumber: "PO-0002", poDate: "2026-05-31", supplier: "Care Pharma", drug: "NS 500 ml", qty: 300, amount: 6930, grnDone: "No", status: "Ordered" },
  { id: "pur-3", poNumber: "PO-0003", poDate: "2026-05-28", supplier: "Prime Medical", drug: "Pantoprazole 40 mg", qty: 800, amount: 2039.52, grnDone: "Partial", status: "Partially Received" },
  { id: "pur-4", poNumber: "PO-0004", poDate: "2026-05-25", supplier: "Medline Distributors", drug: "Paracetamol 500 mg", qty: 1000, amount: 1232, grnDone: "Yes", status: "Received" },
  { id: "pur-5", poNumber: "PO-0005", poDate: "2026-05-20", supplier: "Care Pharma", drug: "Syringe 5 ml", qty: 500, amount: 1629.6, grnDone: "Yes", status: "Closed" },
  { id: "pur-6", poNumber: "PO-0006", poDate: "2026-05-18", supplier: "Prime Medical", drug: "Vitamin C", qty: 200, amount: 403.2, grnDone: "No", status: "Cancelled" },
  { id: "pur-7", poNumber: "PO-0007", poDate: "2026-06-03", supplier: "Medline Distributors", drug: "Insulin Regular", qty: 60, amount: 7104, grnDone: "Partial", status: "Partially Received" },
  { id: "pur-8", poNumber: "PO-0008", poDate: "2026-06-04", supplier: "Care Pharma", drug: "Ringer Lactate 500 ml", qty: 400, amount: 11760, grnDone: "No", status: "Ordered" },
  { id: "pur-9", poNumber: "PO-0009", poDate: "2026-06-05", supplier: "Prime Medical", drug: "Azithromycin 500 mg", qty: 250, amount: 5600, grnDone: "No", status: "Draft" },
  { id: "pur-10", poNumber: "PO-0010", poDate: "2026-05-22", supplier: "Medline Distributors", drug: "Amlodipine 5 mg", qty: 800, amount: 2240, grnDone: "Yes", status: "Received" },
  { id: "pur-11", poNumber: "PO-0011", poDate: "2026-05-27", supplier: "Care Pharma", drug: "Salbutamol Nebule", qty: 120, amount: 1612.8, grnDone: "Partial", status: "Partially Received" },
  { id: "pur-12", poNumber: "PO-0012", poDate: "2026-06-02", supplier: "Prime Medical", drug: "Omeprazole 20 mg", qty: 450, amount: 2268, grnDone: "No", status: "Ordered" },
];
