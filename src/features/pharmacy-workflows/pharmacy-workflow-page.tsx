"use client";

import * as React from "react";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/features/admin/admin-shared";
import { ProtectedOperations } from "@/features/operations/operations-shared";
import { getPharmacyWorkflowColumns, listPharmacyWorkflowRecords, type PharmacyWorkflowRecord } from "@/features/pharmacy-workflows/pharmacy-workflow-service";

export function PharmacyWorkflowPage({
  title,
  workflow,
  icon: Icon,
}: {
  title: string;
  workflow: string;
  icon: LucideIcon;
}) {
  const [records, setRecords] = React.useState<PharmacyWorkflowRecord[]>([]);
  const [deleteTarget, setDeleteTarget] = React.useState<PharmacyWorkflowRecord | null>(null);

  React.useEffect(() => {
    void listPharmacyWorkflowRecords(workflow).then(setRecords);
  }, [workflow]);

  const columns = React.useMemo<ColumnDef<PharmacyWorkflowRecord>[]>(() => [
    ...getPharmacyWorkflowColumns(workflow).map((column) => ({
      id: column.key,
      header: column.header,
      accessorFn: (row: PharmacyWorkflowRecord) => row.values[column.key] ?? "-",
      cell: ({ row }: CellContext<PharmacyWorkflowRecord, unknown>) => column.key === "status" ? <StatusBadge status={row.original.status} /> : row.original.values[column.key] ?? "-",
    })),
    {
      header: "Actions",
      cell: ({ row }) => (
        <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(row.original)}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      ),
    },
  ], [workflow]);

  function removeRecord(record: PharmacyWorkflowRecord) {
    setRecords((current) => current.filter((item) => item.id !== record.id));
    toast.success("Record deleted");
  }

  return (
    <ProtectedOperations module="pharmacy">
      {() => (
        <>
          <PageHeader
            title={title}
            actions={<Button><Icon className="h-4 w-4" />New</Button>}
            className="static mx-0 border-b bg-transparent px-0 py-2"
          />
          <Card>
            <CardContent className="space-y-3 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Plus className="h-4 w-4 text-muted-foreground" />
                API-ready workspace
              </div>
              <DataTable data={records} columns={columns} />
            </CardContent>
          </Card>
          <ConfirmDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            description={`Are you sure you want to delete ${deleteLabel(deleteTarget)}? This action cannot be undone in the current screen.`}
            onConfirm={() => {
              if (deleteTarget) removeRecord(deleteTarget);
              setDeleteTarget(null);
            }}
          />
        </>
      )}
    </ProtectedOperations>
  );
}

function deleteLabel(record: PharmacyWorkflowRecord | null) {
  if (!record) return "this record";
  return record.values.prNumber ?? record.values.poNumber ?? record.values.grnNumber ?? record.values.returnNumber ?? record.values.drug ?? "this record";
}
