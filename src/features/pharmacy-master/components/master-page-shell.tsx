"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { ProtectedOperations } from "@/features/operations/operations-shared";

export function MasterPageShell({
  title,
  breadcrumbTitle = title,
  icon: Icon,
  actionLabel,
  onCreate,
  children,
}: {
  title: string;
  breadcrumbTitle?: string;
  description?: string;
  icon: LucideIcon;
  actionLabel: string;
  onCreate: () => void;
  children: React.ReactNode;
}) {
  return (
    <ProtectedOperations module="pharmacy">
      {() => (
        <>
          <PageHeader
            eyebrow={`Home / Masters / ${breadcrumbTitle}`}
            title={title}
            actions={
              <Button onClick={onCreate}><Icon className="h-4 w-4" />{actionLabel}</Button>
            }
            className="static mx-0 border-b bg-transparent px-0 py-3"
          />
          <div className="space-y-4">{children}</div>
        </>
      )}
    </ProtectedOperations>
  );
}
