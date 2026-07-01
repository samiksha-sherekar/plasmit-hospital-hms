import { Input } from "@/components/ui/input";

import type { MedicationAdministration } from "../types";
import { Field, ReadOnly, RadioGroup, SelectField, Section } from "../ui";

export function AdministrationDetails(props: {
  selectedMedication: MedicationAdministration;
  canShowAdminFields: boolean;
  administrationDate: string;
  setAdministrationDate: (value: string) => void;
  administrationTime: string;
  setAdministrationTime: (value: string) => void;
  doseToGive: string;
  setDoseToGive: (value: string) => void;
  currentRemainingQty: number;
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
}) {
  const { selectedMedication, canShowAdminFields, administrationDate, setAdministrationDate, administrationTime, setAdministrationTime, doseToGive, setDoseToGive, currentRemainingQty, administrationStatus, setAdministrationStatus, observation, setObservation, holdReason, setHoldReason, holdDoctorNotified, setHoldDoctorNotified, holdCommunicationNotes, setHoldCommunicationNotes, missedReason, setMissedReason, missedDoctorNotified, setMissedDoctorNotified, missedNotes, setMissedNotes, refusalReason, setRefusalReason, patientCounsellingDone, setPatientCounsellingDone, refusalDoctorNotified, setRefusalDoctorNotified, givenQty, setGivenQty, partialReason, setPartialReason } = props;
  return <Section title="Administration Details"><div className="grid gap-3 sm:grid-cols-2"><Field label="Administration Date"><Input type="date" value={administrationDate} onChange={(event) => setAdministrationDate(event.target.value)} disabled={!canShowAdminFields} /></Field><Field label="Administration Time"><Input type="time" value={administrationTime} onChange={(event) => setAdministrationTime(event.target.value)} disabled={!canShowAdminFields} /></Field><Field label="Administered Dose"><Input type="number" min="0" value={doseToGive} onChange={(event) => setDoseToGive(event.target.value)} disabled={!canShowAdminFields} /></Field><ReadOnly label="Dose Unit" value={selectedMedication.doseUnit ?? ""} /><ReadOnly label="Administration Route" value={selectedMedication.route ?? ""} /><SelectField label="Administration Status" value={administrationStatus} onChange={setAdministrationStatus}><option value="Administered">Administered</option><option value="Held">Held</option><option value="Missed">Missed</option><option value="Refused">Refused</option><option value="Partially Administered">Partially Administered</option></SelectField>{administrationStatus === "Administered" ? <Field label="Administration Remarks"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={observation} onChange={(e) => setObservation(e.target.value)} disabled={!canShowAdminFields} /></Field> : null}</div>{administrationStatus === "Held" ? <div className="grid gap-3 sm:grid-cols-2"><SelectField label="Hold Reason" value={holdReason} onChange={setHoldReason}><option value="">Select</option><option value="Patient Condition">Patient Condition</option><option value="Doctor Instruction">Doctor Instruction</option><option value="Medication Unavailable">Medication Unavailable</option><option value="Clinical Decision">Clinical Decision</option><option value="Other">Other</option></SelectField><RadioGroup label="Doctor Notified" value={holdDoctorNotified} onChange={setHoldDoctorNotified} /><Field label="Communication Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={holdCommunicationNotes} onChange={(e) => setHoldCommunicationNotes(e.target.value)} /></Field></div> : null}{administrationStatus === "Missed" ? <div className="grid gap-3 sm:grid-cols-2"><SelectField label="Missed Reason" value={missedReason} onChange={setMissedReason}><option value="">Select</option><option value="Patient Not Available">Patient Not Available</option><option value="Medication Unavailable">Medication Unavailable</option><option value="Procedure Conflict">Procedure Conflict</option><option value="Clinical Decision">Clinical Decision</option><option value="Other">Other</option></SelectField><RadioGroup label="Doctor Notified" value={missedDoctorNotified} onChange={setMissedDoctorNotified} /><Field label="Missed Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={missedNotes} onChange={(e) => setMissedNotes(e.target.value)} /></Field></div> : null}{administrationStatus === "Refused" ? <div className="grid gap-3 sm:grid-cols-2"><Field label="Refusal Reason"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={refusalReason} onChange={(e) => setRefusalReason(e.target.value)} /></Field><RadioGroup label="Patient Counselling Done" value={patientCounsellingDone} onChange={setPatientCounsellingDone} /><RadioGroup label="Doctor Notified" value={refusalDoctorNotified} onChange={setRefusalDoctorNotified} /></div> : null}{administrationStatus === "Partially Administered" ? <div className="grid gap-3 sm:grid-cols-2"><Field label="Given Qty"><Input type="number" value={givenQty} onChange={(e) => setGivenQty(e.target.value)} /></Field><ReadOnly label="Remaining Qty" value={`${Math.max(currentRemainingQty - (Number(givenQty) || 0), 0)}`} /><Field label="Partial Administration Reason"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={partialReason} onChange={(e) => setPartialReason(e.target.value)} /></Field></div> : null}</Section>;
}









