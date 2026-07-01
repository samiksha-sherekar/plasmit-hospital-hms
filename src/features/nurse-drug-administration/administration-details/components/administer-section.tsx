import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { QuickOrderSummary } from "./quick-order-summary";
import { MedicineReconciliation } from "./medicine-reconciliation";
import { FiveRightsCheck } from "./five-rights-check";
import { AdministrationDetails } from "./administration-details";
import { PatientObservation } from "./patient-observation";
import type { MedicationAdministration } from "../types";

type Props = {
  selectedMedication: MedicationAdministration;
  status: string;
  quickSummary: readonly (readonly [string, string])[];
  reconcileStatus: string;
  rightPatientStatus: string;
  rightDrugStatus: string;
  rightDoseStatus: string;
  rightRouteStatus: string;
  rightTimeStatus: string;
  canShowVerification: boolean;
  nurseVerified: boolean;
  setNurseVerified: (value: boolean) => void;
  verifiedOn: string;
  setVerifiedOn: (value: string) => void;
  nowString: string;
  administrationDate: string;
  setAdministrationDate: (value: string) => void;
  administrationTime: string;
  setAdministrationTime: (value: string) => void;
  doseToGive: string;
  setDoseToGive: (value: string) => void;
  currentRemainingQty: number;
  canShowAdminFields: boolean;
  administrationStatus: string;
  setAdministrationStatus: (value: string) => void;
  observation: string;
  setObservation: (value: string) => void;
  holdReason: string;
  setHoldReason: (value: string) => void;
  holdDoctorNotified: string;
  setHoldDoctorNotified: (value: string) => void;
  holdCommunicationNotes: string;
  setHoldCommunicationNotes: (value: string) => void;
  missedReason: string;
  setMissedReason: (value: string) => void;
  missedDoctorNotified: string;
  setMissedDoctorNotified: (value: string) => void;
  missedNotes: string;
  setMissedNotes: (value: string) => void;
  refusalReason: string;
  setRefusalReason: (value: string) => void;
  patientCounsellingDone: string;
  setPatientCounsellingDone: (value: string) => void;
  refusalDoctorNotified: string;
  setRefusalDoctorNotified: (value: string) => void;
  givenQty: string;
  setGivenQty: (value: string) => void;
  partialReason: string;
  setPartialReason: (value: string) => void;
  patientResponse: string;
  setPatientResponse: (value: string) => void;
  adverseReaction: string;
  setAdverseReaction: (value: string) => void;
  reactionDetails: string;
  setReactionDetails: (value: string) => void;
  observationNotes: string;
  setObservationNotes: (value: string) => void;
  activeInlineForm: string | null;
  setActiveInlineForm: (value: string | null) => void;
  notifyPriority: string;
  setNotifyPriority: (value: string) => void;
  notifyMessage: string;
  setNotifyMessage: (value: string) => void;
  returnQty: string;
  setReturnQty: (value: string) => void;
  returnReason: string;
  setReturnReason: (value: string) => void;
  returnRemarks: string;
  setReturnRemarks: (value: string) => void;
  clearInlineForm: () => void;
  toastAndAudit: (message: string, audit: string) => void;
};

export function AdministerSection(props: Props) {
  const { selectedMedication, status, quickSummary, reconcileStatus, rightPatientStatus, rightDrugStatus, rightDoseStatus, rightRouteStatus, rightTimeStatus, canShowVerification, nurseVerified, setNurseVerified, verifiedOn, setVerifiedOn, nowString, administrationDate, setAdministrationDate, administrationTime, setAdministrationTime, doseToGive, setDoseToGive, currentRemainingQty, canShowAdminFields, administrationStatus, setAdministrationStatus, observation, setObservation, holdReason, setHoldReason, holdDoctorNotified, setHoldDoctorNotified, holdCommunicationNotes, setHoldCommunicationNotes, missedReason, setMissedReason, missedDoctorNotified, setMissedDoctorNotified, missedNotes, setMissedNotes, refusalReason, setRefusalReason, patientCounsellingDone, setPatientCounsellingDone, refusalDoctorNotified, setRefusalDoctorNotified, givenQty, setGivenQty, partialReason, setPartialReason, patientResponse, setPatientResponse, adverseReaction, setAdverseReaction, reactionDetails, setReactionDetails, observationNotes, setObservationNotes, activeInlineForm, setActiveInlineForm, notifyPriority, setNotifyPriority, notifyMessage, setNotifyMessage, returnQty, setReturnQty, returnReason, setReturnReason, returnRemarks, setReturnRemarks, clearInlineForm, toastAndAudit } = props;
  return <>
    <QuickOrderSummary rows={quickSummary} />
    <MedicineReconciliation selectedMedication={selectedMedication} reconcileStatus={reconcileStatus} activeInlineForm={activeInlineForm} setActiveInlineForm={setActiveInlineForm} notifyPriority={notifyPriority} setNotifyPriority={setNotifyPriority} notifyMessage={notifyMessage} setNotifyMessage={setNotifyMessage} returnQty={returnQty} setReturnQty={setReturnQty} returnReason={returnReason} setReturnReason={setReturnReason} returnRemarks={returnRemarks} setReturnRemarks={setReturnRemarks} clearInlineForm={clearInlineForm} toastAndAudit={toastAndAudit} />
    <FiveRightsCheck rightPatientStatus={rightPatientStatus} rightDrugStatus={rightDrugStatus} rightDoseStatus={rightDoseStatus} rightRouteStatus={rightRouteStatus} rightTimeStatus={rightTimeStatus} canShowVerification={canShowVerification} nurseVerified={nurseVerified} setNurseVerified={setNurseVerified} verifiedOn={verifiedOn} setVerifiedOn={setVerifiedOn} nowString={nowString} />
    <AdministrationDetails selectedMedication={selectedMedication} canShowAdminFields={canShowAdminFields} administrationDate={administrationDate} setAdministrationDate={setAdministrationDate} administrationTime={administrationTime} setAdministrationTime={setAdministrationTime} doseToGive={doseToGive} setDoseToGive={setDoseToGive} currentRemainingQty={currentRemainingQty} administrationStatus={administrationStatus} setAdministrationStatus={setAdministrationStatus} observation={observation} setObservation={setObservation} holdReason={holdReason} setHoldReason={setHoldReason} holdDoctorNotified={holdDoctorNotified} setHoldDoctorNotified={setHoldDoctorNotified} holdCommunicationNotes={holdCommunicationNotes} setHoldCommunicationNotes={setHoldCommunicationNotes} missedReason={missedReason} setMissedReason={setMissedReason} missedDoctorNotified={missedDoctorNotified} setMissedDoctorNotified={setMissedDoctorNotified} missedNotes={missedNotes} setMissedNotes={setMissedNotes} refusalReason={refusalReason} setRefusalReason={setRefusalReason} patientCounsellingDone={patientCounsellingDone} setPatientCounsellingDone={setPatientCounsellingDone} refusalDoctorNotified={refusalDoctorNotified} setRefusalDoctorNotified={setRefusalDoctorNotified} givenQty={givenQty} setGivenQty={setGivenQty} partialReason={partialReason} setPartialReason={setPartialReason} />
    <PatientObservation patientResponse={patientResponse} setPatientResponse={setPatientResponse} adverseReaction={adverseReaction} setAdverseReaction={setAdverseReaction} reactionDetails={reactionDetails} setReactionDetails={setReactionDetails} observationNotes={observationNotes} setObservationNotes={setObservationNotes} />
  </>;
}
