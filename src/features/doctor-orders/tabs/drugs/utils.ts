import { formARoutes, frequencyMultiplier, injectionRoutes } from "./data";
import type { DraftCategory, DrugCategory, DrugOrder, OrderDraft } from "./types";

export function categoryTone(category: DrugCategory) {
  if (category === "Scheduled") return "info";
  if (category === "SOS") return "warning";
  if (category === "STAT" || category === "Bolus" || category === "Diluent") return "warning";
  if (category === "Continuous") return "success";
  if (category === "Discontinued") return "danger";
  return "muted";
}

export function remainingQty(order: DrugOrder) {
  return Math.max(order.receivedQty - order.administeredQty, 0);
}

export function isIvRoute(route: string) {
  return route === "Intravenous (IV)";
}

export function isInjectionForm(form: string) {
  return form === "Injection";
}

export function isContinuousFluid(form: string) {
  return form === "IV Fluid";
}

export function isFormADrug(form: string) {
  return !isInjectionForm(form) && !isContinuousFluid(form);
}

export function routeOptionsForForm(form: string, continuous: boolean, intermittent: boolean) {
  if (continuous || (isInjectionForm(form) && intermittent) || isContinuousFluid(form)) return ["Intravenous (IV)"];
  if (isInjectionForm(form)) return injectionRoutes;
  return formARoutes;
}

export function deriveCategory(draft: Pick<OrderDraft, "sos" | "stat" | "bolus" | "intermittent" | "continuous" | "category">): DraftCategory {
  if (draft.continuous) return "Continuous";
  if (draft.intermittent) return "Intermittent";
  if (draft.sos) return "SOS";
  if (draft.stat) return "STAT";
  if (draft.bolus) return "Bolus";
  return draft.category || "";
}

export function calculateAutoQty(category: DraftCategory, frequency: string, days: string, dose = "1", totalDose = "") {
  const effectiveCategory = category || "Scheduled";
  if (effectiveCategory === "Unscheduled") return 1;
  if (effectiveCategory === "Discontinued") return 0;
  if (effectiveCategory === "STAT" || effectiveCategory === "Bolus") return 1;
  const parsedDays = Number(days);
  const parsedDose = Number(totalDose || dose || 1);
  const multiplier = frequencyMultiplier[frequency] ?? 1;
  if (!Number.isFinite(parsedDays) || parsedDays <= 0) return 0;
  if (!Number.isFinite(parsedDose) || parsedDose <= 0) return 0;
  return Math.max(Math.ceil(parsedDose * multiplier * parsedDays), 1);
}

export function makeDraft(order: DrugOrder): OrderDraft {
  const intermittent = isInjectionForm(order.form) && isIvRoute(order.route);
  const continuous = isContinuousFluid(order.form);
  const category = continuous ? "Continuous" : intermittent ? "Intermittent" : order.category === "SOS" || order.category === "STAT" || order.category === "Bolus" || order.category === "Diluent" ? order.category : "";

  return {
    name: order.name,
    genericName: order.genericName,
    form: order.form,
    dosage: order.dosage,
    maxDosage: order.maxDosage,
    frequency: order.frequency,
    days: order.days,
    dayUnit: "Days",
    startDate: order.startDate,
    startTime: "",
    endDate: "",
    endTime: "",
    instructions: order.instructions,
    category,
    orderedQty: order.orderedQty ? String(order.orderedQty) : "",
    route: order.route,
    doseUnit: order.doseUnit,
    maxDoseUnit: order.doseUnit,
    pharmacy: order.pharmacy,
    drugScope: "All Drugs",
    site: "",
    diluent: order.diluents?.[0] ?? "",
    sos: category === "SOS",
    stat: category === "STAT",
    bolus: category === "Bolus",
    intermittent,
    continuous,
    bolusDose: "",
    bolusUnit: order.doseUnit,
    bolusKg: false,
    rateDose: order.dosage,
    rateUnit: order.doseUnit,
    rateTimeUnit: "hour",
    rateKg: false,
    totalDose: "",
    totalDoseUnit: order.doseUnit,
    totalDuration: "",
    totalDurationUnit: "hour",
    dosageCalcDose: order.dosage,
    dosageCalcUnit: order.doseUnit,
    dosageCalcTimeUnit: "day",
    dosageCalcKg: false,
    dosageCalcFreq: false,
    hasContraindication: Boolean(order.hasContraindication),
    taperDoses: [],
  };
}
