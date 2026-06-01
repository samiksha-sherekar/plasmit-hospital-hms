import type { BatchStockRecord, CurrentStockRecord, ExpiryTrackingRecord, StockAdjustmentRecord, StockTransferRecord } from "@/features/pharmacy-inventory/types";

export const initialCurrentStock: CurrentStockRecord[] = [
  { id: "cs-1", drug: "Paracetamol 500 mg", batchNumber: "PCM-2401", availableQuantity: 1240, reservedQuantity: 80, unit: "Tablet", storeLocation: "Main Store / R1", reorderLevel: 300, expiryDate: "2026-09-30", status: "Available" },
  { id: "cs-2", drug: "Cefixime 200 mg", batchNumber: "CFX-2408", availableQuantity: 92, reservedQuantity: 12, unit: "Tablet", storeLocation: "Pharmacy / A2", reorderLevel: 150, expiryDate: "2027-01-18", status: "Low Stock" },
  { id: "cs-3", drug: "Vitamin D3 Sachet", batchNumber: "D3-2211", availableQuantity: 14, reservedQuantity: 0, unit: "Sachet", storeLocation: "Hold Rack", reorderLevel: 40, expiryDate: "2026-05-20", status: "Expired" },
];

export const initialBatchStock: BatchStockRecord[] = [
  { id: "bs-1", drug: "Pantoprazole 40 mg", batchNumber: "PAN-2412", manufacturingDate: "2024-12-01", expiryDate: "2026-11-30", availableQuantity: 640, purchasePrice: 2.4, mrp: 5, location: "Main Store / P2", status: "Available" },
  { id: "bs-2", drug: "Ondansetron Inj", batchNumber: "OND-2309", manufacturingDate: "2023-09-12", expiryDate: "2026-08-15", availableQuantity: 86, purchasePrice: 18, mrp: 34, location: "Emergency Store", status: "Near Expiry" },
];

export const initialExpiryTracking: ExpiryTrackingRecord[] = [
  { id: "exp-1", drug: "Ondansetron Inj", batchNumber: "OND-2309", expiryDate: "2026-08-15", daysRemaining: 75, currentStock: 86, location: "Emergency Store", status: "Near Expiry" },
  { id: "exp-2", drug: "Vitamin D3 Sachet", batchNumber: "D3-2211", expiryDate: "2026-05-20", daysRemaining: 0, currentStock: 14, location: "Hold Rack", status: "Expired" },
];

export const initialStockAdjustments: StockAdjustmentRecord[] = [
  { id: "adj-1", adjustmentNumber: "ADJ-0001", date: "2026-06-01", drug: "Paracetamol 500 mg", batch: "PCM-2401", currentQuantity: 1250, adjustedQuantity: 1240, difference: -10, reason: "Damaged", remarks: "Damaged strips removed", status: "Submitted", submittedBy: "Store Manager", submittedDate: "2026-06-01", approvedBy: "", approvedDate: "", rejectedReason: "" },
  { id: "adj-2", adjustmentNumber: "ADJ-0002", date: "2026-05-31", drug: "Cefixime 200 mg", batch: "CFX-2408", currentQuantity: 90, adjustedQuantity: 92, difference: 2, reason: "Physical Count Difference", remarks: "Found in transit bin", status: "Approved", submittedBy: "Pharmacist", submittedDate: "2026-05-31", approvedBy: "Hospital Admin", approvedDate: "2026-06-01", rejectedReason: "" },
];

export const initialStockTransfers: StockTransferRecord[] = [
  { id: "trf-1", transferNumber: "TRF-0001", fromStore: "Main Store", toStore: "Emergency Store", drug: "Ondansetron Inj", batch: "OND-2309", transferQuantity: 40, transferDate: "2026-06-01", remarks: "Night duty buffer", status: "Submitted", submittedBy: "Emergency Pharmacy", submittedDate: "2026-06-01", approvedBy: "", approvedDate: "", rejectedReason: "" },
  { id: "trf-2", transferNumber: "TRF-0002", fromStore: "Main Store", toStore: "OPD Pharmacy", drug: "Pantoprazole 40 mg", batch: "PAN-2412", transferQuantity: 120, transferDate: "2026-05-31", remarks: "Routine replenishment", status: "Transferred", submittedBy: "OPD Pharmacy", submittedDate: "2026-05-31", approvedBy: "Hospital Admin", approvedDate: "2026-06-01", rejectedReason: "" },
  { id: "trf-3", transferNumber: "TRF-0003", fromStore: "Main Store", toStore: "IPD Store", drug: "Paracetamol 500 mg", batch: "PCM-2401", transferQuantity: 200, transferDate: "2026-05-30", remarks: "Ward stock", status: "Received", submittedBy: "IPD Store", submittedDate: "2026-05-30", approvedBy: "Hospital Admin", approvedDate: "2026-06-01", rejectedReason: "" },
];
