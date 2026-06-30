"use client";

import * as React from "react";
import type { NurseOrderDetailsModel } from "./types";

function formatDateValue(value: string) {
  if (!value || value === "-") return value;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = parsed.toLocaleString("en-US", { month: "short" });
    const year = parsed.getFullYear();
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    const monthName = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleString("en-US", { month: "short" });
    return `${day}-${monthName}-${year}`;
  }

  return value;
}

function normalizeValue(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

function isPresent(value?: string) {
  const normalized = normalizeValue(value);
  return Boolean(normalized) && normalized !== "-";
}

function compareText(a?: string, b?: string) {
  const left = normalizeValue(a);
  const right = normalizeValue(b);
  if (!left || !right) return true;
  return left === right;
}

function compareOrderedValue(actual?: string, expected?: string) {
  const left = normalizeValue(actual);
  const right = normalizeValue(expected);
  if (!left || !right) return true;
  return left === right;
}

function parseTimeToMinutes(value?: string) {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*([ap]m))?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toLowerCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes < 0 || minutes > 59) return null;

  if (meridiem === "am" || meridiem === "pm") {
    hours = hours % 12;
    if (meridiem === "pm") hours += 12;
  }

  if (hours < 0 || hours > 23) return null;
  return hours * 60 + minutes;
}

function parseAdministrationTime(value?: string) {
  if (!value || value === "-") return null;

  const direct = parseTimeToMinutes(value);
  if (direct !== null) return direct;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getHours() * 60 + parsed.getMinutes();
}

function extractScheduledTime(value?: string) {
  const parsed = parseTimeToMinutes(value);
  return parsed === null ? null : parsed;
}

function getDrugDisplayName(order: NurseOrderDetailsModel) {
  return order.orderedDrugName || order.orderedGenericName || order.genericName || order.orderType || order.drugForm;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-foreground">{title}</div>
      {children}
    </div>
  );
}

function FieldRow({ label, value, format = false }: { label: string; value: string; format?: boolean }) {
  const displayValue = format ? formatDateValue(value) : value;

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface px-3 py-2">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-right text-sm font-semibold text-foreground">{displayValue}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: "Verified" | "Warning" | "Failed" | "Matched" | "Mismatch" }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
        status === "Verified" ? "bg-success/10 text-success" : status === "Warning" ? "bg-warning/10 text-warning" : status === "Matched" ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function compareReconciliationRows(order: NurseOrderDetailsModel): { comparisons: Array<{ label: string; order: string; dispensed: string; received: string }>; reconciliationStatus: "Matched" | "Mismatch"; reconciliationRemarks?: string } {
  const comparisons: Array<{ label: string; order: string; dispensed: string; received: string }> = [
    { label: "Drug Name", order: order.orderedDrugName, dispensed: order.dispensedDrugName, received: order.receivedDrugName },
    // { label: "Generic Name", order: order.orderedGenericName ?? "", dispensed: order.dispensedGenericName ?? "", received: order.receivedGenericName ?? "" },
    // { label: "Strength", order: order.orderedStrength, dispensed: order.dispensedStrength, received: order.receivedStrength },
    { label: "Dose", order: order.orderedDose, dispensed: order.dispensedDose, received: order.receivedDose },
    // { label: "Dose Unit", order: order.orderedDoseUnit, dispensed: order.dispensedDoseUnit, received: order.receivedDoseUnit },
    // { label: "Form", order: order.orderedForm, dispensed: order.dispensedForm, received: order.receivedForm },
    { label: "Route", order: order.orderedRoute, dispensed: order.dispensedRoute, received: order.receivedRoute },
  ];

  const mismatches = comparisons.filter((row) => {
    const comparable = [row.order, row.dispensed, row.received].filter(isPresent);
    if (comparable.length <= 1) return false;
    const base = normalizeValue(comparable[0]);
    return comparable.some((item) => normalizeValue(item) !== base);
  });

  const reconciliationStatus = mismatches.length ? "Mismatch" : "Matched";
  const reconciliationRemarks = mismatches.length
    ? `Mismatch in ${mismatches.map((row) => row.label).join(", ")}.`
    : undefined;

  return { comparisons, reconciliationStatus, reconciliationRemarks };
}

function getFiveRights(order: NurseOrderDetailsModel) {
  const { reconciliationStatus, reconciliationRemarks } = compareReconciliationRows(order);
  const rightDrugStatus: "Verified" | "Failed" = reconciliationStatus === "Matched" ? "Verified" : "Failed";
  const rightDrugReason = reconciliationStatus === "Mismatch" ? reconciliationRemarks : undefined;

  const rightDoseMatches = compareOrderedValue(order.dose, order.orderedDose) && compareOrderedValue(order.doseUnit, order.orderedDoseUnit);
  const rightDoseStatus: "Verified" | "Failed" = rightDoseMatches ? "Verified" : "Failed";
  const rightDoseReason = rightDoseMatches ? undefined : "Administration dose does not match the ordered dose.";

  const rightRouteMatches = compareText(order.route, order.receivedRoute || order.orderedRoute);
  const rightRouteStatus: "Verified" | "Failed" = rightRouteMatches ? "Verified" : "Failed";
  const rightRouteReason = rightRouteMatches ? undefined : "Administration route does not match the ordered route.";

  const normalizedCategory = normalizeValue(order.category);
  const normalizedType = normalizeValue(order.orderType);
  const normalizedFrequency = normalizeValue(order.frequency);
  const isSOS = [normalizedCategory, normalizedType, normalizedFrequency].includes("sos");
  const isSTAT = [normalizedCategory, normalizedType, normalizedFrequency].includes("stat");

  const scheduledMinutes = extractScheduledTime(order.scheduledTime);
  const actualMinutes = parseAdministrationTime(order.verifiedOn);

  let rightTimeStatus: "Verified" | "Warning" | "Failed" = "Failed";
  let rightTimeReason = "Invalid or missing administration time.";

  if (isSOS) {
    rightTimeStatus = "Verified";
    rightTimeReason = "As needed medication.";
  } else if (isSTAT) {
    rightTimeStatus = "Verified";
    rightTimeReason = "Immediate administration.";
  } else if (scheduledMinutes !== null && actualMinutes !== null) {
    const diff = Math.abs(actualMinutes - scheduledMinutes);
    rightTimeStatus = diff <= 30 ? "Verified" : "Warning";
    rightTimeReason = diff <= 30 ? "" : "Medication is outside the scheduled time window. Please confirm before administration.";
  }

  return {
    reconciliationStatus,
    reconciliationRemarks,
    rightDrugStatus,
    rightDrugReason,
    rightDoseStatus,
    rightDoseReason,
    rightRouteStatus,
    rightRouteReason,
    rightTimeStatus,
    rightTimeReason,
  };
}

function DrugReconciliationSection({ order }: { order: NurseOrderDetailsModel }) {
  const { comparisons, reconciliationStatus, reconciliationRemarks } = compareReconciliationRows(order);
  const doctorOrdered = [order.orderedDrugName, order.orderedDose, order.orderedRoute].map((part) => (part || "-").trim()).join(" | ");
  const pharmacyDispensed = [order.dispensedDrugName, order.dispensedDose, order.dispensedRoute].map((part) => (part || "-").trim()).join(" | ");
  const nurseReceived = [order.receivedDrugName, order.receivedDose, order.receivedRoute].map((part) => (part || "-").trim()).join(" | ");

  return (
    <SectionCard title="Drug Reconciliation">
      <div className="space-y-3">
        <div className="">
          <FieldRow label="Doctor Ordered" value={doctorOrdered} />
          <FieldRow label="Pharmacy Dispensed" value={pharmacyDispensed} />
          <FieldRow label="Nurse Received" value={nurseReceived} />
        </div>
        {/* <div className="space-y-2">
          {comparisons.map((row) => (
            <div key={row.label} className="grid gap-3 xl:grid-cols-3">
              <FieldRow label={row.label} value={row.order || "-"} />
              <FieldRow label={row.label} value={row.dispensed || "-"} />
              <FieldRow label={row.label} value={row.received || "-"} />
            </div>
          ))}
        </div> */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Reconciliation Status:</span>
          <StatusBadge status={reconciliationStatus} />
          {reconciliationRemarks ? <span>{reconciliationRemarks}</span> : <span>All comparable values match.</span>}
        </div>
      </div>
    </SectionCard>
  );
}

function RightsSection({ order }: { order: NurseOrderDetailsModel }) {
  const computed = React.useMemo(() => getFiveRights(order), [order]);
  const [actualAdministrationTime, setActualAdministrationTime] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(order.medicationRightsConfirmed);
  const [verifiedBy, setVerifiedBy] = React.useState(order.verifiedBy || "");
  const [verifiedOn, setVerifiedOn] = React.useState(order.verifiedOn || "");

  React.useEffect(() => {
    setConfirmed(order.medicationRightsConfirmed);
    setVerifiedBy(order.verifiedBy || "");
    setVerifiedOn(order.verifiedOn || "");
  }, [order]);

  const rightTimeWithInput = React.useMemo(() => {
    if (computed.rightTimeStatus === "Verified" && computed.rightTimeReason !== "As needed medication." && computed.rightTimeReason !== "Immediate administration.") {
      const scheduledMinutes = extractScheduledTime(order.scheduledTime);
      const selectedMinutes = parseAdministrationTime(actualAdministrationTime) ?? null;

      if (scheduledMinutes !== null && selectedMinutes !== null) {
        const diff = Math.abs(selectedMinutes - scheduledMinutes);
        return {
          status: diff <= 30 ? ("Verified" as const) : ("Warning" as const),
          reason: diff <= 30 ? "" : "Medication is outside the scheduled time window. Please confirm before administration.",
        };
      }

      if (actualAdministrationTime.trim()) {
        return {
          status: "Warning" as const,
          reason: "Medication is outside the scheduled time window. Please confirm before administration.",
        };
      }
    }

    if (computed.rightTimeReason === "As needed medication." || computed.rightTimeReason === "Immediate administration.") {
      return {
        status: computed.rightTimeStatus,
        reason: computed.rightTimeReason,
      };
    }

    return {
      status: computed.rightTimeStatus,
      reason: computed.rightTimeReason,
    };
  }, [actualAdministrationTime, computed.rightTimeReason, computed.rightTimeStatus, order.scheduledTime]);

  const canConfirm = computed.rightDrugStatus === "Verified" && computed.rightDoseStatus === "Verified" && computed.rightRouteStatus === "Verified" && (rightTimeWithInput.status === "Verified" || rightTimeWithInput.status === "Warning");
  const hasCriticalFailure = computed.rightDrugStatus === "Failed" || computed.rightDoseStatus === "Failed" || computed.rightRouteStatus === "Failed" || rightTimeWithInput.status === "Failed";
  const showWarningAck = rightTimeWithInput.status === "Warning";

  const handleConfirmChange = (nextChecked: boolean) => {
    setConfirmed(nextChecked);
    if (nextChecked) {
      setVerifiedBy(order.verifiedBy || "Logged-in nurse");
      setVerifiedOn(new Date().toISOString());
    } else {
      setVerifiedBy("");
      setVerifiedOn("");
    }
  };

  const rights: Array<{ name: string; status: "Verified" | "Warning" | "Failed"; reason?: string }> = [
    {
      name: "Right Drug",
      status: computed.rightDrugStatus,
      reason: computed.rightDrugReason,
    },
    {
      name: "Right Dose",
      status: computed.rightDoseStatus,
      reason: computed.rightDoseReason,
    },
    {
      name: "Right Route",
      status: computed.rightRouteStatus,
      reason: computed.rightRouteReason,
    },
    {
      name: "Right Time",
      status: rightTimeWithInput.status,
      reason: rightTimeWithInput.reason,
    },
  ] as const;

  return (
    <SectionCard title="4 Rights Check">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {rights.map((right) => (
            <div key={right.name} className={`rounded-xl border p-3 ${right.status === "Failed" ? "border-danger/30 bg-danger/10" : right.status === "Warning" ? "border-warning/30 bg-warning/10" : "border-border bg-surface"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-foreground">{right.name}</div>
                </div>
                <StatusBadge status={right.status} />
              </div>
              {right.reason ? <div className={right.status === "Failed" ? "mt-2 text-xs text-danger" : "mt-2 text-xs text-warning"}>{right.reason}</div> : null}
            </div>
          ))}
        </div>

        {showWarningAck ? (
          <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
            Medication is outside the scheduled time window. Please confirm before administration.
          </div>
        ) : null}

        <label className="flex items-start gap-3 rounded-lg border border-border bg-surface px-3 py-3 text-sm">
          <input
            type="checkbox"
            checked={confirmed}
            disabled={!canConfirm || hasCriticalFailure}
            onChange={(event) => handleConfirmChange(event.target.checked)}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span>
            I confirm that all medication rights have been verified.
          </span>
        </label>

        {confirmed ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Verified By" value={verifiedBy || "-"} />
            <FieldRow label="Verified On" value={verifiedOn ? formatDateValue(verifiedOn) : "-"} format={false} />
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <button type="button" className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted">
            Cancel
          </button>
          <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
            Save
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

export function OrderDetailsTab({ order }: { order: NurseOrderDetailsModel }) {
  const rights = getFiveRights(order);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-1">
          <SectionCard title="Order Information">
            <div className="space-y-3">
              <FieldRow label="Order Number" value={order.orderNumber} />
              <FieldRow label="Order Type" value={order.orderType} />
              <FieldRow label="Order Date" value={order.orderDate} format />
              <FieldRow label="Priority" value={order.priority} />
              <FieldRow label="Order Status" value={order.orderStatus} />
              <FieldRow label="Ordered By" value={order.orderedBy} />
            </div>
          </SectionCard>
          <DrugReconciliationSection order={order} />
        </div>
        <SectionCard title="Drug Information">
          <div className="space-y-3">
            <FieldRow label="Generic Name" value={order.genericName} />
            <FieldRow label="Brand Name" value={order.brandName} />
            <FieldRow label="Drug Form" value={order.drugForm} />
            <FieldRow label="Category" value={order.category} />
            <FieldRow label="Strength" value={order.strength} />
            <FieldRow label="Dose" value={order.dose} />
            <FieldRow label="Dose Unit" value={order.doseUnit} />
            <FieldRow label="Route" value={order.route} />
            <FieldRow label="Diluent" value={order.diluent ?? "-"} />
            <FieldRow label="Diluent Volume" value={order.diluentVolume} />
            <FieldRow label="Infusion Rate" value={order.infusionRate} />
            <FieldRow label="Administration Instructions" value={order.administrationInstructions} />
          </div>
        </SectionCard>

        <div className="space-y-4 xl:col-span-1">
          <SectionCard title="Schedule">
            <div className="space-y-3">
              <FieldRow label="Start Date" value={order.startDate} format />
              <FieldRow label="End Date" value={order.endDate} format />
              <FieldRow label="Frequency" value={order.frequency} />
              <FieldRow label="Scheduled Time" value={order.scheduledTime} />
              <FieldRow label="Last Administration" value={order.lastAdministration} format />
              <FieldRow label="Next Due Time" value={order.nextDueTime} />
            </div>
          </SectionCard>

          <SectionCard title="Quantity">
            <div className="space-y-3">
              <FieldRow label="Ordered Qty" value={order.orderedQty} />
              <FieldRow label="Dispensed Qty" value={order.dispensedQty} />
              <FieldRow label="Received Qty" value={order.receivedQty} />
              <FieldRow label="Administered Qty" value={order.administeredQty} />
              <FieldRow label="Remaining Qty" value={order.remainingQty} />
            </div>
          </SectionCard>
        </div>
      </div>
      <RightsSection order={order} />
    </div>
  );
}