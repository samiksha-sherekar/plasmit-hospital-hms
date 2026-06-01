"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";

import { ApprovalPage } from "@/features/pharmacy-approvals/components/approval-page";
import { purchaseReturnApprovals } from "@/features/pharmacy-approvals/data/approval-data";
import type { PurchaseReturnApproval } from "@/features/pharmacy-approvals/types";

const columns: ColumnDef<PurchaseReturnApproval>[] = [
  { header: "Return No", accessorKey: "returnNo" },
  { header: "Supplier", accessorKey: "supplier" },
  { header: "Drug", accessorKey: "drug" },
  { header: "Batch", accessorKey: "batch" },
  { header: "Qty", accessorKey: "qty" },
  { header: "Reason", accessorKey: "reason" },
  { header: "Requested By", accessorKey: "requestedBy" },
];

export function PurchaseReturnApprovalPage() {
  const memoColumns = React.useMemo(() => columns, []);
  return <ApprovalPage title="Purchase Return Approval" icon={RotateCcw} records={purchaseReturnApprovals} columns={memoColumns} searchText={(record) => `${record.returnNo} ${record.supplier} ${record.drug} ${record.batch} ${record.reason} ${record.requestedBy} ${record.status}`} />;
}
