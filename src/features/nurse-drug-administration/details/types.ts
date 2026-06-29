export type NurseOrderDetailsModel = {
  patientName: string;
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
  communicationDetails: string;
  generalRemarks: string;
};

export function createEmptyOrderDetails(): NurseOrderDetailsModel {
  return {
    patientName: "Empty drawer",
    mrn: "-",
    ward: "-",
    bed: "-",
    prescriber: "-",
    orderNumber: "-",
    orderType: "-",
    orderDate: "-",
    priority: "-",
    orderStatus: "-",
    administrationCondition: "Held",
    orderedBy: "-",
    genericName: "-",
    brandName: "-",
    drugForm: "-",
    category: "-",
    strength: "-",
    dose: "-",
    doseUnit: "-",
    route: "-",
    diluent: "-",
    diluentVolume: "-",
    infusionRate: "-",
    administrationInstructions: "-",
    pharmacy: "-",
    startDate: "-",
    endDate: "-",
    scheduledTime: "-",
    frequency: "-",
    days: "-",
    lastAdministration: "Not Administered",
    nextDueTime: "-",
    orderedQty: "-",
    dispensedQty: "-",
    receivedQty: "-",
    administeredQty: "-",
    remainingQty: "-",
    schedule: [],
    administrations: [],
    notes: [],
    nurseNotes: "",
    patientResponse: "",
    observation: "",
    followUpNotes: "",
    doctorNotified: "No",
    notificationDateTime: "",
    communicationDetails: "",
    generalRemarks: "",
  };
}
