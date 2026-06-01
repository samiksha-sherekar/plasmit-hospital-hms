"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { PackageMinus } from "lucide-react";

import { ApprovalPage } from "@/features/pharmacy-approvals/components/approval-page";
import { stockAdjustmentApprovals } from "@/features/pharmacy-approvals/data/approval-data";
import type { StockAdjustmentApproval } from "@/features/pharmacy-approvals/types";

const columns: ColumnDef<StockAdjustmentApproval>[] = [
  { header: "Adjustment No", accessorKey: "adjustmentNo" },
  { header: "Date", accessorKey: "date" },
  { header: "Drug", accessorKey: "drug" },
  { header: "Batch", accessorKey: "batch" },
  { header: "Current Qty", accessorKey: "currentQty" },
  { header: "Adjusted Qty", accessorKey: "adjustedQty" },
  { header: "Difference", accessorKey: "difference" },
  { header: "Requested By", accessorKey: "requestedBy" },
];

export function StockAdjustmentApprovalPage() {
  const memoColumns = React.useMemo(() => columns, []);
  return <ApprovalPage title="Stock Adjustment Approval" icon={PackageMinus} records={stockAdjustmentApprovals} columns={memoColumns} searchText={(record) => `${record.adjustmentNo} ${record.drug} ${record.batch} ${record.requestedBy} ${record.status}`} />;
}
