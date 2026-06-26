"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { getLdtTypeConfig } from "@/features/doctor-orders/tabs/ldt/config";
import { buildTableRows, ldtTypeToConfigId, sectionLabel } from "./ldt-data";
import type { LdtDetailsDrawerState, LdtRecord, LdtSection } from "./ldt-data";

type Props = {
  state: LdtDetailsDrawerState;
  onClose: () => void;
  onDelete: (record: LdtRecord, section: LdtSection, fieldKey: string) => void;
};

export function LdtDetailsDrawer({ state, onClose, onDelete }: Props) {
  if (!state) return null;

  const config = getLdtTypeConfig(ldtTypeToConfigId(state.record.type));
  const fields = config?.fields.filter((field) => field.group === state.type) ?? [];
  const tableRows = buildTableRows(state.type === "properties" ? state.record.properties : state.record.assessment, fields);

  return (
    <Drawer
      open={Boolean(state)}
      title={`${sectionLabel(state.type)} - ${state.record.name}`}
      className="w-[calc(100vw-2rem)] max-w-3xl"
      onOpenChange={(open) => !open && onClose()}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">{sectionLabel(state.type) === "Properties" ? "Property" : "Assessment"}</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Value</th>
                <th className="px-3 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length ? (
                tableRows.map((row) => (
                  <tr key={row.key} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 font-medium text-foreground">{row.field}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.type}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.value}</td>
                    <td className="px-3 py-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={state.record.nurseLocked}
                        onClick={() => onDelete(state.record, state.type, row.field)}
                        title={state.record.nurseLocked ? "This LDT was inserted from Nurse side and cannot be deleted." : "Delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-sm text-muted-foreground">
                    No {sectionLabel(state.type).toLowerCase()} configured for this LDT.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Drawer>
  );
}
