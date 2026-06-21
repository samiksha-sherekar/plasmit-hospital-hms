"use client";

import type * as React from "react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shell/page-header";
import { ProtectedOperations } from "@/features/operations/operations-shared";

export function InventoryShell({
  title,
  icon: Icon,
  actionLabel,
  onCreate,
  children,
}: {
  title: string;
  icon: LucideIcon;
  actionLabel?: string;
  onCreate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <ProtectedOperations module="pharmacy">
      {({ readOnly }) => (
        <>
          <PageHeader title={title} className="static mx-0 border-b bg-transparent px-0 py-2" />
          <div className="space-y-4">{children}</div>
        </>
      )}
    </ProtectedOperations>
  );
}
