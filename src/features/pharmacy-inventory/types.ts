export type InventoryMode = "create" | "view" | "edit";

export type CurrentStockRecord = {
  id: string;
  drug: string;
  batchNumber: string;
  availableQuantity: number;
  reservedQuantity: number;
  unit: string;
  storeLocation: string;
  reorderLevel: number;
  expiryDate: string;
  status: "Available" | "Low Stock" | "Expired";
};

export type BatchStockRecord = {
  id: string;
  drug: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  availableQuantity: number;
  purchasePrice: number;
  mrp: number;
  location: string;
  status: "Available" | "Near Expiry" | "Expired";
};

export type ExpiryTrackingRecord = {
  id: string;
  drug: string;
  batchNumber: string;
  expiryDate: string;
  daysRemaining: number;
  currentStock: number;
  location: string;
  status: "Safe" | "Near Expiry" | "Expired";
};

export type StockAdjustmentStatus = "Submitted" | "Approved" | "Rejected";
export type StockAdjustmentReason = "Damaged" | "Lost" | "Expired" | "Physical Count Difference";

export type StockAdjustmentRecord = {
  id: string;
  adjustmentNumber: string;
  date: string;
  drug: string;
  batch: string;
  currentQuantity: number;
  adjustedQuantity: number;
  difference: number;
  reason: StockAdjustmentReason;
  remarks: string;
  status: StockAdjustmentStatus;
  submittedBy: string;
  submittedDate: string;
  approvedBy: string;
  approvedDate: string;
  rejectedReason: string;
};

export type StockTransferStatus = "Submitted" | "Approved" | "Rejected" | "Transferred" | "Received";

export type StockTransferRecord = {
  id: string;
  transferNumber: string;
  fromStore: string;
  toStore: string;
  drug: string;
  batch: string;
  transferQuantity: number;
  transferDate: string;
  remarks: string;
  status: StockTransferStatus;
  submittedBy: string;
  submittedDate: string;
  approvedBy: string;
  approvedDate: string;
  rejectedReason: string;
};
