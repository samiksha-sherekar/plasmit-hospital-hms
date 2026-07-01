"use client";

import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

import type { MedicationAdministration } from "./types";

export type AdministrationActionType = "administer" | "manage" | "review" | "continue";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value || "-"}</div>
    </div>
  );
}

function getMedicationState(medication: MedicationAdministration) {
  if (medication.status === "Running") return "Running";
  if (medication.status === "Partial") return "Partial";
  if (medication.status === "Held") return "Held";
  if (medication.status === "Missed") return "Missed";
  if (medication.status === "Refused") return "Refused";
  if (medication.status === "Administered") return "Administered";
  if (medication.status === "Due") return "Due";
  if (medication.status === "Overdue") return "Overdue";
  return medication.status;
}

export function AdministrationDrawer({
  open,
  onOpenChange,
  selectedMedication,
  actionType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMedication: MedicationAdministration | null;
  actionType: AdministrationActionType | null;
}) {
  const [overrideReason, setOverrideReason] = React.useState("");
  const [reviewNote, setReviewNote] = React.useState("");
  const [observation, setObservation] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setOverrideReason("");
    setReviewNote("");
    setObservation("");
  }, [open, actionType, selectedMedication]);

  if (!selectedMedication || !actionType) return null;

  const status = getMedicationState(selectedMedication);
  const isOverdue = status === "Overdue";

  const submit = () => {
    const messages: Record<AdministrationActionType, string> = {
      administer: "Medication administered successfully.",
      manage: "Infusion updated successfully.",
      review: "Medication review saved successfully.",
      continue: "Medication administration completed successfully.",
    };
    toast.success(messages[actionType]);
    onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Medication Administration"
      description={`${selectedMedication.drugName} / ${selectedMedication.category}`}
      className="w-[calc(100vw-2rem)] max-w-4xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>
            {actionType === "administer" ? "Confirm & Administer" : actionType === "manage" ? "Update Infusion" : actionType === "continue" ? "Complete Administration" : "Save Review"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {isOverdue ? (
          <Card className="border-danger/30 bg-danger/10">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-danger">Overdue Medication</div>
                <Badge tone="danger">Overdue</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <ReadOnly label="Overdue duration" value="2 hrs 15 mins" />
                <ReadOnly label="Reason for Delay" value="Ward round / workflow delay" />
                <ReadOnly label="Comments" value="Please verify before administration." />
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Section title="Quick Order Summary">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ReadOnly label="Drug" value={selectedMedication.drugName} />
            <ReadOnly label="Category" value={selectedMedication.category} />
            <ReadOnly label="Frequency" value={selectedMedication.frequency} />
            <ReadOnly label="Next Due" value={selectedMedication.nextDueTime} />
          </div>
        </Section>

        {actionType === "administer" ? (
          <>
            <Section title="Medicine Reconciliation">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ReadOnly label="Dose" value={`${selectedMedication.dose}${selectedMedication.doseUnit ? ` ${selectedMedication.doseUnit}` : ""}`} />
                <ReadOnly label="Route" value={selectedMedication.route} />
                <ReadOnly label="Order Status" value={selectedMedication.orderStatus} />
                <ReadOnly label="Status" value={status} />
              </div>
            </Section>
            <Section title="5 Rights Check">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ReadOnly label="Right Drug" value="Verified" />
                <ReadOnly label="Right Dose" value="Verified" />
                <ReadOnly label="Right Route" value="Verified" />
                <ReadOnly label="Right Time" value={status === "Overdue" ? "Warning" : "Verified"} />
              </div>
            </Section>
            <Section title="Administration Details">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Administration Time">
                  <Input type="time" defaultValue={selectedMedication.nextDueTime !== "-" ? selectedMedication.nextDueTime.slice(0, 5) : ""} />
                </Field>
                <Field label="Dose Given">
                  <Input defaultValue={selectedMedication.dose} />
                </Field>
              </div>
            </Section>
            <Section title="Patient Observation">
              <Field label="Observation Notes">
                <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20" value={observation} onChange={(event) => setObservation(event.target.value)} />
              </Field>
            </Section>
          </>
        ) : null}

        {actionType === "manage" ? (
          <>
            <Section title="Current Infusion Details">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ReadOnly label="Infusion Rate" value="20 ml/hr" />
                <ReadOnly label="Volume Infused" value="120 ml" />
                <ReadOnly label="Remaining Volume" value="380 ml" />
                <ReadOnly label="Pump Status" value="Running" />
              </div>
            </Section>
            <Section title="Infusion Rate">
              <Input defaultValue="20 ml/hr" />
            </Section>
            <Section title="Observation Notes">
              <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
            </Section>
          </>
        ) : null}

        {actionType === "review" ? (
          <>
            <Section title="Status Details">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ReadOnly label="Status" value={status} />
                <ReadOnly label="Doctor Communication" value="Required" />
                <ReadOnly label="Nurse Notes" value={reviewNote || "-"} />
                <ReadOnly label="Patient Counselling" value="Completed" />
              </div>
            </Section>
            <Section title="Reason">
              <div className="space-y-3">
                <Field label={status === "Held" ? "Hold Reason" : status === "Missed" ? "Missed Reason" : "Refusal Reason"}>
                  <Input defaultValue={selectedMedication.genericName} />
                </Field>
                <Field label="Doctor Notified">
                  <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </Field>
                <Field label="Nurse Notes">
                  <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20" value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} />
                </Field>
              </div>
            </Section>
          </>
        ) : null}

        {actionType === "continue" ? (
          <>
            <Section title="Previous Administration Details">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ReadOnly label="Administered" value={`${selectedMedication.administeredQty}`} />
                <ReadOnly label="Ordered" value={`${selectedMedication.orderedQty}`} />
                <ReadOnly label="Remaining Dose" value={`${Math.max(selectedMedication.orderedQty - selectedMedication.administeredQty, 0)}`} />
                <ReadOnly label="Status" value={status} />
              </div>
            </Section>
            <Section title="Continue Administration">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Continuation Dose">
                  <Input defaultValue={selectedMedication.dose} />
                </Field>
                <Field label="Administration Time">
                  <Input type="time" defaultValue={selectedMedication.nextDueTime !== "-" ? selectedMedication.nextDueTime.slice(0, 5) : ""} />
                </Field>
              </div>
            </Section>
            <Section title="Patient Observation">
              <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
            </Section>
          </>
        ) : null}
      </div>
    </Drawer>
  );
}
