export type LowStockReportRecord = {
  id: string;
  drugName: string;
  category: string;
  currentQty: number;
  reorderLevel: number;
  shortfall: number;
  location: string;
  status: "Low Stock" | "Ordered" | "Approved";
};

export type ExpiringStockReportRecord = {
  id: string;
  drugName: string;
  batchNo: string;
  expiryDate: string;
  daysLeft: number;
  qty: number;
  mrp: number;
  alert: "Within 30 days" | "Within 60 days" | "Within 90 days";
};

export type PurchaseReportRecord = {
  id: string;
  poNumber: string;
  poDate: string;
  supplier: string;
  drug: string;
  qty: number;
  amount: number;
  grnDone: "Yes" | "No" | "Partial";
  status: "Draft" | "Ordered" | "Partially Received" | "Received" | "Closed" | "Cancelled";
};
