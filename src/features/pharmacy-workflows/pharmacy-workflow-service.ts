export type PharmacyWorkflowStatus = "Ready" | "Pending setup" | "Review";

export type PharmacyWorkflowRecord = {
  id: string;
  reference: string;
  owner: string;
  status: PharmacyWorkflowStatus;
  updatedAt: string;
};

export async function listPharmacyWorkflowRecords(workflow: string): Promise<PharmacyWorkflowRecord[]> {
  // Future API integration point: replace static records with fetch/client call.
  return [
    { id: `${workflow}-001`, reference: `${workflow.toUpperCase()}-001`, owner: "Pharmacy", status: "Ready", updatedAt: "Today" },
    { id: `${workflow}-002`, reference: `${workflow.toUpperCase()}-002`, owner: "Pharmacist", status: "Pending setup", updatedAt: "Yesterday" },
  ];
}

