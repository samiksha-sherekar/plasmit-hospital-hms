export type LdtFieldType = "text" | "date" | "time" | "number" | "select" | "multiselect";
export type LdtFieldGroup = "property" | "assessment";

export type LdtDynamicField = {
  id: string;
  label: string;
  type: LdtFieldType;
  group: LdtFieldGroup;
  options?: string[];
};

export type LdtTypeConfig = {
  type: string;
  label: string;
  fields: LdtDynamicField[];
};

export const LDT_TYPE_CONFIGS: LdtTypeConfig[] = [
  {
    type: "PICC Single Lumen",
    label: "PICC Single Lumen",
    fields: [
      { id: "placementDate", label: "Placement Date", type: "date", group: "property" },
      { id: "placementTime", label: "Placement Time", type: "time", group: "property" },
      { id: "locationOfInsertion", label: "Location of Insertion", type: "text", group: "property" },
      { id: "size", label: "Size", type: "number", group: "property" },
      { id: "length", label: "Length", type: "number", group: "property" },
      // { id: "placementVerification", label: "Placement Verification", type: "select", group: "property", options: ["Confirmed", "Pending", "Not Verified"] },
      { id: "siteAssessment", label: "Site Assessment", type: "multiselect", group: "assessment", options: ["Clean", "Dry", "Intact", "Redness", "Swelling", "Discharge"] },
      { id: "ldtStatus", label: "LDT Status", type: "select", group: "assessment", options: ["Active", "Completed", "On Hold", "Discontinued"] },
      { id: "dressingType", label: "Dressing Type", type: "select", group: "assessment", options: ["Transparent", "Gauze", "Occlusive"] },
      { id: "dressingStatus", label: "Dressing Status", type: "select", group: "assessment", options: ["Clean", "Changed", "Required", "Dry"] },
    ],
  },
  {
    type: "PICC Double Lumen",
    label: "PICC Double Lumen",
    fields: [
      { id: "ldtNumber", label: "LDT Number", type: "text", group: "property" },
      { id: "ldtDate", label: "LDT Date", type: "date", group: "property" },
      { id: "Ultrasound Used", label: "Catheter Size", type: "text", group: "property" },
      { id: "Preparation Before Insertion", label: "Preparation Before Insertion", type: "text", group: "property" },
      { id: "Size", label: "Size", type: "number", group: "property" },
      { id: "siteAssessment", label: "Site Assessment", type: "multiselect", group: "assessment", options: ["Clean", "Dry", "Intact", "Redness", "Swelling", "Discharge"] },
      { id: "dressingType", label: "Dressing Type", type: "select", group: "assessment", options: ["Transparent", "Gauze", "Occlusive"] },
      { id: "dressingStatus", label: "Dressing Status", type: "select", group: "assessment", options: ["Clean", "Changed", "Required", "Dry"] },
    ],
  },
  {
    type: "Foley Catheter",
    label: "Foley Catheter",
    fields: [
      { id: "insertionDate", label: "Insertion Date", type: "date", group: "property" },
      { id: "catheterSize", label: "Catheter Size", type: "number", group: "property" },
      { id: "balloonVolume", label: "Balloon Volume", type: "number", group: "property" },
      { id: "urineColor", label: "Urine Color", type: "select", group: "assessment", options: ["Clear", "Yellow", "Amber", "Cloudy", "Bloody"] },
      { id: "catheterStatus", label: "Catheter Status", type: "select", group: "assessment", options: ["Patent", "Blocked", "Leaking", "Removed"] },
    ],
  },

];

export const DEFAULT_LDT_TYPE = LDT_TYPE_CONFIGS[0]?.type ?? "";

export function getLdtTypeConfig(ldtType: string) {
  return LDT_TYPE_CONFIGS.find((item) => item.type === ldtType) ?? null;
}
