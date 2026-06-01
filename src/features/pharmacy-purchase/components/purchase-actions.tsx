"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Ban, Eye, MoreVertical, Pencil, Printer, Trash2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PurchaseActions({
  canEdit,
  canDelete,
  canCancel,
  canClose,
  canPrint,
  onView,
  onEdit,
  onDelete,
  onCancel,
  onClose,
  onPrint,
}: {
  canEdit?: boolean;
  canDelete?: boolean;
  canCancel?: boolean;
  canClose?: boolean;
  canPrint?: boolean;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  onPrint?: () => void;
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
          {onPrint ? <DropdownMenu.Item className={itemClass} disabled={!canPrint} onSelect={onPrint}><Printer className="h-4 w-4" />Print</DropdownMenu.Item> : null}
          {onCancel ? <DropdownMenu.Item className={itemClass} disabled={!canCancel} onSelect={onCancel}><XCircle className="h-4 w-4" />Cancel</DropdownMenu.Item> : null}
          {onClose ? <DropdownMenu.Item className={itemClass} disabled={!canClose} onSelect={onClose}><Ban className="h-4 w-4" />Close</DropdownMenu.Item> : null}
          {onDelete ? (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item className={`${itemClass} text-danger focus:text-danger`} disabled={!canDelete} onSelect={onDelete}><Trash2 className="h-4 w-4" />Delete</DropdownMenu.Item>
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
