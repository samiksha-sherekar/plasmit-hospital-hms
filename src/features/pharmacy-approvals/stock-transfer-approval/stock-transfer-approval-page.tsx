"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Repeat } from "lucide-react";

import { ApprovalPage } from "@/features/pharmacy-approvals/components/approval-page";
import { stockTransferApprovals } from "@/features/pharmacy-approvals/data/approval-data";
import type { StockTransferApproval } from "@/features/pharmacy-approvals/types";

const columns: ColumnDef<StockTransferApproval>[] = [
  { header: "Transfer No", accessorKey: "transferNo" },
  { header: "From Store", accessorKey: "fromStore" },
  { header: "To Store", accessorKey: "toStore" },
  { header: "Drug", accessorKey: "drug" },
  { header: "Qty", accessorKey: "qty" },
  { header: "Requested By", accessorKey: "requestedBy" },
  { header: "Date", accessorKey: "date" },
];

export function StockTransferApprovalPage() {
  const memoColumns = React.useMemo(() => columns, []);
  return <ApprovalPage title="Stock Transfer Approval" icon={Repeat} records={stockTransferApprovals} columns={memoColumns} searchText={(record) => `${record.transferNo} ${record.fromStore} ${record.toStore} ${record.drug} ${record.requestedBy} ${record.status}`} />;
}
