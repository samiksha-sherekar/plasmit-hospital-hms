"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/ui/data-table";
import { FilterBar, NativeSelect, StatusBadge } from "@/features/admin/admin-shared";
import { ApprovalActions } from "@/features/pharmacy-approvals/components/approval-actions";
import { ApprovalDetailDialog } from "@/features/pharmacy-approvals/components/approval-detail";
import { ApprovalShell } from "@/features/pharmacy-approvals/components/approval-shell";
import type { ApprovalAudit } from "@/features/pharmacy-approvals/types";

type ApprovalRecord = ApprovalAudit & { id: string };

export function ApprovalPage<TRecord extends ApprovalRecord>({
  title,
  icon,
  records: initialRecords,
  columns,
  searchText,
}: {
  title: string;
  icon: LucideIcon;
  records: TRecord[];
  columns: ColumnDef<TRecord>[];
  searchText: (record: TRecord) => string;
}) {
  const [records, setRecords] = React.useState(initialRecords);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All status");
  const [selected, setSelected] = React.useState<TRecord | null>(null);

  const filtered = records.filter((record) => searchText(record).toLowerCase().includes(search.toLowerCase()) && (status === "All status" || record.status === status));
  const tableColumns = React.useMemo<ColumnDef<TRecord>[]>(() => [
    ...columns,
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      header: "Action",
      cell: ({ row }) => (
        <ApprovalActions
          onView={() => setSelected(row.original)}
          onApprove={() => updateApproval(row.original.id, "Approved")}
          onReject={() => updateApproval(row.original.id, "Rejected")}
        />
      ),
    },
  ], [columns]);

  function updateApproval(id: string, nextStatus: "Approved" | "Rejected") {
    setRecords((current) => current.map((record) => record.id === id ? {
      ...record,
      status: nextStatus,
      approvedBy: nextStatus === "Approved" ? "Hospital Admin" : "",
      approvedDate: nextStatus === "Approved" ? new Date().toISOString().slice(0, 10) : "",
      rejectedReason: nextStatus === "Rejected" ? "Rejected from approval queue" : "",
    } as TRecord : record));
    toast.success(`${title} ${nextStatus.toLowerCase()}`);
  }

  return (
    <ApprovalShell title={title} icon={icon}>
      <FilterBar search={search} onSearch={setSearch} placeholder={`Search ${title.toLowerCase()}...`}>
        <NativeSelect label="Status" value={status} onChange={setStatus} options={["All status", "Submitted", "Approved", "Rejected"]} />
      </FilterBar>
      <DataTable data={filtered} columns={tableColumns} />
      <ApprovalDetailDialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} title={`View ${title}`} record={selected} />
    </ApprovalShell>
  );
}
