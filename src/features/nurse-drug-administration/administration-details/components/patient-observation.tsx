import { Input } from "@/components/ui/input";

import type { MedicationAdministration } from "../types";
import { Field, RadioGroup, Section, SelectField, ReadOnly } from "../ui";

export function PatientObservation(props: {
  patientResponse: string;
  setPatientResponse: (value: string) => void;
  adverseReaction: string;
  setAdverseReaction: (value: string) => void;
  reactionDetails: string;
  setReactionDetails: (value: string) => void;
  observationNotes: string;
  setObservationNotes: (value: string) => void;
}) {
  const { patientResponse, setPatientResponse, adverseReaction, setAdverseReaction, reactionDetails, setReactionDetails, observationNotes, setObservationNotes } = props;
  return <Section title="Patient Observation"><div className="grid gap-3 sm:grid-cols-2"><SelectField label="Patient Response" value={patientResponse} onChange={setPatientResponse}><option value="Stable">Stable</option><option value="Improved">Improved</option><option value="No Change">No Change</option><option value="Requires Monitoring">Requires Monitoring</option></SelectField><RadioGroup label="Adverse Reaction" value={adverseReaction} onChange={setAdverseReaction} />{adverseReaction === "Yes" ? <Field label="Reaction Details"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={reactionDetails} onChange={(e) => setReactionDetails(e.target.value)} /></Field> : null}<Field label="Observation Notes"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={observationNotes} onChange={(e) => setObservationNotes(e.target.value)} /></Field></div></Section>;
}
