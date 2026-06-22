"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  PackageCheck,
  Pill,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { useRole } from "@/components/providers/role-provider";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { mockPatients } from "@/data/patients";
import { PatientSearchSelect } from "@/features/patients/patient-search-select";
import type { Role } from "@/types";

import { nurseDrugOrders } from "@/features/nurse-drug-administration/data";
import type { NurseDrugOrder } from "@/features/nurse-drug-administration/types";
import { PatientSummaryBanner } from "@/components/ui/patient-summary-banner";

const pharmacistRoles: Role[] = ["Pharmacist", "Super Admin", "Hospital Admin"];
type SortKey =
  | "name"
  | "category"
  | "dosage"
  | "orderedQty"
  | "dispensedQty"
  | "status";
type SortState = { key: SortKey; direction: "asc" | "desc" };

const sortableColumns: {
  key: SortKey | "action";
  label: string;
  className?: string;
}[] = [
  { key: "name", label: "Drug" },
  { key: "category", label: "Category" },
  { key: "dosage", label: "Dose" },
  { key: "orderedQty", label: "Ordered" },
  { key: "dispensedQty", label: "Dispensed" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", className: "text-right" },
];

function dispenseStatus(
  order: NurseDrugOrder,
  nextDispenseQty = order.dispensedQty,
) {
  if (nextDispenseQty <= 0) return "Pending";
  if (nextDispenseQty < order.orderedQty) return "Partially dispensed";
  return "Dispensed";
}

function SortButton({
  label,
  column,
  sort,
  onSort,
}: {
  label: string;
  column: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
}) {
  const active = sort.key === column;
  const SortIcon = active
    ? sort.direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ChevronsUpDown;

  return (
    <button
      className="flex items-center gap-2 text-left font-semibold uppercase tracking-wide hover:text-primary-foreground/80"
      onClick={() => onSort(column)}
      type="button"
    >
      {label}
      <SortIcon
        className={
          active
            ? "h-3.5 w-3.5 text-primary-foreground"
            : "h-3.5 w-3.5 text-primary-foreground/70"
        }
      />
    </button>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface-muted p-3">
      <div className="text-xs font-medium text-muted-foreground">{label}:</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function PatientSummaryCard({
  patientId,
  onPatientChange,
}: {
  patientId: string;
  onPatientChange: (patientId: string) => void;
}) {
  const patient =
    mockPatients.find((item) => item.id === patientId) ?? mockPatients[0];

  return (
    <Card>
      <CardContent className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <PatientSearchSelect
          patientId={patient.id}
          onPatientChange={onPatientChange}
        />
        <DetailItem
          label="Age/Gender"
          value={`${patient.age} / ${patient.gender}`}
        />
        <DetailItem label="Blood Group" value={patient.bloodGroup} />
        {/* <DetailItem label="UHID" value={patient.uhid} /> */}
      </CardContent>
    </Card>
  );
}

export function PharmacistDrugDispensePage() {
  const { role } = useRole();
  const allowed = pharmacistRoles.includes(role);
  const [quantities, setQuantities] = React.useState<Record<string, string>>(
    () =>
      nurseDrugOrders.reduce<Record<string, string>>((acc, order) => {
        acc[order.id] = String(
          Math.max(order.orderedQty - order.dispensedQty, 0),
        );
        return acc;
      }, {}),
  );
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortState>({
    key: "name",
    direction: "asc",
  });
  const [selectedPatientId, setSelectedPatientId] = React.useState(
    mockPatients[0]?.id ?? "",
  );

  const displayedOrders = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...nurseDrugOrders]
      .filter((order) => {
        const quantity = Number(quantities[order.id]) || 0;
        const status = dispenseStatus(order, quantity);
        return `${order.name} ${order.form} ${order.route} ${order.category} ${order.dosage} ${order.orderedQty} ${quantity} ${status}`
          .toLowerCase()
          .includes(query);
      })
      .sort((left, right) => {
        const leftQuantity = Number(quantities[left.id]) || 0;
        const rightQuantity = Number(quantities[right.id]) || 0;
        const leftValue =
          sort.key === "dispensedQty"
            ? leftQuantity
            : sort.key === "status"
              ? dispenseStatus(left, leftQuantity)
              : left[sort.key];
        const rightValue =
          sort.key === "dispensedQty"
            ? rightQuantity
            : sort.key === "status"
              ? dispenseStatus(right, rightQuantity)
              : right[sort.key];
        const result =
          Number.isFinite(Number(leftValue)) &&
          Number.isFinite(Number(rightValue))
            ? Number(leftValue) - Number(rightValue)
            : String(leftValue).localeCompare(String(rightValue));

        return sort.direction === "asc" ? result : -result;
      });
  }, [quantities, search, sort]);

  const updateSort = (key: SortKey) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!allowed) {
    return (
      <EmptyState
        icon={UserRound}
        title="Pharmacist access required"
        description="Switch to Pharmacist role to dispense doctor drug orders for nurse receipt."
      />
    );
  }

  const dispense = (order: NurseDrugOrder) => {
    const quantity = Number(quantities[order.id]) || 0;
    if (quantity <= 0) {
      toast.error("Enter dispense quantity");
      return;
    }
    toast.success(
      `${quantity} quantity dispensed for ${order.name}. Nurse can receive it now.`,
    );
  };

  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="Drug Dispense"
        className="static mx-0 border-b bg-transparent px-0 py-2"
        // description="Doctor drug orders are dispensed here before nurse receipt and administration."
      /> */}

      <Card>
        <CardContent className="space-y-4">
          {/* <PatientSummaryBanner /> */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              className="sm:w-80"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search drug, category, dose, or status..."
            />
            {/* <Badge tone="info">{displayedOrders.length} visible row(s)</Badge> */}
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead className="bg-primary text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                  <tr>
                    {sortableColumns.map((column, index) => (
                      <th
                        key={column.key}
                        className={[
                          "border-b border-primary-foreground/20 px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]",
                          index < sortableColumns.length - 1 ? "border-r" : "",
                          column.className,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {column.key === "action" ? (
                          column.label
                        ) : (
                          <SortButton
                            label={column.label}
                            column={column.key}
                            sort={sort}
                            onSort={updateSort}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.length ? (
                    displayedOrders.map((order) => {
                      const quantity = Number(quantities[order.id]) || 0;
                      const status = dispenseStatus(order, quantity);
                      return (
                        <tr
                          key={order.id}
                          className="border-b border-border last:border-0 hover:bg-primary/5"
                        >
                          <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                            <div className="font-semibold text-foreground">
                              {order.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.form} / {order.route}
                            </div>
                          </td>
                          <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                            {order.category}
                          </td>
                          <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                            {order.dosage}
                          </td>
                          <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] font-medium">
                            {order.orderedQty}
                          </td>
                          <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                            <Input
                              className="w-28"
                              type="number"
                              min={0}
                              max={order.orderedQty}
                              value={quantities[order.id] ?? ""}
                              onChange={(event) =>
                                setQuantities((current) => ({
                                  ...current,
                                  [order.id]: event.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                            <Badge
                              tone={
                                status === "Dispensed"
                                  ? "success"
                                  : status === "Partially dispensed"
                                    ? "warning"
                                    : "muted"
                              }
                            >
                              {status}
                            </Badge>
                          </td>
                          <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => dispense(order)}
                              >
                                <PackageCheck className="h-4 w-4" />
                                Dispense
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        className="px-[var(--density-table-cell-x)] py-6 text-center text-sm text-muted-foreground"
                        colSpan={sortableColumns.length}
                      >
                        No drug orders match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
