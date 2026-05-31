"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/features/admin/admin-shared";
import { ProtectedOperations } from "@/features/operations/operations-shared";
import { listPharmacyWorkflowRecords, type PharmacyWorkflowRecord } from "@/features/pharmacy-workflows/pharmacy-workflow-service";

export function PharmacyWorkflowPage({
  title,
  breadcrumb,
  workflow,
  icon: Icon,
}: {
  title: string;
  breadcrumb: string;
  workflow: string;
  icon: LucideIcon;
}) {
  const [records, setRecords] = React.useState<PharmacyWorkflowRecord[]>([]);

  React.useEffect(() => {
    void listPharmacyWorkflowRecords(workflow).then(setRecords);
  }, [workflow]);

  const columns = React.useMemo<ColumnDef<PharmacyWorkflowRecord>[]>(() => [
    { header: "Reference", accessorKey: "reference" },
    { header: "Owner", accessorKey: "owner" },
    { header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "Updated", accessorKey: "updatedAt" },
  ], []);

  return (
    <ProtectedOperations module="pharmacy">
      {() => (
        <>
          <PageHeader
            eyebrow={`${breadcrumb}${title}`}
            title={title}
            actions={<Button><Icon className="h-4 w-4" />New</Button>}
            className="static mx-0 border-b bg-transparent px-0 py-3"
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
        </>
      )}
    </ProtectedOperations>
  );
}
