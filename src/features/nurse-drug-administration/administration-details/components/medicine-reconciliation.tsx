import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { MedicationAdministration } from "../types";
import { Field, ReadOnly, SelectField, Section } from "../ui";
import { statusTone } from "../utils";

export function MedicineReconciliation(props: {
  selectedMedication: MedicationAdministration;
  reconcileStatus: string;
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
}) {
  const { selectedMedication, reconcileStatus, activeInlineForm, setActiveInlineForm, notifyPriority, setNotifyPriority, notifyMessage, setNotifyMessage, returnQty, setReturnQty, returnReason, setReturnReason, returnRemarks, setReturnRemarks, clearInlineForm, toastAndAudit } = props;
  return <Section title="Medicine Reconciliation"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><ReadOnly label="Doctor Ordered Drug" value={selectedMedication.drugName} /><ReadOnly label="Doctor Ordered Dose" value={selectedMedication.dose} /><ReadOnly label="Doctor Ordered Route" value={selectedMedication.route} /><ReadOnly label="Pharmacy Dispensed Drug" value={selectedMedication.drugName} /><ReadOnly label="Pharmacy Dispensed Dose" value={selectedMedication.dose} /><ReadOnly label="Pharmacy Dispensed Route" value={selectedMedication.route} /><ReadOnly label="Nurse Received Drug" value={selectedMedication.drugName} /><ReadOnly label="Nurse Received Dose" value={selectedMedication.dose} /><ReadOnly label="Nurse Received Route" value={selectedMedication.route} /><ReadOnly label="Batch Number" value="BN-001" /><ReadOnly label="Expiry Date" value={selectedMedication.endDate} /><div className="rounded-md border border-border bg-surface px-3 py-2"><div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Reconciliation Status</div><div className="mt-2 flex items-center gap-2"><Badge tone={statusTone(reconcileStatus) as any}>{reconcileStatus}</Badge>{reconcileStatus !== "Matched" ? <span className="text-sm text-warning-foreground">Medication needs attention before administration.</span> : null}</div></div></div>{reconcileStatus !== "Matched" ? <><div className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning-foreground">Medication reconciliation requires review.</div><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => setActiveInlineForm("notify-pharmacy")}>Notify Pharmacy</Button><Button size="sm" variant="outline" onClick={() => setActiveInlineForm("return-medication")}>Return Medication</Button></div>{activeInlineForm === "notify-pharmacy" ? <div className="space-y-3 rounded-md border border-border bg-surface p-3"><div className="grid gap-3 sm:grid-cols-2"><SelectField label="Priority" value={notifyPriority} onChange={setNotifyPriority}><option value="Normal">Normal</option><option value="Urgent">Urgent</option></SelectField><Field label="Message"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} /></Field></div><div className="flex gap-2"><Button variant="outline" onClick={clearInlineForm}>Cancel</Button><Button onClick={() => toastAndAudit("Notification sent successfully.", `Notified pharmacy with priority ${notifyPriority} for ${selectedMedication.drugName}.`)}>Send Notification</Button></div></div> : null}{activeInlineForm === "return-medication" ? <div className="space-y-3 rounded-md border border-border bg-surface p-3"><div className="grid gap-3 sm:grid-cols-2"><Field label="Return Qty"><Input type="number" value={returnQty} onChange={(e) => setReturnQty(e.target.value)} /></Field><SelectField label="Return Reason" value={returnReason} onChange={setReturnReason}><option value="">Select</option><option value="Drug Mismatch">Drug Mismatch</option><option value="Wrong Strength">Wrong Strength</option><option value="Expired Medication">Expired Medication</option><option value="Damaged Medication">Damaged Medication</option><option value="Other">Other</option></SelectField><Field label="Remarks"><textarea className="min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm" value={returnRemarks} onChange={(e) => setReturnRemarks(e.target.value)} /></Field></div><div className="flex gap-2"><Button variant="outline" onClick={clearInlineForm}>Cancel</Button><Button onClick={() => toastAndAudit(`Returned ${returnQty || 0} qty successfully.`, `Returned medication for ${selectedMedication.drugName}.`) }>Confirm Return</Button></div></div> : null}</> : null}</Section>;
}

