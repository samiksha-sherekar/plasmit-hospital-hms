"use client";

import type { NurseOrderDetailsModel } from "./types";

function formatDateValue(value: string) {
  if (!value || value === "-") return value;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = parsed.toLocaleString("en-US", { month: "short" });
    const year = parsed.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    const monthName = new Date(Number(year), Number(month) - 1, Number(day)).toLocaleString("en-US", { month: "short" });
    return `${day}-${monthName}-${year}`;
  }

  return value;
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-foreground">{title}</div>
      {children}
    </div>
  );
}

function getReconciliationValue(order: NurseOrderDetailsModel) {
  return [order.genericName || order.orderType || order.drugForm, order.dose, order.route].filter(Boolean).join(" | ");
}

export function OrderDetailsTab({ order }: { order: NurseOrderDetailsModel }) {
  const reconciliationValue = getReconciliationValue(order);

  return (
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
        <SectionCard title="Drug Reconciliation">
          <div className="space-y-3">
            <FieldRow label="Ordered Drug (Doctor Order)" value={reconciliationValue} />
            <FieldRow label="Dispensed Order (Pharmacy)" value={reconciliationValue} />
            <FieldRow label="Received Order (At Nursing Station)" value={reconciliationValue} />
          </div>
        </SectionCard>
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
          {/* <FieldRow label="Pharmacy" value={order.pharmacy} /> */}
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
  );
}
