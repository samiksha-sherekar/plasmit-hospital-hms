"use client";

import * as React from "react";

import type { MedicationAdministration } from "../types";

export function useAdministrationDrawerState(open: boolean, selectedMedication: MedicationAdministration | null, actionType: string | null) {
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

  return {
    reviewNote, setReviewNote,
    observation, setObservation,
    administrationDate, setAdministrationDate,
    administrationTime, setAdministrationTime,
    doseToGive, setDoseToGive,
    administrationStatus, setAdministrationStatus,
    remainingQty, setRemainingQty,
    administeredQty, setAdministeredQty,
    lastAdministrationDate, setLastAdministrationDate,
    lastAdministrationTime, setLastAdministrationTime,
    lastAdministeredBy, setLastAdministeredBy,
    activeInlineForm, setActiveInlineForm,
    auditTrail, setAuditTrail,
    nurseVerified, setNurseVerified,
    verifiedOn, setVerifiedOn,
    draftSavedAt, setDraftSavedAt,
    notifyPriority, setNotifyPriority,
    notifyMessage, setNotifyMessage,
    returnQty, setReturnQty,
    returnReason, setReturnReason,
    returnRemarks, setReturnRemarks,
    orderedPatient, setOrderedPatient,
    selectedPatient, setSelectedPatient,
    verificationNotes, setVerificationNotes,
    orderedDose, setOrderedDose,
    enteredDose, setEnteredDose,
    doseCorrectionNotes, setDoseCorrectionNotes,
    orderedRoute, setOrderedRoute,
    selectedRoute, setSelectedRoute,
    routeCorrectionNotes, setRouteCorrectionNotes,
    overrideReason, setOverrideReason,
    patientResponse, setPatientResponse,
    adverseReaction, setAdverseReaction,
    reactionDetails, setReactionDetails,
    observationNotes, setObservationNotes,
    holdReason, setHoldReason,
    holdDoctorNotified, setHoldDoctorNotified,
    holdCommunicationNotes, setHoldCommunicationNotes,
    missedReason, setMissedReason,
    missedDoctorNotified, setMissedDoctorNotified,
    missedNotes, setMissedNotes,
    refusalReason, setRefusalReason,
    patientCounsellingDone, setPatientCounsellingDone,
    refusalDoctorNotified, setRefusalDoctorNotified,
    givenQty, setGivenQty,
    partialReason, setPartialReason,
  };
}
