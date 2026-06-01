"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckCircle2, Eye, FileDown, MoreVertical, Pencil, Send, Trash2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function InventoryActions({
  canEdit,
  canApprove,
  canTransfer,
  canReceive,
  canExport,
  onView,
  onEdit,
  onApprove,
  onTransfer,
  onReceive,
  onExport,
  onDelete,
}: {
  canEdit?: boolean;
  canApprove?: boolean;
  canTransfer?: boolean;
  canReceive?: boolean;
  canExport?: boolean;
  onView: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onTransfer?: () => void;
  onReceive?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
}) {
  const itemClass = "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm font-medium text-foreground outline-none hover:bg-surface-muted focus:bg-surface-muted disabled:pointer-events-none disabled:opacity-50";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open actions">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="z-[130] min-w-40 rounded-md border border-border bg-white p-1 shadow-soft">
          <DropdownMenu.Item className={itemClass} onSelect={onView}><Eye className="h-4 w-4" />View</DropdownMenu.Item>
          {onEdit ? <DropdownMenu.Item className={itemClass} disabled={!canEdit} onSelect={onEdit}><Pencil className="h-4 w-4" />Edit</DropdownMenu.Item> : null}
          {onApprove ? <DropdownMenu.Item className={itemClass} disabled={!canApprove} onSelect={onApprove}><CheckCircle2 className="h-4 w-4" />Approve</DropdownMenu.Item> : null}
          {onTransfer ? <DropdownMenu.Item className={itemClass} disabled={!canTransfer} onSelect={onTransfer}><Send className="h-4 w-4" />Transfer</DropdownMenu.Item> : null}
          {onReceive ? <DropdownMenu.Item className={itemClass} disabled={!canReceive} onSelect={onReceive}><Undo2 className="h-4 w-4" />Receive</DropdownMenu.Item> : null}
          {onExport ? <DropdownMenu.Item className={itemClass} disabled={!canExport} onSelect={onExport}><FileDown className="h-4 w-4" />Export</DropdownMenu.Item> : null}
          {onDelete ? (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item className={`${itemClass} text-danger focus:text-danger`} onSelect={onDelete}><Trash2 className="h-4 w-4" />Delete</DropdownMenu.Item>
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
