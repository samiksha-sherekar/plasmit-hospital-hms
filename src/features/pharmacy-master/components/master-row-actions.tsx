"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { Copy, EllipsisVertical, Pencil, Power, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function MasterRowActions({
  onEdit,
  onToggle,
  onDelete,
  onClone,
}: {
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onClone?: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const itemClass = "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm font-medium text-foreground outline-none hover:bg-surface-muted focus:bg-surface-muted";

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button size="icon" variant="ghost" aria-label="Open row actions">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="end" className="z-[130] min-w-44 rounded-md border border-border bg-white p-1 shadow-soft">
            <DropdownMenu.Item className={itemClass} onSelect={onEdit}><Pencil className="h-4 w-4" />Edit</DropdownMenu.Item>
            {onClone ? <DropdownMenu.Item className={itemClass} onSelect={onClone}><Copy className="h-4 w-4" />Clone</DropdownMenu.Item> : null}
            <DropdownMenu.Item className={itemClass} onSelect={onToggle}><Power className="h-4 w-4" />Active / Inactive</DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-border" />
            <DropdownMenu.Item className={`${itemClass} text-danger focus:text-danger`} onSelect={() => setConfirmDelete(true)}><Trash2 className="h-4 w-4" />Delete</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        description="Are you sure you want to delete this record? This action cannot be undone in the current screen."
        onConfirm={onDelete}
      />
    </>
  );
}
