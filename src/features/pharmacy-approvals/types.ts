export type ApprovalStatus = "Submitted" | "Approved" | "Rejected";

export type ApprovalAudit = {
  status: ApprovalStatus;
  submittedBy: string;
  submittedDate: string;
  approvedBy: string;
  approvedDate: string;
  rejectedReason: string;
};

export type PurchaseRequisitionApproval = ApprovalAudit & {
  id: string;
  prNumber: string;
  date: string;
  requestedBy: string;
  drugCount: number;
  totalQty: number;
  remarks: string;
};

export type StockAdjustmentApproval = ApprovalAudit & {
  id: string;
  adjustmentNo: string;
  date: string;
  drug: string;
  batch: string;
  currentQty: number;
  adjustedQty: number;
  difference: number;
  requestedBy: string;
  remarks: string;
};

export type StockTransferApproval = ApprovalAudit & {
  id: string;
  transferNo: string;
  fromStore: string;
  toStore: string;
  drug: string;
  qty: number;
  requestedBy: string;
  date: string;
};

export type PurchaseReturnApproval = ApprovalAudit & {
  id: string;
  returnNo: string;
  supplier: string;
  drug: string;
  batch: string;
  qty: number;
  reason: string;
  requestedBy: string;
};
