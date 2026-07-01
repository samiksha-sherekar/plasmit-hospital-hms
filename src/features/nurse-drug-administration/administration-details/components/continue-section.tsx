import { Input } from "@/components/ui/input";

import type { MedicationAdministration } from "../types";
import { Field, RadioGroup, Section, SelectField, ReadOnly } from "../ui";

type Props = {
  selectedMedication: MedicationAdministration;
  status: string;
  lastAdministrationDate: string;
  lastAdministrationTime: string;
  lastAdministeredBy: string;
  overrideReason: string;
  currentRemainingQty: number;
  administrationDate: string;
  setAdministrationDate: (value: string) => void;
  administrationTime: string;
  setAdministrationTime: (value: string) => void;
  doseToGive: string;
  setDoseToGive: (value: string) => void;
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
  refusalReason: string;
  setRefusalReason: (value: string) => void;
  patientCounsellingDone: string;
  setPatientCounsellingDone: (value: string) => void;
  refusalDoctorNotified: string;
  setRefusalDoctorNotified: (value: string) => void;
  patientResponse: string;
  setPatientResponse: (value: string) => void;
  adverseReaction: string;
  setAdverseReaction: (value: string) => void;
  reactionDetails: string;
  setReactionDetails: (value: string) => void;
  observationNotes: string;
  setObservationNotes: (value: string) => void;
};

export function ContinueSection(props: Props) {
  const { selectedMedication, status, lastAdministrationDate, lastAdministrationTime, lastAdministeredBy, overrideReason, currentRemainingQty, administrationDate, setAdministrationDate, administrationTime, setAdministrationTime, doseToGive, setDoseToGive, administrationStatus, setAdministrationStatus, observation, setObservation, holdReason, setHoldReason, holdDoctorNotified, setHoldDoctorNotified, holdCommunicationNotes, setHoldCommunicationNotes, refusalReason, setRefusalReason, patientCounsellingDone, setPatientCounsellingDone, refusalDoctorNotified, setRefusalDoctorNotified, patientResponse, setPatientResponse, adverseReaction, setAdverseReaction, reactionDetails, setReactionDetails, observationNotes, setObservationNotes } = props;
  return (
    <>
      <Section title="Quick Order Summary">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReadOnly label="Drug Name" value={selectedMedication.drugName} />
          <ReadOnly label="Generic Name" value={selectedMedication.genericName ?? ""} />
          <ReadOnly label="Category" value={selectedMedication.category} />
          <ReadOnly label="Dose" value={selectedMedication.dose ?? selectedMedication.dosage} />
          <ReadOnly label="Dose Unit" value={selectedMedication.doseUnit ?? ""} />
          <ReadOnly label="Route" value={selectedMedication.route ?? ""} />
          <ReadOnly label="Frequency" value={selectedMedication.frequency} />
          <ReadOnly label="Priority" value={selectedMedication.priority ?? ""} />
          <ReadOnly label="Current Status" value={status} />
          <ReadOnly label="Scheduled Time" value={selectedMedication.nextDueTime ?? ""} />
          <ReadOnly label="Next Due Time" value={selectedMedication.nextDueTime ?? ""} />
        </div>
      </Section>
      <Section title="Previous Administration Details">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <ReadOnly label="Previous Administration Date" value={lastAdministrationDate ?? selectedMedication.orderDate ?? ""} />
          <ReadOnly label="Previous Administration Time" value={lastAdministrationTime ?? selectedMedication.nextDueTime ?? ""} />
          <ReadOnly label="Previous Dose Given" value={selectedMedication.administeredQty ? `${selectedMedication.administeredQty}` : ""} />
          <ReadOnly label="Administered By" value={lastAdministeredBy || "Current User"} />
          <ReadOnly label="Partial Administration Reason" value={overrideReason || ""} />
          <ReadOnly label="Remaining Quantity" value={`${currentRemainingQty}`} />
        </div>
      </Section>
      <Section title="Continue Administration">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Administration Date"><Input type="date" value={administrationDate} onChange={(e) => setAdministrationDate(e.target.value)} /></Field>
          <Field label="Administration Time"><Input type="time" value={administrationTime} onChange={(e) => setAdministrationTime(e.target.value)} /></Field>
          <Field label="Dose To Give"><Input type="number" min="0" max={currentRemainingQty} value={doseToGive} onChange={(e) => setDoseToGive(e.target.value)} /></Field>
          <ReadOnly label="Dose Unit" value={selectedMedication.doseUnit ?? ""} />
          <SelectField label="Administration Status" value={administrationStatus} onChange={setAdministrationStatus}><option value="Administered">Administered</option><option value="Held">Held</option><option value="Refused">Refused</option></SelectField>
          <Field label="Administration Remarks"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={observation} onChange={(e) => setObservation(e.target.value)} /></Field>
        </div>
        {administrationStatus === "Held" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField label="Hold Reason" value={holdReason} onChange={setHoldReason}><option value="">Select</option><option value="Patient Condition">Patient Condition</option><option value="Doctor Instruction">Doctor Instruction</option><option value="Medication Unavailable">Medication Unavailable</option><option value="Clinical Decision">Clinical Decision</option><option value="Other">Other</option></SelectField>
            <RadioGroup label="Doctor Notified" value={holdDoctorNotified} onChange={setHoldDoctorNotified} />
            <Field label="Communication Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={holdCommunicationNotes} onChange={(e) => setHoldCommunicationNotes(e.target.value)} /></Field>
          </div>
        ) : null}
        {administrationStatus === "Refused" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Refusal Reason"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={refusalReason} onChange={(e) => setRefusalReason(e.target.value)} /></Field>
            <RadioGroup label="Patient Counselling Done" value={patientCounsellingDone} onChange={setPatientCounsellingDone} />
            <RadioGroup label="Doctor Notified" value={refusalDoctorNotified} onChange={setRefusalDoctorNotified} />
          </div>
        ) : null}
      </Section>
      <Section title="Patient Observation">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField label="Patient Response" value={patientResponse} onChange={setPatientResponse}><option value="Stable">Stable</option><option value="Improved">Improved</option><option value="No Change">No Change</option><option value="Requires Monitoring">Requires Monitoring</option></SelectField>
          <RadioGroup label="Adverse Reaction" value={adverseReaction} onChange={setAdverseReaction} />
          {adverseReaction === "Yes" ? <Field label="Reaction Details"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={reactionDetails} onChange={(e) => setReactionDetails(e.target.value)} /></Field> : null}
          <Field label="Observation Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={observationNotes} onChange={(e) => setObservationNotes(e.target.value)} /></Field>
        </div>
      </Section>
    </>
  );
}








