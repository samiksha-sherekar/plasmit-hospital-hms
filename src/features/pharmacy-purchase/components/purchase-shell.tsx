"use client";

import type * as React from "react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { ProtectedOperations } from "@/features/operations/operations-shared";

export function PurchaseShell({
  title,
  icon: Icon,
  actionLabel = "Create",
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
          <PageHeader
            breadcrumbs={[
              { label: "Home", href: "/dashboard" },
              { label: "Purchase", href: "/pharmacy/purchase/requisition" },
              { label: title },
            ]}
            title={title}
            actions={onCreate ? <Button disabled={readOnly} onClick={onCreate}><Icon className="h-4 w-4" />{actionLabel}</Button> : null}
            className="static mx-0 border-b bg-transparent px-0 py-3"
          />
          <div className="space-y-4">{children}</div>
        </>
      )}
    </ProtectedOperations>
  );
}
