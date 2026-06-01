import type { GrnRecord, PurchaseOrderRecord, PurchaseRequisitionRecord, PurchaseReturnRecord } from "@/features/pharmacy-purchase/types";

export const initialPurchaseRequisitions: PurchaseRequisitionRecord[] = [
  { id: "pr-1", prNumber: "PR-0001", date: "2026-06-01", requestedBy: "Pharmacy", priority: "High", remarks: "Reorder level crossed", status: "Submitted", submittedBy: "Pharmacist", submittedDate: "2026-06-01", approvedBy: "", approvedDate: "", rejectedReason: "", drug: "Cefixime 200 mg", requiredQuantity: 500, currentStock: 92, reorderLevel: 150, itemRemarks: "Fast moving antibiotic" },
  { id: "pr-2", prNumber: "PR-0002", date: "2026-05-31", requestedBy: "Main Store", priority: "Normal", remarks: "Monthly purchase", status: "Submitted", submittedBy: "Store Manager", submittedDate: "2026-05-31", approvedBy: "", approvedDate: "", rejectedReason: "", drug: "NS 500 ml", requiredQuantity: 300, currentStock: 110, reorderLevel: 200, itemRemarks: "Ward consumption" },
  { id: "pr-3", prNumber: "PR-0003", date: "2026-05-30", requestedBy: "Emergency", priority: "Urgent", remarks: "Crash cart reserve", status: "Approved", submittedBy: "Pharmacist", submittedDate: "2026-05-30", approvedBy: "Hospital Admin", approvedDate: "2026-06-01", rejectedReason: "", drug: "Adrenaline Inj", requiredQuantity: 100, currentStock: 24, reorderLevel: 50, itemRemarks: "Emergency buffer" },
  { id: "pr-4", prNumber: "PR-0004", date: "2026-05-29", requestedBy: "OPD", priority: "Low", remarks: "Sufficient stock", status: "Rejected", submittedBy: "OPD Pharmacy", submittedDate: "2026-05-29", approvedBy: "", approvedDate: "", rejectedReason: "Sufficient stock", drug: "Vitamin C", requiredQuantity: 100, currentStock: 260, reorderLevel: 80, itemRemarks: "Rejected by purchase" },
];

export const initialPurchaseOrders: PurchaseOrderRecord[] = [
  { id: "po-1", poNumber: "PO-0001", poDate: "2026-06-01", supplier: "Medline Distributors", expectedDeliveryDate: "2026-06-05", remarks: "Against PR-0001", status: "Submitted", drug: "Cefixime 200 mg", orderedQuantity: 500, unitPrice: 7.5, discount: 2, gst: 12, amount: 3675 },
  { id: "po-2", poNumber: "PO-0002", poDate: "2026-05-31", supplier: "Care Pharma", expectedDeliveryDate: "2026-06-04", remarks: "Monthly purchase", status: "Ordered", drug: "NS 500 ml", orderedQuantity: 300, unitPrice: 22, discount: 0, gst: 5, amount: 6930 },
  { id: "po-3", poNumber: "PO-0003", poDate: "2026-05-28", supplier: "Prime Medical", expectedDeliveryDate: "2026-06-01", remarks: "Balance pending", status: "Partially Received", drug: "Pantoprazole 40 mg", orderedQuantity: 800, unitPrice: 2.3, discount: 1, gst: 12, amount: 2039.52 },
  { id: "po-4", poNumber: "PO-0004", poDate: "2026-05-25", supplier: "Medline Distributors", expectedDeliveryDate: "2026-05-29", remarks: "GRN completed", status: "Received", drug: "Paracetamol 500 mg", orderedQuantity: 1000, unitPrice: 1.1, discount: 0, gst: 12, amount: 1232 },
  { id: "po-5", poNumber: "PO-0005", poDate: "2026-05-20", supplier: "Care Pharma", expectedDeliveryDate: "2026-05-24", remarks: "Closed by purchase", status: "Closed", drug: "Syringe 5 ml", orderedQuantity: 500, unitPrice: 3, discount: 3, gst: 12, amount: 1629.6 },
];

export const initialGrns: GrnRecord[] = [
  { id: "grn-1", grnNumber: "GRN-0001", grnDate: "2026-06-01", poNumber: "PO-0004", supplier: "Medline Distributors", invoiceNumber: "INV-8841", invoiceDate: "2026-05-31", drug: "Paracetamol 500 mg", batchNumber: "PCM-2401", manufacturingDate: "2024-10-01", expiryDate: "2026-09-30", receivedQuantity: 1000, freeQuantity: 20, purchasePrice: 1.1, mrp: 2, status: "Received" },
  { id: "grn-2", grnNumber: "GRN-0002", grnDate: "2026-05-31", poNumber: "PO-0003", supplier: "Prime Medical", invoiceNumber: "INV-5512", invoiceDate: "2026-05-30", drug: "Pantoprazole 40 mg", batchNumber: "PAN-2412", manufacturingDate: "2024-12-01", expiryDate: "2026-11-30", receivedQuantity: 400, freeQuantity: 0, purchasePrice: 2.3, mrp: 5, status: "Partially Received" },
];

export const initialPurchaseReturns: PurchaseReturnRecord[] = [
  { id: "ret-1", returnNumber: "RET-0001", supplier: "Prime Medical", returnDate: "2026-06-01", reason: "Damaged", status: "Submitted", submittedBy: "Pharmacist", submittedDate: "2026-06-01", approvedBy: "", approvedDate: "", rejectedReason: "", drug: "Pantoprazole 40 mg", batch: "PAN-2412", returnQuantity: 10, purchasePrice: 2.3, amount: 23 },
  { id: "ret-2", returnNumber: "RET-0002", supplier: "Medline Distributors", returnDate: "2026-05-30", reason: "Wrong Item", status: "Returned", submittedBy: "Store Manager", submittedDate: "2026-05-30", approvedBy: "Hospital Admin", approvedDate: "2026-06-01", rejectedReason: "", drug: "Vitamin D3 Sachet", batch: "D3-2211", returnQuantity: 25, purchasePrice: 8, amount: 200 },
  { id: "ret-3", returnNumber: "RET-0003", supplier: "Care Pharma", returnDate: "2026-05-29", reason: "Expired", status: "Approved", submittedBy: "Pharmacist", submittedDate: "2026-05-29", approvedBy: "Hospital Admin", approvedDate: "2026-06-01", rejectedReason: "", drug: "Ondansetron Inj", batch: "OND-2309", returnQuantity: 12, purchasePrice: 18, amount: 216 },
];

export const purchaseStatuses = {
  pr: ["All status", "Submitted", "Approved", "Rejected"],
  po: ["All status", "Submitted", "Ordered", "Partially Received", "Received", "Closed", "Cancelled"],
  grn: ["All status", "Received", "Partially Received"],
  returns: ["All status", "Submitted", "Approved", "Rejected", "Returned"],
};
