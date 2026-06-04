export type PharmacyWorkflowStatus =
  | "Active"
  | "Available"
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Rejected"
  | "Ordered"
  | "Partially Received"
  | "Received"
  | "Closed"
  | "Cancelled"
  | "Expired"
  | "Expiring Soon"
  | "Low Stock"
  | "Completed"
  | "In Transit"
  | "Returned";

export type PharmacyWorkflowRecord = {
  id: string;
  status: PharmacyWorkflowStatus;
  values: Record<string, string>;
};

export type PharmacyWorkflowColumn = {
  key: string;
  header: string;
};

const workflowColumns: Record<string, PharmacyWorkflowColumn[]> = {
  "current-stock": [
    { key: "drug", header: "Drug" },
    { key: "category", header: "Category" },
    { key: "batchNo", header: "Batch No" },
    { key: "availableQty", header: "Available Qty" },
    { key: "reservedQty", header: "Reserved Qty" },
    { key: "unit", header: "Unit" },
    { key: "storeLocation", header: "Store Location" },
    { key: "reorderLevel", header: "Reorder Level" },
    { key: "expiryDate", header: "Expiry Date" },
    { key: "status", header: "Status" },
  ],
  "batch-stock": [
    { key: "drug", header: "Drug" },
    { key: "batchNumber", header: "Batch Number" },
    { key: "manufacturingDate", header: "Manufacturing Date" },
    { key: "expiryDate", header: "Expiry Date" },
    { key: "purchasePrice", header: "Purchase Price" },
    { key: "mrp", header: "MRP" },
    { key: "availableQty", header: "Available Qty" },
    { key: "location", header: "Location" },
    { key: "status", header: "Status" },
  ],
  "expiry-tracking": [
    { key: "drug", header: "Drug" },
    { key: "batchNumber", header: "Batch Number" },
    { key: "expiryDate", header: "Expiry Date" },
    { key: "daysRemaining", header: "Days Remaining" },
    { key: "currentStock", header: "Current Stock" },
    { key: "location", header: "Location" },
    { key: "status", header: "Status" },
  ],
  "stock-adjustment": [
    { key: "adjustmentNumber", header: "Adjustment Number" },
    { key: "date", header: "Date" },
    { key: "drug", header: "Drug" },
    { key: "batch", header: "Batch" },
    { key: "currentQty", header: "Current Qty" },
    { key: "adjustedQty", header: "Adjusted Qty" },
    { key: "difference", header: "Difference" },
    { key: "reason", header: "Reason" },
    { key: "remarks", header: "Remarks" },
    { key: "createdBy", header: "Created By" },
  ],
  "stock-transfer": [
    { key: "transferNumber", header: "Transfer Number" },
    { key: "fromStore", header: "From Store" },
    { key: "toStore", header: "To Store" },
    { key: "drug", header: "Drug" },
    { key: "batch", header: "Batch" },
    { key: "transferQty", header: "Transfer Qty" },
    { key: "transferDate", header: "Transfer Date" },
    { key: "remarks", header: "Remarks" },
    { key: "status", header: "Status" },
  ],
  "purchase-requisition": [
    { key: "prNumber", header: "PR Number" },
    { key: "date", header: "Date" },
    { key: "requestedBy", header: "Requested By" },
    { key: "priority", header: "Priority" },
    { key: "drug", header: "Drug" },
    { key: "requiredQty", header: "Required Qty" },
    { key: "currentStock", header: "Current Stock" },
    { key: "reorderLevel", header: "Reorder Level" },
    { key: "remarks", header: "Remarks" },
    { key: "status", header: "Status" },
  ],
  "purchase-order": [
    { key: "poNumber", header: "PO Number" },
    { key: "poDate", header: "PO Date" },
    { key: "supplier", header: "Supplier" },
    { key: "expectedDeliveryDate", header: "Expected Delivery Date" },
    { key: "drug", header: "Drug" },
    { key: "orderedQty", header: "Ordered Qty" },
    { key: "unitPrice", header: "Unit Price" },
    { key: "discount", header: "Discount" },
    { key: "gst", header: "GST" },
    { key: "amount", header: "Amount" },
    { key: "remarks", header: "Remarks" },
    { key: "status", header: "Status" },
  ],
  "goods-receipt-note": [
    { key: "grnNumber", header: "GRN Number" },
    { key: "grnDate", header: "GRN Date" },
    { key: "poNumber", header: "PO Number" },
    { key: "supplier", header: "Supplier" },
    { key: "invoiceNumber", header: "Invoice Number" },
    { key: "invoiceDate", header: "Invoice Date" },
    { key: "drug", header: "Drug" },
    { key: "batchNumber", header: "Batch Number" },
    { key: "manufacturingDate", header: "Manufacturing Date" },
    { key: "expiryDate", header: "Expiry Date" },
    { key: "receivedQty", header: "Received Qty" },
    { key: "freeQty", header: "Free Qty" },
    { key: "purchasePrice", header: "Purchase Price" },
    { key: "mrp", header: "MRP" },
    { key: "gst", header: "GST" },
  ],
  "purchase-return": [
    { key: "returnNumber", header: "Return Number" },
    { key: "supplier", header: "Supplier" },
    { key: "returnDate", header: "Return Date" },
    { key: "reason", header: "Reason" },
    { key: "drug", header: "Drug" },
    { key: "batch", header: "Batch" },
    { key: "returnQty", header: "Return Qty" },
    { key: "purchasePrice", header: "Purchase Price" },
    { key: "amount", header: "Amount" },
    { key: "status", header: "Status" },
  ],
  "low-stock-report": [
    { key: "drugName", header: "Drug name" },
    { key: "category", header: "Category" },
    { key: "currentQty", header: "Current qty" },
    { key: "reorderLevel", header: "Reorder level" },
    { key: "shortfall", header: "Shortfall" },
    { key: "location", header: "Location" },
    { key: "status", header: "Status" },
  ],
  "expiring-stock-report": [
    { key: "drugName", header: "Drug name" },
    { key: "batchNo", header: "Batch no." },
    { key: "expiryDate", header: "Expiry date" },
    { key: "daysLeft", header: "Days left" },
    { key: "qty", header: "Qty" },
    { key: "mrp", header: "MRP (₹)" },
    { key: "alert", header: "Alert" },
  ],
  "purchase-report": [
    { key: "poNumber", header: "PO no." },
    { key: "poDate", header: "PO date" },
    { key: "supplier", header: "Supplier" },
    { key: "drug", header: "Drug" },
    { key: "qty", header: "Qty" },
    { key: "amount", header: "Amount (₹)" },
    { key: "grnDone", header: "GRN done" },
    { key: "status", header: "Status" },
  ],
};

const seedRows: Record<string, Omit<PharmacyWorkflowRecord, "id">[]> = {
  "current-stock": [
    { status: "Available", values: { drug: "Paracetamol 500 mg", category: "Analgesic", batchNo: "PCM-2401", availableQty: "1,240", reservedQty: "80", unit: "Tablet", storeLocation: "Main Store / R1", reorderLevel: "300", expiryDate: "30 Sep 2026", status: "Available" } },
    { status: "Low Stock", values: { drug: "Cefixime 200 mg", category: "Antibiotic", batchNo: "CFX-2408", availableQty: "92", reservedQty: "12", unit: "Tablet", storeLocation: "Pharmacy / A2", reorderLevel: "150", expiryDate: "18 Jan 2027", status: "Low Stock" } },
  ],
  "batch-stock": [
    { status: "Available", values: { drug: "Pantoprazole 40 mg", batchNumber: "PAN-2412", manufacturingDate: "01 Dec 2024", expiryDate: "30 Nov 2026", purchasePrice: "2.40", mrp: "5.00", availableQty: "640", location: "Main Store / P2", status: "Available" } },
    { status: "Expiring Soon", values: { drug: "Ondansetron Inj", batchNumber: "OND-2309", manufacturingDate: "12 Sep 2023", expiryDate: "15 Aug 2026", purchasePrice: "18.00", mrp: "34.00", availableQty: "86", location: "Emergency Store", status: "Expiring Soon" } },
  ],
  "expiry-tracking": [
    { status: "Expiring Soon", values: { drug: "Ondansetron Inj", batchNumber: "OND-2309", expiryDate: "15 Aug 2026", daysRemaining: "75", currentStock: "86", location: "Emergency Store", status: "Expiring Soon" } },
    { status: "Expired", values: { drug: "Vitamin D3 Sachet", batchNumber: "D3-2211", expiryDate: "20 May 2026", daysRemaining: "Expired", currentStock: "14", location: "Hold Rack", status: "Expired" } },
  ],
  "stock-adjustment": [
    { status: "Completed", values: { adjustmentNumber: "ADJ-0001", date: "01 Jun 2026", drug: "Paracetamol 500 mg", batch: "PCM-2401", currentQty: "1,250", adjustedQty: "1,240", difference: "-10", reason: "Physical count", remarks: "Damaged strips removed", createdBy: "Pharmacist" } },
    { status: "Completed", values: { adjustmentNumber: "ADJ-0002", date: "31 May 2026", drug: "Cefixime 200 mg", batch: "CFX-2408", currentQty: "90", adjustedQty: "92", difference: "+2", reason: "Recount", remarks: "Found in transit bin", createdBy: "Store Manager" } },
  ],
  "stock-transfer": [
    { status: "In Transit", values: { transferNumber: "TRF-0001", fromStore: "Main Store", toStore: "Emergency Store", drug: "Ondansetron Inj", batch: "OND-2309", transferQty: "40", transferDate: "01 Jun 2026", remarks: "Night duty buffer", status: "In Transit" } },
    { status: "Completed", values: { transferNumber: "TRF-0002", fromStore: "Main Store", toStore: "OPD Pharmacy", drug: "Pantoprazole 40 mg", batch: "PAN-2412", transferQty: "120", transferDate: "31 May 2026", remarks: "Routine replenishment", status: "Completed" } },
  ],
  "purchase-requisition": [
    { status: "Draft", values: { prNumber: "PR-0001", date: "01 Jun 2026", requestedBy: "Pharmacy", priority: "High", drug: "Cefixime 200 mg", requiredQty: "500", currentStock: "92", reorderLevel: "150", remarks: "Reorder level crossed", status: "Draft" } },
    { status: "Submitted", values: { prNumber: "PR-0002", date: "31 May 2026", requestedBy: "Main Store", priority: "Normal", drug: "NS 500 ml", requiredQty: "300", currentStock: "110", reorderLevel: "200", remarks: "Monthly purchase", status: "Submitted" } },
    { status: "Approved", values: { prNumber: "PR-0003", date: "30 May 2026", requestedBy: "Emergency", priority: "Urgent", drug: "Adrenaline Inj", requiredQty: "100", currentStock: "24", reorderLevel: "50", remarks: "Crash cart reserve", status: "Approved" } },
    { status: "Rejected", values: { prNumber: "PR-0004", date: "29 May 2026", requestedBy: "OPD", priority: "Low", drug: "Vitamin C", requiredQty: "100", currentStock: "260", reorderLevel: "80", remarks: "Sufficient stock", status: "Rejected" } },
  ],
  "purchase-order": [
    { status: "Draft", values: { poNumber: "PO-0001", poDate: "01 Jun 2026", supplier: "Medline Distributors", expectedDeliveryDate: "05 Jun 2026", drug: "Cefixime 200 mg", orderedQty: "500", unitPrice: "7.50", discount: "2%", gst: "12%", amount: "3,675.00", remarks: "Against PR-0001", status: "Draft" } },
    { status: "Ordered", values: { poNumber: "PO-0002", poDate: "31 May 2026", supplier: "Care Pharma", expectedDeliveryDate: "04 Jun 2026", drug: "NS 500 ml", orderedQty: "300", unitPrice: "22.00", discount: "0%", gst: "5%", amount: "6,930.00", remarks: "Monthly purchase", status: "Ordered" } },
    { status: "Partially Received", values: { poNumber: "PO-0003", poDate: "28 May 2026", supplier: "Prime Medical", expectedDeliveryDate: "01 Jun 2026", drug: "Pantoprazole 40 mg", orderedQty: "800", unitPrice: "2.30", discount: "1%", gst: "12%", amount: "2,039.52", remarks: "Balance pending", status: "Partially Received" } },
    { status: "Received", values: { poNumber: "PO-0004", poDate: "25 May 2026", supplier: "Medline Distributors", expectedDeliveryDate: "29 May 2026", drug: "Paracetamol 500 mg", orderedQty: "1,000", unitPrice: "1.10", discount: "0%", gst: "12%", amount: "1,232.00", remarks: "GRN completed", status: "Received" } },
    { status: "Closed", values: { poNumber: "PO-0005", poDate: "20 May 2026", supplier: "Care Pharma", expectedDeliveryDate: "24 May 2026", drug: "Syringe 5 ml", orderedQty: "500", unitPrice: "3.00", discount: "3%", gst: "12%", amount: "1,629.60", remarks: "Closed by purchase", status: "Closed" } },
    { status: "Cancelled", values: { poNumber: "PO-0006", poDate: "18 May 2026", supplier: "Prime Medical", expectedDeliveryDate: "22 May 2026", drug: "Vitamin C", orderedQty: "200", unitPrice: "1.80", discount: "0%", gst: "12%", amount: "403.20", remarks: "Supplier unavailable", status: "Cancelled" } },
  ],
  "goods-receipt-note": [
    { status: "Received", values: { grnNumber: "GRN-0001", grnDate: "01 Jun 2026", poNumber: "PO-0004", supplier: "Medline Distributors", invoiceNumber: "INV-8841", invoiceDate: "31 May 2026", drug: "Paracetamol 500 mg", batchNumber: "PCM-2401", manufacturingDate: "01 Oct 2024", expiryDate: "30 Sep 2026", receivedQty: "1,000", freeQty: "20", purchasePrice: "1.10", mrp: "2.00", gst: "12%" } },
    { status: "Partially Received", values: { grnNumber: "GRN-0002", grnDate: "31 May 2026", poNumber: "PO-0003", supplier: "Prime Medical", invoiceNumber: "INV-5512", invoiceDate: "30 May 2026", drug: "Pantoprazole 40 mg", batchNumber: "PAN-2412", manufacturingDate: "01 Dec 2024", expiryDate: "30 Nov 2026", receivedQty: "400", freeQty: "0", purchasePrice: "2.30", mrp: "5.00", gst: "12%" } },
  ],
  "purchase-return": [
    { status: "Submitted", values: { returnNumber: "RET-0001", supplier: "Prime Medical", returnDate: "01 Jun 2026", reason: "Damaged", drug: "Pantoprazole 40 mg", batch: "PAN-2412", returnQty: "10", purchasePrice: "2.30", amount: "23.00", status: "Submitted" } },
    { status: "Returned", values: { returnNumber: "RET-0002", supplier: "Medline Distributors", returnDate: "30 May 2026", reason: "Wrong Item", drug: "Vitamin D3 Sachet", batch: "D3-2211", returnQty: "25", purchasePrice: "8.00", amount: "200.00", status: "Returned" } },
    { status: "Approved", values: { returnNumber: "RET-0003", supplier: "Care Pharma", returnDate: "29 May 2026", reason: "Expired", drug: "Ondansetron Inj", batch: "OND-2309", returnQty: "12", purchasePrice: "18.00", amount: "216.00", status: "Approved" } },
    { status: "Draft", values: { returnNumber: "RET-0004", supplier: "Prime Medical", returnDate: "28 May 2026", reason: "Excess Supply", drug: "NS 500 ml", batch: "NS-2502", returnQty: "30", purchasePrice: "22.00", amount: "660.00", status: "Draft" } },
  ],
  "low-stock-report": [
    { status: "Low Stock", values: { drugName: "Cefixime 200 mg", category: "Antibiotic", currentQty: "92", reorderLevel: "150", shortfall: "58", location: "Pharmacy / A2", status: "Low Stock" } },
    { status: "Low Stock", values: { drugName: "NS 500 ml", category: "IV Fluid", currentQty: "110", reorderLevel: "200", shortfall: "90", location: "Main Store / F1", status: "Low Stock" } },
    { status: "Approved", values: { drugName: "Adrenaline Inj", category: "Emergency", currentQty: "24", reorderLevel: "50", shortfall: "26", location: "Crash Cart Store", status: "Approved" } },
    { status: "Ordered", values: { drugName: "Pantoprazole 40 mg", category: "Gastro", currentQty: "132", reorderLevel: "180", shortfall: "48", location: "OPD Pharmacy / P2", status: "Ordered" } },
  ],
  "expiring-stock-report": [
    { status: "Expiring Soon", values: { drugName: "Ondansetron Inj", batchNo: "OND-2309", expiryDate: "15 Jun 2026", daysLeft: "10", qty: "86", mrp: "34.00", alert: "Within 30 days" } },
    { status: "Expiring Soon", values: { drugName: "Vitamin D3 Sachet", batchNo: "D3-2407", expiryDate: "28 Jun 2026", daysLeft: "23", qty: "42", mrp: "18.00", alert: "Within 30 days" } },
    { status: "Expiring Soon", values: { drugName: "Pantoprazole 40 mg", batchNo: "PAN-2412", expiryDate: "25 Jul 2026", daysLeft: "50", qty: "640", mrp: "5.00", alert: "Within 60 days" } },
    { status: "Expiring Soon", values: { drugName: "Paracetamol 500 mg", batchNo: "PCM-2401", expiryDate: "30 Aug 2026", daysLeft: "86", qty: "1,240", mrp: "2.00", alert: "Within 90 days" } },
  ],
  "purchase-report": [
    { status: "Draft", values: { poNumber: "PO-0001", poDate: "01 Jun 2026", supplier: "Medline Distributors", drug: "Cefixime 200 mg", qty: "500", amount: "3,675.00", grnDone: "No", status: "Draft" } },
    { status: "Ordered", values: { poNumber: "PO-0002", poDate: "31 May 2026", supplier: "Care Pharma", drug: "NS 500 ml", qty: "300", amount: "6,930.00", grnDone: "No", status: "Ordered" } },
    { status: "Partially Received", values: { poNumber: "PO-0003", poDate: "28 May 2026", supplier: "Prime Medical", drug: "Pantoprazole 40 mg", qty: "800", amount: "2,039.52", grnDone: "Partial", status: "Partially Received" } },
    { status: "Received", values: { poNumber: "PO-0004", poDate: "25 May 2026", supplier: "Medline Distributors", drug: "Paracetamol 500 mg", qty: "1,000", amount: "1,232.00", grnDone: "Yes", status: "Received" } },
    { status: "Closed", values: { poNumber: "PO-0005", poDate: "20 May 2026", supplier: "Care Pharma", drug: "Syringe 5 ml", qty: "500", amount: "1,629.60", grnDone: "Yes", status: "Closed" } },
    { status: "Cancelled", values: { poNumber: "PO-0006", poDate: "18 May 2026", supplier: "Prime Medical", drug: "Vitamin C", qty: "200", amount: "403.20", grnDone: "No", status: "Cancelled" } },
  ],
};

export function getPharmacyWorkflowColumns(workflow: string): PharmacyWorkflowColumn[] {
  return workflowColumns[workflow] ?? [
    { key: "reference", header: "Reference" },
    { key: "owner", header: "Owner" },
    { key: "status", header: "Status" },
    { key: "updatedAt", header: "Updated" },
  ];
}

export async function listPharmacyWorkflowRecords(workflow: string): Promise<PharmacyWorkflowRecord[]> {
  const rows = seedRows[workflow] ?? [
    { status: "Active", values: { reference: `${workflow.toUpperCase()}-001`, owner: "Pharmacy", status: "Active", updatedAt: "Today" } },
    { status: "Submitted", values: { reference: `${workflow.toUpperCase()}-002`, owner: "Pharmacist", status: "Submitted", updatedAt: "Yesterday" } },
  ];

  return expandRows(workflow, rows);
}

function expandRows(workflow: string, rows: Omit<PharmacyWorkflowRecord, "id">[]) {
  return Array.from({ length: 12 }, (_, index) => {
    const row = rows[index % rows.length];
    return {
      ...row,
      id: `${workflow}-${String(index + 1).padStart(3, "0")}`,
      values: suffixNumberedFields(row.values, index + 1),
    };
  });
}

function suffixNumberedFields(values: Record<string, string>, rowNumber: number) {
  const next = { ...values };
  for (const key of ["prNumber", "poNumber", "grnNumber", "returnNumber", "adjustmentNumber", "transferNumber"]) {
    if (next[key]) next[key] = next[key].replace(/\d+$/, String(rowNumber).padStart(4, "0"));
  }
  return next;
}
