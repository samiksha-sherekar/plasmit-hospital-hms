export type PurchaseMode = "create" | "view" | "edit";

export type ApprovalStatus = "Submitted" | "Approved" | "Rejected";
export type PurchaseRequisitionStatus = ApprovalStatus;
export type PurchaseOrderStatus = "Submitted" | "Ordered" | "Partially Received" | "Received" | "Closed" | "Cancelled";
export type PurchaseReturnStatus = ApprovalStatus | "Returned";

export type ApprovalAuditFields = {
  status: ApprovalStatus;
  submittedBy: string;
  submittedDate: string;
  approvedBy: string;
  approvedDate: string;
  rejectedReason: string;
};

export type PurchaseRequisitionRecord = {
  id: string;
  prNumber: string;
  date: string;
  requestedBy: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  remarks: string;
  status: PurchaseRequisitionStatus;
  submittedBy: string;
  submittedDate: string;
  approvedBy: string;
  approvedDate: string;
  rejectedReason: string;
  drug: string;
  requiredQuantity: number;
  currentStock: number;
  reorderLevel: number;
  itemRemarks: string;
};

export type PurchaseOrderRecord = {
  id: string;
  poNumber: string;
  poDate: string;
  supplier: string;
  expectedDeliveryDate: string;
  remarks: string;
  status: PurchaseOrderStatus;
  drug: string;
  orderedQuantity: number;
  unitPrice: number;
  discount: number;
  gst: number;
  amount: number;
};

export type GrnRecord = {
  id: string;
  grnNumber: string;
  grnDate: string;
  poNumber: string;
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  drug: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  receivedQuantity: number;
  freeQuantity: number;
  purchasePrice: number;
  mrp: number;
  status: "Received" | "Partially Received";
};

export type PurchaseReturnReason = "Damaged" | "Expired" | "Wrong Item" | "Excess Supply";

export type PurchaseReturnRecord = {
  id: string;
  returnNumber: string;
  supplier: string;
  returnDate: string;
  reason: PurchaseReturnReason;
  status: PurchaseReturnStatus;
  submittedBy: string;
  submittedDate: string;
  approvedBy: string;
  approvedDate: string;
  rejectedReason: string;
  drug: string;
  batch: string;
  returnQuantity: number;
  purchasePrice: number;
  amount: number;
};
