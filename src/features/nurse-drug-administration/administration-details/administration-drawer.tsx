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
      <div className="mt-1 text-sm font-semibold text-foreground">{value || ""}</div>
    </div>
  );
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <select className="h-10 w-full rounded-md border border-input px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}

function RadioGroup({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex gap-3">
        {["Yes", "No"].map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input type="radio" name={label} checked={value === option} onChange={() => onChange(option)} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function statusTone(status: string) {
  if (status === "Verified" || status === "Matched") return "success";
  if (status === "Warning") return "warning";
  if (status === "Failed" || status === "Mismatch" || status === "Expired" || status === "Not Received") return "danger";
  return "muted";
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

export function AdministrationDrawer({ open, onOpenChange, selectedMedication, actionType }: { open: boolean; onOpenChange: (open: boolean) => void; selectedMedication: MedicationAdministration | null; actionType: AdministrationActionType | null; }) {
  const [reviewNote, setReviewNote] = React.useState("");
  const [observation, setObservation] = React.useState("");
  const [administrationDate, setAdministrationDate] = React.useState("");
  const [administrationTime, setAdministrationTime] = React.useState("");
  const [doseToGive, setDoseToGive] = React.useState("");
  const [administrationStatus, setAdministrationStatus] = React.useState("Administered");
  const [remainingQty, setRemainingQty] = React.useState(0);
  const [administeredQty, setAdministeredQty] = React.useState(0);
  const [lastAdministrationDate, setLastAdministrationDate] = React.useState("");
  const [lastAdministrationTime, setLastAdministrationTime] = React.useState("");
  const [lastAdministeredBy, setLastAdministeredBy] = React.useState("");
  const [activeInlineForm, setActiveInlineForm] = React.useState<string | null>(null);
  const [auditTrail, setAuditTrail] = React.useState<string[]>([]);
  const [nurseVerified, setNurseVerified] = React.useState(false);
  const [verifiedOn, setVerifiedOn] = React.useState("");
  const [draftSavedAt, setDraftSavedAt] = React.useState("");

  const [notifyPriority, setNotifyPriority] = React.useState("Normal");
  const [notifyMessage, setNotifyMessage] = React.useState("");
  const [returnQty, setReturnQty] = React.useState("");
  const [returnReason, setReturnReason] = React.useState("");
  const [returnRemarks, setReturnRemarks] = React.useState("");
  const [orderedPatient, setOrderedPatient] = React.useState("");
  const [selectedPatient, setSelectedPatient] = React.useState("");
  const [verificationNotes, setVerificationNotes] = React.useState("");
  const [orderedDose, setOrderedDose] = React.useState("");
  const [enteredDose, setEnteredDose] = React.useState("");
  const [doseCorrectionNotes, setDoseCorrectionNotes] = React.useState("");
  const [orderedRoute, setOrderedRoute] = React.useState("");
  const [selectedRoute, setSelectedRoute] = React.useState("");
  const [routeCorrectionNotes, setRouteCorrectionNotes] = React.useState("");
  const [overrideReason, setOverrideReason] = React.useState("");

  const [patientResponse, setPatientResponse] = React.useState("Stable");
  const [adverseReaction, setAdverseReaction] = React.useState("No");
  const [reactionDetails, setReactionDetails] = React.useState("");
  const [observationNotes, setObservationNotes] = React.useState("");

  const [holdReason, setHoldReason] = React.useState("");
  const [holdDoctorNotified, setHoldDoctorNotified] = React.useState("");
  const [holdCommunicationNotes, setHoldCommunicationNotes] = React.useState("");
  const [missedReason, setMissedReason] = React.useState("");
  const [missedDoctorNotified, setMissedDoctorNotified] = React.useState("");
  const [missedNotes, setMissedNotes] = React.useState("");
  const [refusalReason, setRefusalReason] = React.useState("");
  const [patientCounsellingDone, setPatientCounsellingDone] = React.useState("");
  const [refusalDoctorNotified, setRefusalDoctorNotified] = React.useState("");
  const [givenQty, setGivenQty] = React.useState("");
  const [partialReason, setPartialReason] = React.useState("");

  React.useEffect(() => {
    if (!open || !selectedMedication) return;
    setReviewNote("");
    setObservation("");
    setAdministrationDate("");
    setAdministrationTime("");
    setDoseToGive("");
    setAdministrationStatus("Administered");
    setRemainingQty(Math.max(selectedMedication.orderedQty - selectedMedication.administeredQty, 0));
    setAdministeredQty(selectedMedication.administeredQty);
    setLastAdministrationDate("");
    setLastAdministrationTime("");
    setLastAdministeredBy("");
    setActiveInlineForm(null);
    setAuditTrail([]);
    setNurseVerified(false);
    setVerifiedOn("");
    setDraftSavedAt("");
    setNotifyPriority("Normal");
    setNotifyMessage("");
    setReturnQty("");
    setReturnReason("");
    setReturnRemarks("");
    setOrderedPatient(selectedMedication.patientName);
    setSelectedPatient(selectedMedication.patientName);
    setVerificationNotes("");
    setOrderedDose(selectedMedication.dose);
    setEnteredDose(selectedMedication.dose);
    setDoseCorrectionNotes("");
    setOrderedRoute(selectedMedication.route);
    setSelectedRoute(selectedMedication.route);
    setRouteCorrectionNotes("");
    setOverrideReason("");
    setPatientResponse("Stable");
    setAdverseReaction("No");
    setReactionDetails("");
    setObservationNotes("");
    setHoldReason("");
    setHoldDoctorNotified("");
    setHoldCommunicationNotes("");
    setMissedReason("");
    setMissedDoctorNotified("");
    setMissedNotes("");
    setRefusalReason("");
    setPatientCounsellingDone("");
    setRefusalDoctorNotified("");
    setGivenQty("");
    setPartialReason("");
  }, [open, actionType, selectedMedication]);

  if (!selectedMedication || !actionType) return null;

  const status = getMedicationState(selectedMedication);
  const currentRemainingQty = Math.max(remainingQty, 0);
  const quickSummary = [
    // ["Patient Name", selectedMedication.patientName],
    // ["UHID", selectedMedication.patientId],
    // ["Ward / Bed", selectedMedication.category || ""],
    ["Drug Name", selectedMedication.drugName],
    ["Generic Name", selectedMedication.genericName],
    ["Doctor Name", selectedMedication.frequency || ""],
    ["Category", selectedMedication.category],
    ["Form", selectedMedication.form],
    ["Strength", selectedMedication.dose],
    ["Dose", selectedMedication.dose],
    ["Dose Unit", selectedMedication.doseUnit],
    ["Route", selectedMedication.route],
    ["Frequency", selectedMedication.frequency],
    ["Priority", selectedMedication.priority],
    ["Scheduled Date", selectedMedication.orderDate],
    ["Scheduled Time", selectedMedication.nextDueTime],
    ["Next Due Time", selectedMedication.nextDueTime],
    ["Current Status", status],
    ["Order Date", selectedMedication.orderDate],
    ["Start Date", selectedMedication.startDate],
    ["End Date", selectedMedication.endDate],
    ["Ordered Qty", `${selectedMedication.orderedQty}`],
    ["Dispensed Qty", `${selectedMedication.dispensedQty}`],
    ["Received Qty", `${selectedMedication.receivedQty}`],
    ["Administered Qty", `${administeredQty}`],
    ["Remaining Qty", `${currentRemainingQty}`],
  ] as const;

  const reconcileStatus = selectedMedication.dispensedQty >= selectedMedication.receivedQty ? "Matched" : selectedMedication.dispensedQty > selectedMedication.receivedQty ? "Mismatch" : "Not Received";
  const rightPatientStatus = "Verified";
  const rightDrugStatus = reconcileStatus === "Matched" ? "Verified" : "Failed";
  const rightDoseStatus = selectedMedication.dose ? "Verified" : "Warning";
  const rightRouteStatus = selectedMedication.route ? "Verified" : "Warning";
  const rightTimeStatus = selectedMedication.nextDueTime ? (selectedMedication.status === "Overdue" ? "Failed" : "Warning") : "Warning";
  const rightsVerified = reconcileStatus === "Matched" && !!selectedMedication.patientName && !!selectedMedication.drugName && !!selectedMedication.dose && !!selectedMedication.route && !!selectedMedication.nextDueTime;
  const canShowVerification = rightsVerified;
  const canShowAdminFields = nurseVerified;
  const nowString = new Date().toLocaleString();
  const administerReady = nurseVerified && !!administrationDate && !!administrationTime && !!doseToGive && Number(doseToGive) > 0;
  const continueReady = !!administrationDate && !!administrationTime && !!doseToGive && Number(doseToGive) > 0 && Number(doseToGive) <= currentRemainingQty && (!!administrationStatus !== false) && (administrationStatus !== "Held" || !!holdReason) && (administrationStatus !== "Held" || !!holdDoctorNotified) && (administrationStatus !== "Held" || !!holdCommunicationNotes) && (administrationStatus !== "Refused" || !!refusalReason) && (administrationStatus !== "Refused" || !!patientCounsellingDone) && (administrationStatus !== "Refused" || !!refusalDoctorNotified);

  const clearInlineForm = () => setActiveInlineForm(null);
  const toastAndAudit = (message: string, audit: string) => { toast.success(message); setAuditTrail((current) => [...current, audit]); clearInlineForm(); };

  const saveDraft = () => {
    setDraftSavedAt(nowString);
    toast.success("Administration draft saved.");
    setAuditTrail((current) => [...current, `Administration draft saved for ${selectedMedication.drugName} at ${nowString}.`]);
  };

  const completeContinueAdministration = () => {
    const finalDose = Number(doseToGive);
    if (!continueReady) return;
    const nextRemainingQty = finalDose >= currentRemainingQty ? 0 : currentRemainingQty - finalDose;
    setAdministeredQty(selectedMedication.administeredQty + finalDose);
    setRemainingQty(nextRemainingQty);
    setLastAdministrationDate(administrationDate);
    setLastAdministrationTime(administrationTime);
    setLastAdministeredBy("Current User");
    setAuditTrail((current) => [...current, `Continue administration completed for ${selectedMedication.drugName} on ${administrationDate} ${administrationTime}.`]);
    setAdministrationStatus("Administered");
    toast.success("Medication administration updated successfully.");
    onOpenChange(false);
  };

  const confirmAdminister = () => {
    const finalDose = Number(doseToGive);
    if (!administerReady || finalDose > currentRemainingQty) return;
    const nextRemainingQty = administrationStatus === "Partially Administered" ? Math.max(currentRemainingQty - (Number(givenQty) || finalDose), 0) : Math.max(currentRemainingQty - finalDose, 0);
    const nextAdministeredQty = selectedMedication.administeredQty + finalDose;
    setAdministeredQty(nextAdministeredQty);
    setRemainingQty(nextRemainingQty);
    setLastAdministrationDate(administrationDate);
    setLastAdministrationTime(administrationTime);
    setLastAdministeredBy("Current User");
    setAdministrationStatus("Administered");
    setAuditTrail((current) => [...current, `Medication administered for ${selectedMedication.drugName} on ${administrationDate} ${administrationTime}.`]);
    toast.success("Medication administered successfully.");
    onOpenChange(false);
  };

  const title = actionType === "administer" ? "Medication Administration" : actionType === "continue" ? "Continue Administration" : "Medication Administration";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={`${selectedMedication.drugName} / ${selectedMedication.category}`}
      className="w-[calc(100vw-2rem)] max-w-4xl"
      footer={actionType === "administer" ? (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
          <Button onClick={confirmAdminister} disabled={!administerReady}>Confirm & Administer</Button>
        </div>
      ) : actionType === "continue" ? (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
          <Button onClick={completeContinueAdministration} disabled={!continueReady}>Complete Administration</Button>
        </div>
      ) : (
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={() => toast.success("Saved")}>Save</Button></div>
      )}
    >
      <div className="space-y-4">
        {actionType === "administer" ? (
          <>
            <Section title="Quick Order Summary">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {quickSummary.map(([label, value]) => <ReadOnly key={label} label={label} value={value} />)}
              </div>
            </Section>

            <Section title="Medicine Reconciliation">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <ReadOnly label="Doctor Ordered Drug" value={selectedMedication.drugName} />
                <ReadOnly label="Doctor Ordered Dose" value={selectedMedication.dose} />
                <ReadOnly label="Doctor Ordered Route" value={selectedMedication.route} />
                <ReadOnly label="Pharmacy Dispensed Drug" value={selectedMedication.drugName} />
                <ReadOnly label="Pharmacy Dispensed Dose" value={selectedMedication.dose} />
                <ReadOnly label="Pharmacy Dispensed Route" value={selectedMedication.route} />
                <ReadOnly label="Nurse Received Drug" value={selectedMedication.drugName} />
                <ReadOnly label="Nurse Received Dose" value={selectedMedication.dose} />
                <ReadOnly label="Nurse Received Route" value={selectedMedication.route} />
                <ReadOnly label="Batch Number" value="BN-001" />
                <ReadOnly label="Expiry Date" value={selectedMedication.endDate} />
                <div className="rounded-md border border-border bg-surface px-3 py-2">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Reconciliation Status</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge tone={statusTone(reconcileStatus) as any}>{reconcileStatus}</Badge>
                    {reconcileStatus !== "Matched" ? <span className="text-sm text-warning-foreground">Medication needs attention before administration.</span> : null}
                  </div>
                </div>
              </div>
              {reconcileStatus !== "Matched" ? (
                <>
                  <div className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning-foreground">Medication reconciliation requires review.</div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setActiveInlineForm("notify-pharmacy")}>Notify Pharmacy</Button>
                    <Button size="sm" variant="outline" onClick={() => setActiveInlineForm("return-medication")}>Return Medication</Button>
                  </div>
                  {activeInlineForm === "notify-pharmacy" ? (
                    <div className="space-y-3 rounded-md border border-border bg-surface p-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <SelectField label="Priority" value={notifyPriority} onChange={setNotifyPriority}><option value="Normal">Normal</option><option value="Urgent">Urgent</option></SelectField>
                        <Field label="Message"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} /></Field>
                      </div>
                      <div className="flex gap-2"><Button variant="outline" onClick={clearInlineForm}>Cancel</Button><Button onClick={() => toastAndAudit("Notification sent successfully.", `Notified pharmacy with priority ${notifyPriority} for ${selectedMedication.drugName}.`)}>Send Notification</Button></div>
                    </div>
                  ) : null}
                  {activeInlineForm === "return-medication" ? (
                    <div className="space-y-3 rounded-md border border-border bg-surface p-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Return Qty"><Input type="number" value={returnQty} onChange={(e) => setReturnQty(e.target.value)} /></Field>
                        <SelectField label="Return Reason" value={returnReason} onChange={setReturnReason}><option value="">Select</option><option value="Drug Mismatch">Drug Mismatch</option><option value="Wrong Strength">Wrong Strength</option><option value="Expired Medication">Expired Medication</option><option value="Damaged Medication">Damaged Medication</option><option value="Other">Other</option></SelectField>
                        <Field label="Remarks"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={returnRemarks} onChange={(e) => setReturnRemarks(e.target.value)} /></Field>
                      </div>
                      <div className="flex gap-2"><Button variant="outline" onClick={clearInlineForm}>Cancel</Button><Button onClick={() => toastAndAudit(`Returned ${returnQty || 0} qty successfully.`, `Returned medication for ${selectedMedication.drugName}.`) }>Confirm Return</Button></div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </Section>

            <Section title="5 Rights Check">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-md border border-border bg-surface p-3 space-y-2">
                  <div className="text-sm font-semibold">Right Patient</div>
                  <Badge tone={statusTone(rightPatientStatus) as any}>{rightPatientStatus}</Badge>
                </div>
                <div className="rounded-md border border-border bg-surface p-3 space-y-2">
                  <div className="text-sm font-semibold">Right Drug</div>
                  <Badge tone={statusTone(rightDrugStatus) as any}>{rightDrugStatus}</Badge>
                  {rightDrugStatus !== "Verified" ? <><div className="text-xs text-muted-foreground">Drug reconciliation needs attention.</div><Button size="sm" variant="outline" onClick={() => setActiveInlineForm("return-medication")}>Return Medication</Button><Button size="sm" variant="outline" onClick={() => setActiveInlineForm("notify-pharmacy")}>Notify Pharmacy</Button></> : null}
                </div>
                <div className="rounded-md border border-border bg-surface p-3 space-y-2">
                  <div className="text-sm font-semibold">Right Dose</div>
                  <Badge tone={statusTone(rightDoseStatus) as any}>{rightDoseStatus}</Badge>
                </div>
                <div className="rounded-md border border-border bg-surface p-3 space-y-2">
                  <div className="text-sm font-semibold">Right Route</div>
                  <Badge tone={statusTone(rightRouteStatus) as any}>{rightRouteStatus}</Badge>
                </div>
                <div className="rounded-md border border-border bg-surface p-3 space-y-2">
                  <div className="text-sm font-semibold">Right Time</div>
                  <Badge tone={statusTone(rightTimeStatus) as any}>{rightTimeStatus}</Badge>
                </div>
              </div>

              {canShowVerification ? (
                <div className="space-y-3 rounded-md border border-border bg-surface p-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={nurseVerified} onChange={(event) => { setNurseVerified(event.target.checked); if (event.target.checked) setVerifiedOn(nowString); }} />
                    <span>I confirm that all medication rights have been verified.</span>
                  </label>
                  {nurseVerified ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ReadOnly label="Verified By" value="Logged-in Nurse" />
                      <ReadOnly label="Verified On" value={verifiedOn || nowString} />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Section>

            <Section title="Administration Details">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Administration Date">
                  <Input type="date" value={administrationDate} onChange={(event) => setAdministrationDate(event.target.value)} disabled={!canShowAdminFields} />
                </Field>
                <Field label="Administration Time">
                  <Input type="time" value={administrationTime} onChange={(event) => setAdministrationTime(event.target.value)} disabled={!canShowAdminFields} />
                </Field>
                <Field label="Administered Dose">
                  <Input type="number" min="0" value={doseToGive} onChange={(event) => setDoseToGive(event.target.value)} disabled={!canShowAdminFields} />
                </Field>
                <ReadOnly label="Dose Unit" value={selectedMedication.doseUnit} />
                <ReadOnly label="Administration Route" value={selectedMedication.route} />
                <SelectField label="Administration Status" value={administrationStatus} onChange={setAdministrationStatus}>
                  <option value="Administered">Administered</option>
                  <option value="Held">Held</option>
                  <option value="Missed">Missed</option>
                  <option value="Refused">Refused</option>
                  <option value="Partially Administered">Partially Administered</option>
                </SelectField>
                <Field label="Administration Remarks">
                  <textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={observation} onChange={(e) => setObservation(e.target.value)} disabled={!canShowAdminFields} />
                </Field>
              </div>

              {administrationStatus === "Held" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField label="Hold Reason" value={holdReason} onChange={setHoldReason}><option value="">Select</option><option value="Patient Condition">Patient Condition</option><option value="Doctor Instruction">Doctor Instruction</option><option value="Medication Unavailable">Medication Unavailable</option><option value="Clinical Decision">Clinical Decision</option><option value="Other">Other</option></SelectField>
                  <RadioGroup label="Doctor Notified" value={holdDoctorNotified} onChange={setHoldDoctorNotified} />
                  <Field label="Communication Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={holdCommunicationNotes} onChange={(e) => setHoldCommunicationNotes(e.target.value)} /></Field>
                </div>
              ) : null}

              {administrationStatus === "Missed" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField label="Missed Reason" value={missedReason} onChange={setMissedReason}><option value="">Select</option><option value="Patient Not Available">Patient Not Available</option><option value="Medication Unavailable">Medication Unavailable</option><option value="Procedure Conflict">Procedure Conflict</option><option value="Clinical Decision">Clinical Decision</option><option value="Other">Other</option></SelectField>
                  <RadioGroup label="Doctor Notified" value={missedDoctorNotified} onChange={setMissedDoctorNotified} />
                  <Field label="Missed Notes"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={missedNotes} onChange={(e) => setMissedNotes(e.target.value)} /></Field>
                </div>
              ) : null}

              {administrationStatus === "Refused" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Refusal Reason"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={refusalReason} onChange={(e) => setRefusalReason(e.target.value)} /></Field>
                  <RadioGroup label="Patient Counselling Done" value={patientCounsellingDone} onChange={setPatientCounsellingDone} />
                  <RadioGroup label="Doctor Notified" value={refusalDoctorNotified} onChange={setRefusalDoctorNotified} />
                </div>
              ) : null}

              {administrationStatus === "Partially Administered" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Given Qty"><Input type="number" value={givenQty} onChange={(e) => setGivenQty(e.target.value)} /></Field>
                  <ReadOnly label="Remaining Qty" value={`${Math.max(currentRemainingQty - (Number(givenQty) || 0), 0)}`} />
                  <Field label="Partial Administration Reason"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={partialReason} onChange={(e) => setPartialReason(e.target.value)} /></Field>
                </div>
              ) : null}
            </Section>

            <Section title="Patient Observation">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField label="Patient Response" value={patientResponse} onChange={setPatientResponse}>
                  <option value="Stable">Stable</option>
                  <option value="Improved">Improved</option>
                  <option value="No Change">No Change</option>
                  <option value="Requires Monitoring">Requires Monitoring</option>
                </SelectField>
                <RadioGroup label="Adverse Reaction" value={adverseReaction} onChange={setAdverseReaction} />
                {adverseReaction === "Yes" ? <Field label="Reaction Details"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={reactionDetails} onChange={(e) => setReactionDetails(e.target.value)} /></Field> : null}
                <Field label="Observation Notes"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={observationNotes} onChange={(e) => setObservationNotes(e.target.value)} /></Field>
              </div>
            </Section>
          </>
        ) : null}

        {actionType === "manage" ? (<>            
        <Section title="Quick Order Summary">              
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">                
            {/* <ReadOnly label="Patient Name" value={selectedMedication.patientName} />                
            <ReadOnly label="UHID" value={selectedMedication.patientId} />                
            <ReadOnly label="Ward / Bed" value={selectedMedication.category || ""} />                 */}
            <ReadOnly label="Drug Name" value={selectedMedication.drugName} />                
            <ReadOnly label="Generic Name" value={selectedMedication.genericName} />                
            <ReadOnly label="Category" value={selectedMedication.category} />                
            <ReadOnly label="Doctor Name" value={selectedMedication.frequency || ""} />                
            <ReadOnly label="Form" value={selectedMedication.form} />                
            <ReadOnly label="Dose" value={selectedMedication.dose} />                
            <ReadOnly label="Dose Unit" value={selectedMedication.doseUnit} />                
            <ReadOnly label="Route" value={selectedMedication.route} />                
            <ReadOnly label="Frequency" value={selectedMedication.frequency} />                
            <ReadOnly label="Priority" value={selectedMedication.priority} />                
            <ReadOnly label="Order Date" value={selectedMedication.orderDate} />                
            <ReadOnly label="Start Date" value={selectedMedication.startDate} />                
            <ReadOnly label="Running Since" value={lastAdministrationDate || selectedMedication.startDate} />                <ReadOnly label="Current Status" value={status} />              
          </div>            
        </Section>            
        <Section title="Current Infusion Details">              
          <div className="grid gap-3 sm:grid-cols-2">                
            <ReadOnly label="Infusion Drug" value={selectedMedication.drugName} />                
            <ReadOnly label="Diluent" value={selectedMedication.genericName || selectedMedication.drugName} />                <ReadOnly label="Ordered Rate" value={selectedMedication.dose} />                
            <ReadOnly label="Rate Unit" value={selectedMedication.doseUnit} />                
            <ReadOnly label="Route" value={selectedMedication.route} />                
            <ReadOnly label="Current Status" value={status} />                
            <Field label="Current Infusion Rate">
              <Input type="text" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} />
            </Field>                
            <Field label="Volume Infused">
              <Input type="number" value={remainingQty === 0 ? selectedMedication.administeredQty : administeredQty} onChange={(e) => setAdministeredQty(Number(e.target.value || 0))} />
            </Field>                
            <Field label="Remaining Volume">
              <Input type="number" value={remainingQty} onChange={(e) => setRemainingQty(Number(e.target.value || 0))} />
            </Field>                
            <SelectField label="Pump Status" value={administrationStatus} onChange={setAdministrationStatus}>                  <option value="Running">Running</option>                  <option value="Paused">Paused</option>                  <option value="Completed">Completed</option>                  <option value="Stopped">Stopped</option>                </SelectField>                <SelectField label="Line Status" value={selectedRoute} onChange={setSelectedRoute}>                  <option value="Patent">Patent</option>                  <option value="Occluded">Occluded</option>                  <option value="Infiltrated">Infiltrated</option>                  <option value="Leaking">Leaking</option>                </SelectField>                <Field label="Infusion Remarks"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={observation} onChange={(e) => setObservation(e.target.value)} /></Field>              </div>            </Section>            <Section title="Patient Observation">              <div className="grid gap-3 sm:grid-cols-2">                <SelectField label="Patient Response" value={patientResponse} onChange={setPatientResponse}>                  <option value="Stable">Stable</option>                  <option value="Improved">Improved</option>                  <option value="No Change">No Change</option>                  <option value="Requires Monitoring">Requires Monitoring</option>                </SelectField>                <RadioGroup label="Adverse Reaction" value={adverseReaction} onChange={setAdverseReaction} />                {adverseReaction === "Yes" ? <Field label="Reaction Details"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={reactionDetails} onChange={(e) => setReactionDetails(e.target.value)} /></Field> : null}                <Field label="Observation Notes"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={observationNotes} onChange={(e) => setObservationNotes(e.target.value)} /></Field>              </div>            </Section>          </>        ) : null}
        {actionType === "review" ? (
          <>
            <Section title="Quick Order Summary">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {/* <ReadOnly label="Patient Name" value={selectedMedication.patientName} />
                <ReadOnly label="UHID" value={selectedMedication.patientId} />
                <ReadOnly label="Ward / Bed" value={selectedMedication.category || ""} /> */}
                <ReadOnly label="Drug Name" value={selectedMedication.drugName} />
                <ReadOnly label="Dose" value={selectedMedication.dose} />
                <ReadOnly label="Doctor Name" value={selectedMedication.frequency || ""} />
                <ReadOnly label="Route" value={selectedMedication.route} />
                <ReadOnly label="Frequency" value={selectedMedication.frequency} />
                <ReadOnly label="Current Status" value={status} />
                <ReadOnly label="Scheduled Time" value={selectedMedication.nextDueTime} />
              </div>
            </Section>
            {status === "Held" ? (
              <Section title="Review Details">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ReadOnly label="Held Date" value={lastAdministrationDate || selectedMedication.orderDate} />
                  <ReadOnly label="Held Time" value={lastAdministrationTime || selectedMedication.nextDueTime} />
                  <ReadOnly label="Held By" value={lastAdministeredBy || "Current User"} />
                  <SelectField label="Hold Reason" value={holdReason} onChange={setHoldReason}><option value="">Select</option><option value="Doctor Instruction">Doctor Instruction</option><option value="Patient Condition">Patient Condition</option><option value="Medication Unavailable">Medication Unavailable</option><option value="Other">Other</option></SelectField>
                  <RadioGroup label="Doctor Notified" value={holdDoctorNotified} onChange={setHoldDoctorNotified} />
                  <Field label="Communication Notes"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={holdCommunicationNotes} onChange={(e) => setHoldCommunicationNotes(e.target.value)} /></Field>
                  <Field label="Resume Medication"><input type="checkbox" checked={nurseVerified} onChange={(e) => setNurseVerified(e.target.checked)} /></Field>
                </div>
              </Section>
            ) : null}
            {status === "Missed" ? (
              <Section title="Review Details">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ReadOnly label="Missed Date" value={lastAdministrationDate || selectedMedication.orderDate} />
                  <ReadOnly label="Missed Time" value={lastAdministrationTime || selectedMedication.nextDueTime} />
                  <ReadOnly label="Scheduled Time" value={selectedMedication.nextDueTime} />
                  <SelectField label="Missed Reason" value={missedReason} onChange={setMissedReason}><option value="">Select</option><option value="Patient Away">Patient Away</option><option value="Procedure">Procedure</option><option value="Clinical Decision">Clinical Decision</option><option value="Other">Other</option></SelectField>
                  <RadioGroup label="Doctor Notified" value={missedDoctorNotified} onChange={setMissedDoctorNotified} />
                  <Field label="Follow-up Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={missedNotes} onChange={(e) => setMissedNotes(e.target.value)} /></Field>
                </div>
              </Section>
            ) : null}
            {status === "Refused" ? (
              <Section title="Review Details">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ReadOnly label="Refused Date" value={lastAdministrationDate || selectedMedication.orderDate} />
                  <ReadOnly label="Refused Time" value={lastAdministrationTime || selectedMedication.nextDueTime} />
                  <Field label="Refusal Reason"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={refusalReason} onChange={(e) => setRefusalReason(e.target.value)} /></Field>
                  <RadioGroup label="Patient Counselling Done" value={patientCounsellingDone} onChange={setPatientCounsellingDone} />
                  <RadioGroup label="Doctor Notified" value={refusalDoctorNotified} onChange={setRefusalDoctorNotified} />
                  <Field label="Follow-up Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} /></Field>
                </div>
              </Section>
            ) : null}
            <Section title="Review Notes"><Field label="Review Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} /></Field></Section>
          </>
        ) : null}
        {actionType === "continue" ? (
          <>
            <Section title="Quick Order Summary">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {/* <ReadOnly label="Patient Name" value={selectedMedication.patientName} />
                <ReadOnly label="UHID" value={selectedMedication.patientId} />
                <ReadOnly label="Ward / Bed" value={selectedMedication.category || ""} /> */}
                <ReadOnly label="Drug Name" value={selectedMedication.drugName} />
                <ReadOnly label="Generic Name" value={selectedMedication.genericName} />
                <ReadOnly label="Category" value={selectedMedication.category} />
                <ReadOnly label="Dose" value={selectedMedication.dose} />
                <ReadOnly label="Dose Unit" value={selectedMedication.doseUnit} />
                <ReadOnly label="Route" value={selectedMedication.route} />
                <ReadOnly label="Frequency" value={selectedMedication.frequency} />
                <ReadOnly label="Priority" value={selectedMedication.priority} />
                <ReadOnly label="Current Status" value={status} />
                <ReadOnly label="Scheduled Time" value={selectedMedication.nextDueTime} />
                <ReadOnly label="Next Due Time" value={selectedMedication.nextDueTime} />
              </div>
            </Section>

            <Section title="Previous Administration Details">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <ReadOnly label="Previous Administration Date" value={lastAdministrationDate || selectedMedication.orderDate} />
                <ReadOnly label="Previous Administration Time" value={lastAdministrationTime || selectedMedication.nextDueTime} />
                <ReadOnly label="Previous Dose Given" value={selectedMedication.administeredQty ? `${selectedMedication.administeredQty}` : ""} />
                <ReadOnly label="Administered By" value={lastAdministeredBy || "Current User"} />
                <ReadOnly label="Partial Administration Reason" value={overrideReason || ""} />
                <ReadOnly label="Remaining Quantity" value={`${currentRemainingQty}`} />
              </div>
            </Section>

            <Section title="Continue Administration">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Administration Date">
                  <Input type="date" value={administrationDate} onChange={(e) => setAdministrationDate(e.target.value)} />
                </Field>
                <Field label="Administration Time">
                  <Input type="time" value={administrationTime} onChange={(e) => setAdministrationTime(e.target.value)} />
                </Field>
                <Field label="Dose To Give">
                  <Input type="number" min="0" max={currentRemainingQty} value={doseToGive} onChange={(e) => setDoseToGive(e.target.value)} />
                </Field>
                <ReadOnly label="Dose Unit" value={selectedMedication.doseUnit} />
                <SelectField label="Administration Status" value={administrationStatus} onChange={setAdministrationStatus}>
                  <option value="Administered">Administered</option>
                  <option value="Held">Held</option>
                  <option value="Refused">Refused</option>
                </SelectField>
                <Field label="Administration Remarks">
                  <textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={observation} onChange={(e) => setObservation(e.target.value)} />
                </Field>
              </div>

              {administrationStatus === "Held" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField label="Hold Reason" value={holdReason} onChange={setHoldReason}>
                    <option value="">Select</option>
                    <option value="Patient Condition">Patient Condition</option>
                    <option value="Doctor Instruction">Doctor Instruction</option>
                    <option value="Medication Unavailable">Medication Unavailable</option>
                    <option value="Clinical Decision">Clinical Decision</option>
                    <option value="Other">Other</option>
                  </SelectField>
                  <RadioGroup label="Doctor Notified" value={holdDoctorNotified} onChange={setHoldDoctorNotified} />
                  <Field label="Communication Notes">
                    <textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={holdCommunicationNotes} onChange={(e) => setHoldCommunicationNotes(e.target.value)} />
                  </Field>
                </div>
              ) : null}

              {administrationStatus === "Refused" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Refusal Reason">
                    <textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={refusalReason} onChange={(e) => setRefusalReason(e.target.value)} />
                  </Field>
                  <RadioGroup label="Patient Counselling Done" value={patientCounsellingDone} onChange={setPatientCounsellingDone} />
                  <RadioGroup label="Doctor Notified" value={refusalDoctorNotified} onChange={setRefusalDoctorNotified} />
                </div>
              ) : null}
            </Section>

            <Section title="Patient Observation">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField label="Patient Response" value={patientResponse} onChange={setPatientResponse}>
                  <option value="Stable">Stable</option>
                  <option value="Improved">Improved</option>
                  <option value="No Change">No Change</option>
                  <option value="Requires Monitoring">Requires Monitoring</option>
                </SelectField>
                <RadioGroup label="Adverse Reaction" value={adverseReaction} onChange={setAdverseReaction} />
                {adverseReaction === "Yes" ? (
                  <Field label="Reaction Details">
                    <textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={reactionDetails} onChange={(e) => setReactionDetails(e.target.value)} />
                  </Field>
                ) : null}
                <Field label="Observation Notes">
                  <textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={observationNotes} onChange={(e) => setObservationNotes(e.target.value)} />
                </Field>
              </div>
            </Section>
          </>
        ) : null}
      </div>
    </Drawer>
  );
}






