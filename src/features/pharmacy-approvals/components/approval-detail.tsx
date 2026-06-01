"use client";

import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { FormGrid, TextareaField, TextField } from "@/features/pharmacy-master/components/master-fields";
import type { ApprovalAudit } from "@/features/pharmacy-approvals/types";

export function ApprovalDetailDialog({
  open,
  title,
  record,
  onOpenChange,
}: {
  open: boolean;
  title: string;
  record: (ApprovalAudit & object) | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <MasterDialog open={open} onOpenChange={onOpenChange} title={title} submitLabel="Close" onSubmit={() => onOpenChange(false)}>
      {record ? (
        <fieldset disabled className="disabled:opacity-75">
          <FormGrid>
            {Object.entries(record).filter(([key]) => key !== "id").map(([key, value]) => (
              key === "rejectedReason" ? (
                <TextareaField key={key} label="Reject Reason" value={String(value ?? "")} onChange={() => undefined} />
              ) : (
                <TextField key={key} label={labelize(key)} value={String(value ?? "")} onChange={() => undefined} />
              )
            ))}
          </FormGrid>
        </fieldset>
      ) : null}
    </MasterDialog>
  );
}

function labelize(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
