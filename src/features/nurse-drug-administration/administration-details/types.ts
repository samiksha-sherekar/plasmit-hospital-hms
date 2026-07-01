export interface MedicationAdministration {
  id: string;
  patientId: string;
  patientName: string;
  drugName: string;
  genericName: string;
  category: string;
  form: string;
  dose: string;
  doseUnit: string;
  route: string;
  frequency: string;
  priority: string;
  orderDate: string;
  startDate: string;
  endDate: string;
  nextDueTime: string;
  orderStatus: "Pending" | "Dispensed" | "Received" | "Returned" | "Discontinued";
  status: MedicationStatusFilter;
  orderedQty: number;
  dispensedQty: number;
  receivedQty: number;
  administeredQty: number;
  timeline: TimelineCell[];
}

export type MedicationStatusFilter = "Pending" | "Due" | "Running" | "Administered" | "Held" | "Missed" | "Refused" | "Partial" | "Overdue" | "Received" |"Partially Administered";

export interface TimelineCell {
  date: string;
  time: string;
  label: string;
  status: "due" | "done" | "overdue" | "running" | "held";
}
