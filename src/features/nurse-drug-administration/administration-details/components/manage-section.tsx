import { Input } from "@/components/ui/input";

import type { MedicationAdministration } from "../types";
import { Field, RadioGroup, Section, SelectField, ReadOnly } from "../ui";

type Props = {
  selectedMedication: MedicationAdministration;
  status: string;
  reviewNote: string;
  setReviewNote: (value: string) => void;
  remainingQty: number;
  administeredQty: number;
  setAdministeredQty: (value: number) => void;
  setRemainingQty: (value: number) => void;
  lastAdministrationDate: string;
  lastAdministrationTime: string;
  administrationStatus: string;
  setAdministrationStatus: (value: string) => void;
  selectedRoute: string;
  setSelectedRoute: (value: string) => void;
  observation: string;
  setObservation: (value: string) => void;
  patientResponse: string;
  setPatientResponse: (value: string) => void;
  adverseReaction: string;
  setAdverseReaction: (value: string) => void;
  reactionDetails: string;
  setReactionDetails: (value: string) => void;
  observationNotes: string;
  setObservationNotes: (value: string) => void;
};

export function ManageSection(props: Props) {
  const { selectedMedication, status, reviewNote, setReviewNote, remainingQty, administeredQty, setAdministeredQty, setRemainingQty, lastAdministrationDate, lastAdministrationTime, administrationStatus, setAdministrationStatus, selectedRoute, setSelectedRoute, observation, setObservation, patientResponse, setPatientResponse, adverseReaction, setAdverseReaction, reactionDetails, setReactionDetails, observationNotes, setObservationNotes } = props;
  return (
    <>
      <Section title="Quick Order Summary">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          <ReadOnly label="Running Since" value={lastAdministrationDate || selectedMedication.startDate} />
          <ReadOnly label="Current Status" value={status} />
        </div>
      </Section>
      <Section title="Current Infusion Details">
        <div className="grid gap-3 sm:grid-cols-3">
          <ReadOnly label="Infusion Drug" value={selectedMedication.drugName} />
          <ReadOnly label="Diluent" value={selectedMedication.genericName || selectedMedication.drugName} />
          <ReadOnly label="Ordered Rate" value={selectedMedication.dose} />
          {/* <ReadOnly label="Rate Unit" value={selectedMedication.doseUnit} /> */}
          <ReadOnly label="Route" value={selectedMedication.route} />
          <ReadOnly label="Current Status" value={status} />
          <Field label="Current Infusion Rate"><Input type="text" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} /></Field>
          <Field label="Volume Infused"><Input type="number" value={remainingQty === 0 ? selectedMedication.administeredQty : administeredQty} onChange={(e) => setAdministeredQty(Number(e.target.value || 0))} /></Field>
          <Field label="Remaining Volume"><Input type="number" value={remainingQty} onChange={(e) => setRemainingQty(Number(e.target.value || 0))} /></Field>
          <SelectField label="Pump Status" value={administrationStatus} onChange={setAdministrationStatus}><option value="Running">Running</option><option value="Paused">Paused</option><option value="Completed">Completed</option><option value="Stopped">Stopped</option></SelectField>
          <SelectField label="Line Status" value={selectedRoute} onChange={setSelectedRoute}><option value="Patent">Patent</option><option value="Occluded">Occluded</option><option value="Infiltrated">Infiltrated</option><option value="Leaking">Leaking</option></SelectField>
          <Field label="Infusion Remarks"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={observation} onChange={(e) => setObservation(e.target.value)} /></Field>
        </div>
      </Section>
      <Section title="Patient Observation">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField label="Patient Response" value={patientResponse} onChange={setPatientResponse}><option value="Stable">Stable</option><option value="Improved">Improved</option><option value="No Change">No Change</option><option value="Requires Monitoring">Requires Monitoring</option></SelectField>
          <RadioGroup label="Adverse Reaction" value={adverseReaction} onChange={setAdverseReaction} />
          {adverseReaction === "Yes" ? <Field label="Reaction Details"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={reactionDetails} onChange={(e) => setReactionDetails(e.target.value)} /></Field> : null}
          <Field label="Observation Notes"><textarea className="min-h-24 w-full rounded-md border border-input  px-3 py-2 text-sm" value={observationNotes} onChange={(e) => setObservationNotes(e.target.value)} /></Field>
        </div>
      </Section>
    </>
  );
}
