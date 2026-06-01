"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckCircle2, Eye, MoreVertical, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ApprovalActions({ onView, onApprove, onReject }: { onView: () => void; onApprove: () => void; onReject: () => void }) {
  const itemClass = "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm font-medium text-foreground outline-none hover:bg-surface-muted focus:bg-surface-muted";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open approval actions">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="z-[130] min-w-40 rounded-md border border-border bg-white p-1 shadow-soft">
          <DropdownMenu.Item className={itemClass} onSelect={onView}><Eye className="h-4 w-4" />View</DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={onApprove}><CheckCircle2 className="h-4 w-4" />Approve</DropdownMenu.Item>
          <DropdownMenu.Item className={`${itemClass} text-danger focus:text-danger`} onSelect={onReject}><XCircle className="h-4 w-4" />Reject</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
