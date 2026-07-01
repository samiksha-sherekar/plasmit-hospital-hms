import type { MedicationAdministration } from "./types";

export function statusTone(status: string) {
  if (status === "Verified" || status === "Matched") return "success";
  if (status === "Warning") return "warning";
  if (status === "Failed" || status === "Mismatch" || status === "Expired" || status === "Not Received") return "danger";
  return "muted";
}

export function getMedicationState(medication: MedicationAdministration) {
  if (medication.status === "Running") return "Running";
  if (medication.status === "Partial") return "Partial";
  if (medication.status === "Held") return "Held";
  if (medication.status === "Missed") return "Missed";
  if (medication.status === "Refused") return "Refused";
  if (medication.status === "Administered") return "Administered";
  if (medication.status === "Due") return "Due";
  if (medication.status === "Overdue") return "Overdue";
  return medication.status;
}
