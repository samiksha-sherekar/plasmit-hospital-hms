import type { LdtFieldType } from "@/features/doctor-orders/tabs/ldt/config";

export type LdtRecord = {
  id: string;
  name: string;
  type: string;
  properties?: Record<string, string>;
  assessment?: Record<string, string>;
  nurseLocked?: boolean;
};

export type LdtFormValues = Omit<LdtRecord, "id">;
export type LdtSection = "properties" | "assessment";
export type LdtDrawerState = { type: "add"; activeSection: LdtSection } | { type: "edit"; record: LdtRecord; activeSection: LdtSection };
export type LdtDetailsDrawerState = { type: LdtSection; record: LdtRecord } | null;

export type ConfigField = { id: string; label: string; type: LdtFieldType; group: LdtSection; options?: { label: string; value: string }[] };
export type FieldRow = { key: string; label: string; type: LdtFieldType; value: string };
export type TableRow = { key: string; field: string; type: string; value: string };

export type PropertyType = "Free text" | "Date" | "Time" | "Number" | "Dropdown" | "Checkbox";
export type SelectionMode = "Single" | "Multi";

export type PropertyFormValues = {
  name: string;
  type: PropertyType;
  dateFormat: string;
  timeFormat: string;
  options: string[];
  selectionMode: SelectionMode;
  checkboxLabel: string;
  checkboxDefault: boolean;
};

export type AssessmentFieldType = PropertyType;

export type AssessmentFormValues = {
  name: string;
  type: AssessmentFieldType;
  dateFormat: string;
  timeFormat: string;
  trackInIntake: boolean;
  trackInOutput: boolean;
  options: string[];
  selectionMode: SelectionMode;
  checkboxLabel: string;
  checkboxDefault: boolean;
};

export type FormErrors = Partial<Record<"name" | "options", string>>;
export type PropertyRowValues = PropertyFormValues & { key: string; value: string };
export type AssessmentRowValues = AssessmentFormValues & { key: string; value: string };

export const propertyTypes: PropertyType[] = ["Free text", "Date", "Time", "Number", "Dropdown", "Checkbox"];
export const assessmentTypes: AssessmentFieldType[] = ["Free text", "Date", "Time", "Number", "Dropdown", "Checkbox"];
export const dateFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
export const timeFormats = ["12 hour", "24 hour"];
export const selectionModes: SelectionMode[] = ["Single", "Multi"];

export const emptyPropertyForm: PropertyFormValues = {
  name: "",
  type: "Free text",
  dateFormat: dateFormats[0],
  timeFormat: timeFormats[0],
  options: [""],
  selectionMode: "Single",
  checkboxLabel: "",
  checkboxDefault: false,
};

export const emptyAssessmentForm: AssessmentFormValues = {
  name: "",
  type: "Free text",
  dateFormat: dateFormats[0],
  timeFormat: timeFormats[0],
  trackInIntake: false,
  trackInOutput: false,
  options: [""],
  selectionMode: "Single",
  checkboxLabel: "",
  checkboxDefault: false,
};

export const initialLdtRecords: LdtRecord[] = [
  { id: "ldt-001", name: "PICC double lumen", type: "Line", properties: {}, assessment: {}, nurseLocked: false },
  { id: "ldt-002", name: "Naso gastric tube", type: "Tube", properties: {}, assessment: {}, nurseLocked: true },
  { id: "ldt-003", name: "Intercoastal drain", type: "Drain", properties: {}, assessment: {}, nurseLocked: false },
];

export const ldtTypeOptions = ["Line", "Tube", "Drain"];
export const fieldTypes: LdtFieldType[] = ["text", "date", "time", "number", "select", "multiselect"];

export const emptyForm: LdtFormValues = {
  name: "",
  type: ldtTypeOptions[0],
  properties: {},
  assessment: {},
  nurseLocked: false,
};

export function ldtTypeToConfigId(type: string) {
  if (type === "Line") return "line";
  if (type === "Tube") return "tube";
  if (type === "Drain") return "drain";
  return "";
}

export function sectionLabel(section: LdtSection) {
  return section === "properties" ? "Properties" : "Assessment";
}

export function sectionFieldName(section: LdtSection) {
  return section === "properties" ? "Property Name" : "Assessment Field Name";
}

export function defaultFieldRow(section: LdtSection, index: number): FieldRow {
  return { key: `${section}-${index}`, label: "", type: "text", value: "" };
}

export function toFieldRows(section: LdtSection, values: LdtFormValues, fields: ConfigField[]): FieldRow[] {
  const source = section === "properties" ? values.properties ?? {} : values.assessment ?? {};
  const fallback = defaultFieldRow(section, 0);
  const mapped = Object.entries(source).map(([key, value], index) => {
    const field = fields.find((item) => item.id === key);
    return {
      key: `${section}-${key}-${index}`,
      label: field?.label ?? sectionFieldName(section),
      type: field?.type ?? "text",
      value: value ?? "",
    };
  });
  return mapped.length ? mapped : [fallback];
}

export function buildFieldConfig(rows: FieldRow[]) {
  return rows.reduce<Record<string, string>>((acc, row) => {
    const label = row.label.trim();
    if (!label) return acc;
    acc[label] = row.value;
    return acc;
  }, {});
}

export function getFieldRows(values: LdtFormValues, section: LdtSection, getLdtTypeConfig: (configId: string) => { fields: ConfigField[] } | undefined) {
  const config = getLdtTypeConfig(ldtTypeToConfigId(values.type));
  const group = section === "properties" ? "property" : "assessment";
  const fields = config?.fields.filter((field) => field.group === group) ?? [];
  return toFieldRows(section, values, fields);
}

export function buildTableRows(rows: Record<string, string> | undefined, fields: ConfigField[]): TableRow[] {
  return Object.entries(rows ?? {}).map(([field, value], index) => {
    const configField = fields.find((item) => item.label === field || item.id === field);
    return { key: `${field}-${index}`, field, type: configField?.type ?? "text", value: value || "-" };
  });
}

