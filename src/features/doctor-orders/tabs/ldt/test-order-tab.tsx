"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import type { LdtOrderPriority, LdtOrderStatus } from "./types";

const LDT_TYPE_OPTIONS = [
  "PICC Single Lumen",
  "PICC Double Lumen",
  "Central Venous Catheter",
  "Peripheral IV Cannula",
  "Urinary Catheter",
  "Nasogastric Tube",
  "Chest Tube",
  "Arterial Line",
] as const;

const priorityOptions: LdtOrderPriority[] = ["Routine", "Urgent", "STAT"];
const statusOptions: LdtOrderStatus[] = ["Pending", "Active", "Completed", "Cancelled"];

export type LdtDraft = {
  ldtType: string;
  priority: LdtOrderPriority | "";
  reason: string;
  clinicalNotes: string;
  ldtName: string;
  orderDate: string;
  status: LdtOrderStatus;
};

type Props = {
  draft: LdtDraft;
  onDraftChange: (value: LdtDraft) => void;
  onSave: () => void;
  readOnly?: boolean;
  errors?: Partial<Record<keyof LdtDraft, string>>;
};

export function LdtTestOrderTab({ draft, onDraftChange, onSave, readOnly = false, errors = {} }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="space-y-1 text-xs font-medium text-muted-foreground">
            <span>LDT Type</span>
            <select
              className="h-10 w-full rounded-md border border-input  px-3 text-sm"
              value={draft.ldtType}
              disabled={readOnly}
              onChange={(event) => onDraftChange({ ...draft, ldtType: event.target.value })}
            >
              <option value="" disabled>
                Select LDT Type
              </option>
              {LDT_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.ldtType ? <p className="text-[11px] text-danger">{errors.ldtType}</p> : null}
          </label>
          <label className="space-y-1 text-xs font-medium text-muted-foreground">
            <span>Priority </span>
            <select
              className="h-10 w-full rounded-md border border-input  px-3 text-sm"
              value={draft.priority}
              disabled={readOnly}
              onChange={(event) => onDraftChange({ ...draft, priority: event.target.value as LdtOrderPriority })}
            >
              <option value="" disabled>
                Select Priority
              </option>
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.priority ? <p className="text-[11px] text-danger">{errors.priority}</p> : null}
          </label>
          <label className="space-y-1 text-xs font-medium text-muted-foreground">
            <span>Order Date </span>
            <input
              type="date"
              className="h-10 w-full rounded-md border border-input  px-3 text-sm outline-none"
              value={draft.orderDate}
              placeholder="DD-MM-YYYY"
              disabled={readOnly}
              onFocus={(event) => {
                const target = event.currentTarget as HTMLInputElement & { showPicker?: () => void };
                target.showPicker?.();
              }}
              onChange={(event) => onDraftChange({ ...draft, orderDate: event.target.value })}
            />
            {errors.orderDate ? <p className="text-[11px] text-danger">{errors.orderDate}</p> : null}
          </label>
          <label className="space-y-1 text-xs font-medium text-muted-foreground sm:col-span-1">
            <span>Reason / Indication </span>
            <textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm outline-none" value={draft.reason} disabled={readOnly} onChange={(event) => onDraftChange({ ...draft, reason: event.target.value })} placeholder="Enter reason or indication" />
            {errors.reason ? <p className="text-[11px] text-danger">{errors.reason}</p> : null}
          </label>
          <label className="space-y-1 text-xs font-medium text-muted-foreground sm:col-span-1">
            <span>Clinical Notes</span>
            <textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm outline-none" value={draft.clinicalNotes} disabled={readOnly} onChange={(event) => onDraftChange({ ...draft, clinicalNotes: event.target.value })} placeholder="Add clinical notes" />
          </label>
        </div>

        {!readOnly ? (
          <div className="flex justify-end">
            <Button type="button" onClick={onSave}>
              Save LDT Order
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
