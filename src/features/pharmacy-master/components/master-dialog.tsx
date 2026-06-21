"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as React from "react";
import { ClipboardCheck, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Drawer } from "@/components/ui/drawer";

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
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={description}
        className="w-[calc(100vw-2rem)] max-w-3xl"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>{onDelete ? <Button variant="danger" onClick={() => setConfirmDelete(true)}><Trash2 className="h-4 w-4" />{deleteLabel}</Button> : null}</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={onSubmit}><ClipboardCheck className="h-4 w-4" />{submitLabel}</Button>
            </div>
          </div>
        }
      >
        {children}
      </Drawer>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        description="Are you sure you want to delete this record? This action cannot be undone in the current screen."
        onConfirm={() => onDelete?.()}
      />
    </>
  );
}
