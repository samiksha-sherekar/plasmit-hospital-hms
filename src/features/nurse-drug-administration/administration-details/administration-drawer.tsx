"use client";

import * as React from "react";
import { toast } from "sonner";

import { Drawer } from "@/components/ui/drawer";

import type { MedicationAdministration } from "./types";
import { getMedicationState } from "./utils";
import { AdministerSection } from "./components/administer-section";
import { DrawerFooter } from "./components/drawer-footer";
import { ContinueSection } from "./components/continue-section";
import { ManageSection } from "./components/manage-section";
import { ReviewSection } from "./components/review-section";

export type AdministrationActionType = "administer" | "manage" | "review" | "continue";

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
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description={`${selectedMedication.drugName} / ${selectedMedication.category}`} className="w-[calc(100vw-2rem)] max-w-4xl" footer={<DrawerFooter actionType={actionType} onCancel={() => onOpenChange(false)} onSaveDraft={saveDraft} onConfirmAdminister={confirmAdminister} onCompleteContinueAdministration={completeContinueAdministration} administerReady={administerReady} continueReady={continueReady} />}>
      <div className="space-y-4">
        {actionType === "administer" ? <AdministerSection selectedMedication={selectedMedication} status={status} quickSummary={quickSummary} reconcileStatus={reconcileStatus} rightPatientStatus={rightPatientStatus} rightDrugStatus={rightDrugStatus} rightDoseStatus={rightDoseStatus} rightRouteStatus={rightRouteStatus} rightTimeStatus={rightTimeStatus} canShowVerification={canShowVerification} nurseVerified={nurseVerified} setNurseVerified={setNurseVerified} verifiedOn={verifiedOn} setVerifiedOn={setVerifiedOn} nowString={nowString} administrationDate={administrationDate} setAdministrationDate={setAdministrationDate} administrationTime={administrationTime} setAdministrationTime={setAdministrationTime} doseToGive={doseToGive} setDoseToGive={setDoseToGive} currentRemainingQty={currentRemainingQty} canShowAdminFields={canShowAdminFields} administrationStatus={administrationStatus} setAdministrationStatus={setAdministrationStatus} observation={observation} setObservation={setObservation} holdReason={holdReason} setHoldReason={setHoldReason} holdDoctorNotified={holdDoctorNotified} setHoldDoctorNotified={setHoldDoctorNotified} holdCommunicationNotes={holdCommunicationNotes} setHoldCommunicationNotes={setHoldCommunicationNotes} missedReason={missedReason} setMissedReason={setMissedReason} missedDoctorNotified={missedDoctorNotified} setMissedDoctorNotified={setMissedDoctorNotified} missedNotes={missedNotes} setMissedNotes={setMissedNotes} refusalReason={refusalReason} setRefusalReason={setRefusalReason} patientCounsellingDone={patientCounsellingDone} setPatientCounsellingDone={setPatientCounsellingDone} refusalDoctorNotified={refusalDoctorNotified} setRefusalDoctorNotified={setRefusalDoctorNotified} givenQty={givenQty} setGivenQty={setGivenQty} partialReason={partialReason} setPartialReason={setPartialReason} patientResponse={patientResponse} setPatientResponse={setPatientResponse} adverseReaction={adverseReaction} setAdverseReaction={setAdverseReaction} reactionDetails={reactionDetails} setReactionDetails={setReactionDetails} observationNotes={observationNotes} setObservationNotes={setObservationNotes} activeInlineForm={activeInlineForm} setActiveInlineForm={setActiveInlineForm} notifyPriority={notifyPriority} setNotifyPriority={setNotifyPriority} notifyMessage={notifyMessage} setNotifyMessage={setNotifyMessage} returnQty={returnQty} setReturnQty={setReturnQty} returnReason={returnReason} setReturnReason={setReturnReason} returnRemarks={returnRemarks} setReturnRemarks={setReturnRemarks} clearInlineForm={clearInlineForm} toastAndAudit={toastAndAudit} /> : null}
        {actionType === "manage" ? <ManageSection selectedMedication={selectedMedication} status={status} reviewNote={reviewNote} setReviewNote={setReviewNote} remainingQty={remainingQty} administeredQty={administeredQty} setAdministeredQty={setAdministeredQty} setRemainingQty={setRemainingQty} lastAdministrationDate={lastAdministrationDate} lastAdministrationTime={lastAdministrationTime} administrationStatus={administrationStatus} setAdministrationStatus={setAdministrationStatus} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} observation={observation} setObservation={setObservation} patientResponse={patientResponse} setPatientResponse={setPatientResponse} adverseReaction={adverseReaction} setAdverseReaction={setAdverseReaction} reactionDetails={reactionDetails} setReactionDetails={setReactionDetails} observationNotes={observationNotes} setObservationNotes={setObservationNotes} /> : null}
        {actionType === "review" ? <ReviewSection selectedMedication={selectedMedication} status={status} lastAdministrationDate={lastAdministrationDate} lastAdministrationTime={lastAdministrationTime} lastAdministeredBy={lastAdministeredBy} holdReason={holdReason} setHoldReason={setHoldReason} holdDoctorNotified={holdDoctorNotified} setHoldDoctorNotified={setHoldDoctorNotified} holdCommunicationNotes={holdCommunicationNotes} setHoldCommunicationNotes={setHoldCommunicationNotes} missedReason={missedReason} setMissedReason={setMissedReason} missedDoctorNotified={missedDoctorNotified} setMissedDoctorNotified={setMissedDoctorNotified} missedNotes={missedNotes} setMissedNotes={setMissedNotes} refusalReason={refusalReason} setRefusalReason={setRefusalReason} patientCounsellingDone={patientCounsellingDone} setPatientCounsellingDone={setPatientCounsellingDone} refusalDoctorNotified={refusalDoctorNotified} setRefusalDoctorNotified={setRefusalDoctorNotified} reviewNote={reviewNote} setReviewNote={setReviewNote} nurseVerified={nurseVerified} setNurseVerified={setNurseVerified} /> : null}
        {actionType === "continue" ? <ContinueSection selectedMedication={selectedMedication} status={status} lastAdministrationDate={lastAdministrationDate} lastAdministrationTime={lastAdministrationTime} lastAdministeredBy={lastAdministeredBy} overrideReason={overrideReason} currentRemainingQty={currentRemainingQty} administrationDate={administrationDate} setAdministrationDate={setAdministrationDate} administrationTime={administrationTime} setAdministrationTime={setAdministrationTime} doseToGive={doseToGive} setDoseToGive={setDoseToGive} administrationStatus={administrationStatus} setAdministrationStatus={setAdministrationStatus} observation={observation} setObservation={setObservation} holdReason={holdReason} setHoldReason={setHoldReason} holdDoctorNotified={holdDoctorNotified} setHoldDoctorNotified={setHoldDoctorNotified} holdCommunicationNotes={holdCommunicationNotes} setHoldCommunicationNotes={setHoldCommunicationNotes} refusalReason={refusalReason} setRefusalReason={setRefusalReason} patientCounsellingDone={patientCounsellingDone} setPatientCounsellingDone={setPatientCounsellingDone} refusalDoctorNotified={refusalDoctorNotified} setRefusalDoctorNotified={setRefusalDoctorNotified} patientResponse={patientResponse} setPatientResponse={setPatientResponse} adverseReaction={adverseReaction} setAdverseReaction={setAdverseReaction} reactionDetails={reactionDetails} setReactionDetails={setReactionDetails} observationNotes={observationNotes} setObservationNotes={setObservationNotes} /> : null}
      </div>
    </Drawer>
  );
}







