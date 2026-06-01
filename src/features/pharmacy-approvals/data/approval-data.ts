import type { PurchaseRequisitionApproval, PurchaseReturnApproval, StockAdjustmentApproval, StockTransferApproval } from "@/features/pharmacy-approvals/types";

const audit = {
  submittedBy: "Pharmacist",
  submittedDate: "2026-06-01",
  approvedBy: "",
  approvedDate: "",
  rejectedReason: "",
} as const;

export const purchaseRequisitionApprovals: PurchaseRequisitionApproval[] = [
  { id: "pra-1", prNumber: "PR-0001", date: "2026-06-01", requestedBy: "Pharmacy", drugCount: 3, totalQty: 760, remarks: "Reorder level crossed", status: "Submitted", ...audit },
  { id: "pra-2", prNumber: "PR-0002", date: "2026-05-31", requestedBy: "Main Store", drugCount: 2, totalQty: 420, remarks: "Monthly stock fill", status: "Approved", ...audit, approvedBy: "Hospital Admin", approvedDate: "2026-06-01" },
  { id: "pra-3", prNumber: "PR-0003", date: "2026-05-30", requestedBy: "OPD", drugCount: 1, totalQty: 100, remarks: "Extra stock request", status: "Rejected", ...audit, rejectedReason: "Sufficient stock available" },
];

export const stockAdjustmentApprovals: StockAdjustmentApproval[] = [
  { id: "saa-1", adjustmentNo: "ADJ-0001", date: "2026-06-01", drug: "Paracetamol 500 mg", batch: "PCM-2401", currentQty: 1250, adjustedQty: 1240, difference: -10, requestedBy: "Store Manager", remarks: "Damaged strips", status: "Submitted", ...audit },
  { id: "saa-2", adjustmentNo: "ADJ-0002", date: "2026-05-31", drug: "Cefixime 200 mg", batch: "CFX-2408", currentQty: 90, adjustedQty: 92, difference: 2, requestedBy: "Pharmacist", remarks: "Physical count difference", status: "Approved", ...audit, approvedBy: "Hospital Admin", approvedDate: "2026-06-01" },
];

export const stockTransferApprovals: StockTransferApproval[] = [
  { id: "sta-1", transferNo: "TRF-0001", fromStore: "Main Store", toStore: "Emergency Store", drug: "Ondansetron Inj", qty: 40, requestedBy: "Emergency Pharmacy", date: "2026-06-01", status: "Submitted", ...audit },
  { id: "sta-2", transferNo: "TRF-0002", fromStore: "Main Store", toStore: "OPD Pharmacy", drug: "Pantoprazole 40 mg", qty: 120, requestedBy: "OPD Pharmacy", date: "2026-05-31", status: "Approved", ...audit, approvedBy: "Hospital Admin", approvedDate: "2026-06-01" },
];

export const purchaseReturnApprovals: PurchaseReturnApproval[] = [
  { id: "pra-ret-1", returnNo: "RET-0001", supplier: "Prime Medical", drug: "Pantoprazole 40 mg", batch: "PAN-2412", qty: 10, reason: "Damaged", requestedBy: "Pharmacist", status: "Submitted", ...audit },
  { id: "pra-ret-2", returnNo: "RET-0002", supplier: "Medline Distributors", drug: "Vitamin D3 Sachet", batch: "D3-2211", qty: 25, reason: "Wrong Item", requestedBy: "Store Manager", status: "Rejected", ...audit, rejectedReason: "Supplier return window closed" },
];
