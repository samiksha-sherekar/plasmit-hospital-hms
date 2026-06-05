"use client";

import type * as React from "react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shell/page-header";
import { ProtectedOperations } from "@/features/operations/operations-shared";

export function ReportPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ProtectedOperations module="pharmacy">
      {() => (
        <>
          <PageHeader
            title={title}
            
            className="static mx-0 border-b bg-transparent px-0 py-2"
          />
          <div className="space-y-4">{children}</div>
        </>
      )}
    </ProtectedOperations>
  );
}
