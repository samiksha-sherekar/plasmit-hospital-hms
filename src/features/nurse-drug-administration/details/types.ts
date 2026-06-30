export type NurseOrderDetailsModel = {
  patientName: string;
  selectedPatientName: string;
  mrn: string;
  ward: string;
  bed: string;
  prescriber: string;

  orderNumber: string;
  orderType: string;
  orderDate: string;
  priority: string;
  orderStatus: string;
  administrationCondition: string;
  orderedBy: string;

  genericName: string;
  brandName: string;
  drugForm: string;
  category: string;
  strength: string;
  dose: string;
  doseUnit: string;
  route: string;
  diluent?: string;
  diluentVolume: string;
  infusionRate: string;
  administrationInstructions: string;
  pharmacy: string;

  startDate: string;
  endDate: string;
  scheduledTime: string;
  frequency: string;
  days: string;
  lastAdministration: string;
  nextDueTime: string;

  orderedQty: string;
  dispensedQty: string;
  receivedQty: string;
  administeredQty: string;
  remainingQty: string;

  // Drug Reconciliation
  orderedDrugName: string;
  orderedGenericName?: string;
  orderedStrength: string;
  orderedDose: string;
  orderedDoseUnit: string;
  orderedForm: string;
  orderedRoute: string;

  dispensedDrugName: string;
  dispensedGenericName?: string;
  dispensedStrength: string;
  dispensedDose: string;
  dispensedDoseUnit: string;
  dispensedForm: string;
  dispensedRoute: string;

  receivedDrugName: string;
  receivedGenericName?: string;
  receivedStrength: string;
  receivedDose: string;
  receivedDoseUnit: string;
  receivedForm: string;
  receivedRoute: string;

  batchNo?: string;
  expiryDate?: string;
  manufacturer?: string;
  reconciliationStatus: "Matched" | "Mismatch";
  reconciliationRemarks?: string;

  // 5 Rights Check - without patient verification
  rightDrugStatus: "Verified" | "Failed";
  rightDrugReason?: string;

  rightDoseStatus: "Verified" | "Failed";
  rightDoseReason?: string;

  rightRouteStatus: "Verified" | "Failed";
  rightRouteReason?: string;

  rightTimeStatus: "Verified" | "Warning" | "Failed";
  rightTimeReason?: string;

  medicationRightsConfirmed: boolean;
  verifiedBy?: string;
  verifiedOn?: string;

  schedule: Array<{
    date: string;
    times: string[];
  }>;

  administrations: Array<{
    id: string;
    administrationDate: string;
    scheduledTime: string;
    actualTime: string;
    doseGiven: string;
    status: string;
    nurse: string;
    remarks: string;
  }>;

  notes: Array<{
    id: string;
    time: string;
    author: string;
    note: string;
  }>;

  nurseNotes: string;
  patientResponse: string;
  observation: string;
  followUpNotes: string;

  doctorNotified: "Yes" | "No";
  notificationDateTime: string;
  communicationMethod?: "Phone Call" | "In Person" | "EMR Message" | "";
  communicationDetails: string;
  doctorResponse?: string;

  generalRemarks: string;
};
