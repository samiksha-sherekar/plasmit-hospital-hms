import type { MedicationAdministration } from "../types";
import { Field, RadioGroup, Section, SelectField, ReadOnly } from "../ui";

type Props = {
  selectedMedication: MedicationAdministration;
  status: string;
  lastAdministrationDate: string;
  lastAdministrationTime: string;
  lastAdministeredBy: string;
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
  reviewNote: string;
  setReviewNote: (value: string) => void;
  nurseVerified: boolean;
  setNurseVerified: (value: boolean) => void;
};

export function ReviewSection(props: Props) {
  const { selectedMedication, status, lastAdministrationDate, lastAdministrationTime, lastAdministeredBy, holdReason, setHoldReason, holdDoctorNotified, setHoldDoctorNotified, holdCommunicationNotes, setHoldCommunicationNotes, missedReason, setMissedReason, missedDoctorNotified, setMissedDoctorNotified, missedNotes, setMissedNotes, refusalReason, setRefusalReason, patientCounsellingDone, setPatientCounsellingDone, refusalDoctorNotified, setRefusalDoctorNotified, reviewNote, setReviewNote, nurseVerified, setNurseVerified } = props;
  return (
    <>
      <Section title="Quick Order Summary">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ReadOnly label="Drug Name" value={selectedMedication.drugName} />
          <ReadOnly label="Dose" value={selectedMedication.dose ?? selectedMedication.dosage ?? selectedMedication.dosage} />
          <ReadOnly label="Doctor Name" value={selectedMedication.frequency || ""} />
          <ReadOnly label="Route" value={selectedMedication.route ?? ""} />
          <ReadOnly label="Frequency" value={selectedMedication.frequency} />
          <ReadOnly label="Current Status" value={status} />
          <ReadOnly label="Scheduled Time" value={selectedMedication.nextDueTime ?? ""} />
        </div>
      </Section>
      {status === "Held" ? (
        <Section title="Review Details">
          <div className="grid gap-3 sm:grid-cols-2">
            <ReadOnly label="Held Date" value={lastAdministrationDate ?? selectedMedication.orderDate ?? ""} />
            <ReadOnly label="Held Time" value={lastAdministrationTime ?? selectedMedication.nextDueTime ?? ""} />
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
            <ReadOnly label="Missed Date" value={lastAdministrationDate ?? selectedMedication.orderDate ?? ""} />
            <ReadOnly label="Missed Time" value={lastAdministrationTime ?? selectedMedication.nextDueTime ?? ""} />
            <ReadOnly label="Scheduled Time" value={selectedMedication.nextDueTime ?? ""} />
            <SelectField label="Missed Reason" value={missedReason} onChange={setMissedReason}><option value="">Select</option><option value="Patient Away">Patient Away</option><option value="Procedure">Procedure</option><option value="Clinical Decision">Clinical Decision</option><option value="Other">Other</option></SelectField>
            <RadioGroup label="Doctor Notified" value={missedDoctorNotified} onChange={setMissedDoctorNotified} />
            <Field label="Follow-up Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={missedNotes} onChange={(e) => setMissedNotes(e.target.value)} /></Field>
          </div>
        </Section>
      ) : null}
      {status === "Refused" ? (
        <Section title="Review Details">
          <div className="grid gap-3 sm:grid-cols-2">
            <ReadOnly label="Refused Date" value={lastAdministrationDate ?? selectedMedication.orderDate ?? ""} />
            <ReadOnly label="Refused Time" value={lastAdministrationTime ?? selectedMedication.nextDueTime ?? ""} />
            <Field label="Refusal Reason"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={refusalReason} onChange={(e) => setRefusalReason(e.target.value)} /></Field>
            <RadioGroup label="Patient Counselling Done" value={patientCounsellingDone} onChange={setPatientCounsellingDone} />
            <RadioGroup label="Doctor Notified" value={refusalDoctorNotified} onChange={setRefusalDoctorNotified} />
            <Field label="Follow-up Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} /></Field>
          </div>
        </Section>
      ) : null}
      <Section title="Review Notes"><Field label="Review Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} /></Field></Section>
    </>
  );
}








