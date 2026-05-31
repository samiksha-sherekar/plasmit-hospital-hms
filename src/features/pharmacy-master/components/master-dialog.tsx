"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ClipboardCheck, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MasterDialog({
  open,
  title,
  description,
  children,
  submitLabel,
  deleteLabel = "Delete",
  onOpenChange,
  onSubmit,
  onDelete,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel: string;
  deleteLabel?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onDelete?: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-soft outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-border bg-white px-4 py-3">
            <div>
              <Dialog.Title className="text-sm font-bold text-foreground">{title}</Dialog.Title>
              {description ? <Dialog.Description className="mt-1 text-xs font-medium text-muted-foreground">{description}</Dialog.Description> : null}
            </div>
            <Dialog.Close asChild>
              <Button size="icon" variant="ghost" aria-label="Close dialog">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
          <div className="border-t border-border bg-white p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>{onDelete ? <Button variant="danger" onClick={onDelete}><Trash2 className="h-4 w-4" />{deleteLabel}</Button> : null}</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}><X className="h-4 w-4" />Cancel</Button>
                <Button onClick={onSubmit}><ClipboardCheck className="h-4 w-4" />{submitLabel}</Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
