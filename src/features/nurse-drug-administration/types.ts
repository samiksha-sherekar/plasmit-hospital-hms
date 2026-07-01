export type NurseDrugCategory =
  | "Scheduled"
  | "SOS"
  | "STAT"
  | "Bolus"
  | "Diluent"
  | "Intermittent"
  | "Continuous"
  | "Discontinued"
  | "Unscheduled";

export type OrderStatus =
  | "Pending"
  | "Dispensed"
  | "Received"
  | "Returned"
  | "Discontinued";

export type AdministrationStatus =
  | "Due"
  | "Overdue"
  | "Running"
  | "Administered"
  | "Held"
  | "Missed"
  | "Refused"
  | "Partial"
  | "Returned"
  | "Discontinued";

export type AdministrationCellStatus =
  | "due"
  | "overdue"
  | "administered"
  | "done"
  | "running"
  | "held"
  | "missed"
  | "refused"
  | "partial"
  | "bolus"
  | "infusion"
  | "empty";

export type AdministrationAction =
  | "Administered"
  | "Not administered"
  | "Late administered"
  | "Held"
  | "Missed"
  | "Refused"
  | "Partial";

export type VerificationStatus = "Verified" | "Warning" | "Failed";
export type ReconciliationStatus = "Matched" | "Mismatch" | "Expired" | "Not Received";

export type AdministrationCell = {
  date?: string;
  time: string;
  label?: string;
  status: AdministrationCellStatus;
};

export type TimelineCell = AdministrationCell;

export type AdministrationHistory = {
  id: string;
  administrationDate: string;
  scheduledTime: string;
  actualTime: string;
  doseGiven: string;
  status: AdministrationStatus | string;
  nurse: string;
  remarks: string;
};

export type NurseNote = {
  id: string;
  time: string;
  author: string;
  note: string;
};

export type NurseDrugOrder = {
  id: string;

  patientId?: string;
  patientName?: string;
  selectedPatientName?: string;
  mrn?: string;
  ward?: string;
  bed?: string;

  orderNumber?: string;
  orderType?: string;
  orderDate?: string;
  orderedBy?: string;
  prescriber?: string;
  priority?: string;
  orderStatus: OrderStatus;
  administrationStatus: AdministrationStatus;
  status?: AdministrationStatus;
  administrationCondition?: string;

  category: NurseDrugCategory;
  name: string;
  drugName?: string;
  genericName?: string;
  brandName?: string;
  form: string;
  strength?: string;
  dosage: string;
  dose?: string;
  doseUnit?: string;
  frequency: string;
  days: string;
  route: string;
  instructions: string;

  startDate?: string;
  endDate?: string;
  scheduledTime?: string;
  nextDueTime?: string;
  lastAdministration?: string;
  lastAdministeredAt?: string;
  lastAdministeredBy?: string;

  orderedQty: number;
  dispensedQty: number;
  receivedQty: number;
  administeredQty: number;
  remainingQty: number;

  orderLabel?: string;
  dispensedLabel?: string;
  receivedLabel?: string;

  orderedDrugName?: string;
  orderedGenericName?: string;
  orderedStrength?: string;
  orderedDose?: string;
  orderedDoseUnit?: string;
  orderedForm?: string;
  orderedRoute?: string;

  dispensedDrugName?: string;
  dispensedGenericName?: string;
  dispensedStrength?: string;
  dispensedDose?: string;
  dispensedDoseUnit?: string;
  dispensedForm?: string;
  dispensedRoute?: string;

  receivedDrugName?: string;
  receivedGenericName?: string;
  receivedStrength?: string;
  receivedDose?: string;
  receivedDoseUnit?: string;
  receivedForm?: string;
  receivedRoute?: string;

  batchNo?: string;
  expiryDate?: string;
  manufacturer?: string;
  pharmacy?: string;
  reconciliationStatus?: ReconciliationStatus;
  reconciliationRemarks?: string;

  rightPatientStatus?: VerificationStatus;
  rightPatientReason?: string;
  rightDrugStatus?: VerificationStatus;
  rightDrugReason?: string;
  rightDoseStatus?: VerificationStatus;
  rightDoseReason?: string;
  rightRouteStatus?: VerificationStatus;
  rightRouteReason?: string;
  rightTimeStatus?: VerificationStatus;
  rightTimeReason?: string;

  medicationRightsConfirmed?: boolean;
  verifiedBy?: string;
  verifiedOn?: string;

  diluent?: string;
  diluentVolume?: string;
  infusionRate?: string;
  bolusDose?: string;
  bolusRoute?: string;
  bagVolume?: number;
  administeredVolume?: number;
  bagCount?: number;
  newBag?: boolean;

  discontinuedReason?: string;
  holdReason?: string;
  missedReason?: string;
  refusalReason?: string;
  partialReason?: string;
  taperedDose?: string;

  administrationNote?: string;
  administrationInstructions?: string;
  nurseNotes?: string;
  patientResponse?: string;
  observation?: string;
  followUpNotes?: string;

  doctorNotified?: "Yes" | "No";
  notificationDateTime?: string;
  communicationMethod?: "Phone Call" | "In Person" | "EMR Message" | "";
  communicationDetails?: string;
  doctorResponse?: string;
  generalRemarks?: string;

  cells: AdministrationCell[];
  timeline?: TimelineCell[];
  administrations?: AdministrationHistory[];
  notes?: NurseNote[];
};

export type MedicationAdministration = NurseDrugOrder;
export type MedicationStatusFilter = AdministrationStatus | "Received" | "Partially Administered" | "Pending";

export type AdministrationDetail = {
  orderId: string;
  orderName: string;
  category: NurseDrugCategory;
  administrationDate: string;
  dosage: string;
  time: string;
  priority: string;
  lastAdministeredAt: string;
  lastAdministeredBy: string;
  action: AdministrationAction;
  reason: string;
  administrationNote: string;
  counterChecked: boolean;
  counterCheckedBy: string;
  counterCheckedAt: string;
};

export type FluidAdministrationDetail = {
  orderId: string;
  orderName: string;
  category: NurseDrugCategory;
  administrationDate: string;
  rate: string;
  time: string;
  diluent: string;
  lastAdministeredAt: string;
  lastAdministeredBy: string;
  counterCheckedBy: string;
  counterCheckedAt: string;
  counterChecked: boolean;
  bagVolume: string;
  volumeAdministered: string;
  volumeRemaining: string;
  newBag: boolean;
  bagCount: string;
  bolusDose: string;
  bolusRoute: string;
  stopAdministrationAt: string;
  reason: string;
};

