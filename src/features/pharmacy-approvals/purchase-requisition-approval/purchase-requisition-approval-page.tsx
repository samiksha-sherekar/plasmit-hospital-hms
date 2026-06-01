"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ClipboardList } from "lucide-react";

import { ApprovalPage } from "@/features/pharmacy-approvals/components/approval-page";
import { purchaseRequisitionApprovals } from "@/features/pharmacy-approvals/data/approval-data";
import type { PurchaseRequisitionApproval } from "@/features/pharmacy-approvals/types";

const columns: ColumnDef<PurchaseRequisitionApproval>[] = [
  { header: "PR Number", accessorKey: "prNumber" },
  { header: "Date", accessorKey: "date" },
  { header: "Requested By", accessorKey: "requestedBy" },
  { header: "Drug Count", accessorKey: "drugCount" },
  { header: "Total Qty", accessorKey: "totalQty" },
  { header: "Remarks", accessorKey: "remarks" },
];

export function PurchaseRequisitionApprovalPage() {
  const memoColumns = React.useMemo(() => columns, []);
  return <ApprovalPage title="Purchase Requisition Approval" icon={ClipboardList} records={purchaseRequisitionApprovals} columns={memoColumns} searchText={(record) => `${record.prNumber} ${record.requestedBy} ${record.remarks} ${record.status}`} />;
}
