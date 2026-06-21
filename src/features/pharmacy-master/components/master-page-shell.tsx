"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProtectedOperations } from "@/features/operations/operations-shared";

export function MasterPageShell({
  title,
  icon: Icon,
  actionLabel,
  onCreate,
  children,
  actions,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  actionLabel: string;
  onCreate: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ProtectedOperations module="pharmacy">
      {() => (
        <>
          <PageHeader
            title={title}
            actions={actions ?? <Button onClick={onCreate}><Icon className="h-4 w-4" />{actionLabel}</Button>}
            className="static mx-0 border-b bg-transparent px-0 py-2"
          />
          <Card>
            <CardContent className="space-y-4 p-3">{children}</CardContent>
          </Card>
        </>
      )}
    </ProtectedOperations>
  );
}
