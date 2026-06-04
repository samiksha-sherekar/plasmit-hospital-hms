"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Eye,
  UserRound,
} from "lucide-react";

import { useRole } from "@/components/providers/role-provider";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { mockPatients } from "@/data/patients";
import { nurseDrugOrders } from "@/features/nurse-drug-administration/data";
import type { NurseDrugOrder } from "@/features/nurse-drug-administration/types";
import type { Role } from "@/types";

const pharmacistRoles: Role[] = ["Pharmacist", "Super Admin", "Hospital Admin"];
type HistorySortKey =
  | "patient"
  | "totalDrugs"
  | "totalOrdered"
  | "totalDispensed"
  | "totalAdministered";
type HistorySortState = { key: HistorySortKey; direction: "asc" | "desc" };

const historyColumns: { key: HistorySortKey; label: string }[] = [
  { key: "patient", label: "Patient" },
  { key: "totalDrugs", label: "Drugs" },
  { key: "totalOrdered", label: "Ordered" },
  { key: "totalDispensed", label: "Dispensed" },
  { key: "totalAdministered", label: "Administered" },
];

function dispenseStatus(
  order: NurseDrugOrder,
  nextDispenseQty = order.dispensedQty,
) {
  if (nextDispenseQty <= 0) return "Pending";
  if (nextDispenseQty < order.orderedQty) return "Partially dispensed";
  return "Dispensed";
}

function HistorySortButton({
  label,
  column,
  sort,
  onSort,
}: {
  label: string;
  column: HistorySortKey;
  sort: HistorySortState;
  onSort: (key: HistorySortKey) => void;
}) {
  const active = sort.key === column;
  const SortIcon = active
    ? sort.direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ChevronsUpDown;

  return (
    <button
      type="button"
      className="flex items-center gap-2 text-left font-semibold uppercase tracking-wide hover:text-foreground"
      onClick={() => onSort(column)}
    >
      {label}
      <SortIcon
        className={
          active
            ? "h-3.5 w-3.5 text-foreground"
            : "h-3.5 w-3.5 text-muted-foreground/70"
        }
      />
    </button>
  );
}

function DrugDispenseHistory() {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<HistorySortState>({
    key: "patient",
    direction: "asc",
  });
  const [selectedPatientId, setSelectedPatientId] = React.useState<
    string | null
  >(null);
  const records = React.useMemo(() => {
    return mockPatients.map((patient, patientIndex) => {
      const drugs = nurseDrugOrders.slice(0, 4).map((order, orderIndex) => {
        const dispensedQty = Math.max(
          order.dispensedQty - ((patientIndex + orderIndex) % 2),
          0,
        );
        return {
          id: `${patient.id}-${order.id}`,
          drug: order.name,
          category: order.category,
          dosage: order.dosage,
          orderedQty: order.orderedQty,
          dispensedQty,
          administeredQty: Math.min(order.administeredQty, dispensedQty),
          status: dispenseStatus(order, dispensedQty),
        };
      });

      return {
        id: patient.id,
        patient: `${patient.firstName} ${patient.lastName}`,
        ageGender: `${patient.age} / ${patient.gender}`,
        bloodGroup: patient.bloodGroup,
        totalDrugs: drugs.length,
        totalOrdered: drugs.reduce((sum, drug) => sum + drug.orderedQty, 0),
        totalDispensed: drugs.reduce((sum, drug) => sum + drug.dispensedQty, 0),
        totalAdministered: drugs.reduce(
          (sum, drug) => sum + drug.administeredQty,
          0,
        ),
        drugs,
      };
    });
  }, []);

  const displayedRecords = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return records
      .filter((record) => {
        const drugText = record.drugs
          .map((drug) => `${drug.drug} ${drug.category} ${drug.status}`)
          .join(" ");
        return `${record.patient} ${record.ageGender} ${record.bloodGroup} ${drugText}`
          .toLowerCase()
          .includes(query);
      })
      .sort((left, right) => {
        const leftValue = left[sort.key];
        const rightValue = right[sort.key];
        const result =
          Number.isFinite(Number(leftValue)) &&
          Number.isFinite(Number(rightValue))
            ? Number(leftValue) - Number(rightValue)
            : String(leftValue).localeCompare(String(rightValue));
        return sort.direction === "asc" ? result : -result;
      });
  }, [records, search, sort]);

  const updateSort = (key: HistorySortKey) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const selectedRecord =
    records.find((record) => record.id === selectedPatientId) ?? null;

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Drug Dispense History</CardTitle>
            <CardDescription>
              One patient entry with full drug history available in view
              history.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              className="sm:w-80"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patient, drug, or status..."
            />
            <Badge tone="info">{displayedRecords.length} patient(s)</Badge>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <tr>
                    {historyColumns.map((column) => (
                      <th
                        key={column.key}
                        className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]"
                      >
                        <HistorySortButton
                          label={column.label}
                          column={column.key}
                          sort={sort}
                          onSort={updateSort}
                        />
                      </th>
                    ))}
                    <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-border last:border-0 hover:bg-surface-muted/70"
                    >
                      <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                        <div className="font-semibold text-foreground">
                          {record.patient}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {record.ageGender} / {record.bloodGroup}
                        </div>
                      </td>
                      <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                        {record.totalDrugs}
                      </td>
                      <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                        {record.totalOrdered}
                      </td>
                      <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                        {record.totalDispensed}
                      </td>
                      <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                        {record.totalAdministered}
                      </td>
                      <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPatientId(record.id)}
                          >
                            <Eye className="h-4 w-4" />
                            View History
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Drawer
        open={Boolean(selectedRecord)}
        onOpenChange={(open) => {
          if (!open) setSelectedPatientId(null);
        }}
        title={selectedRecord ? selectedRecord.patient : "Drug History"}
        description={
          selectedRecord
            ? `${selectedRecord.ageGender} / ${selectedRecord.bloodGroup}`
            : undefined
        }
        className="md:w-[760px]"
      >
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                    Drug
                  </th>
                  <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                    Category
                  </th>
                  <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                    Dose
                  </th>
                  <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                    Ordered
                  </th>
                  <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                    Dispensed
                  </th>
                  <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                    Administered
                  </th>
                  <th className="border-b border-border px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedRecord?.drugs.map((drug) => (
                  <tr
                    key={drug.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)] font-medium">
                      {drug.drug}
                    </td>
                    <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                      {drug.category}
                    </td>
                    <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                      {drug.dosage}
                    </td>
                    <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                      {drug.orderedQty}
                    </td>
                    <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                      {drug.dispensedQty}
                    </td>
                    <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                      {drug.administeredQty}
                    </td>
                    <td className="px-[var(--density-table-cell-x)] py-[var(--density-table-cell-y)]">
                      <Badge
                        tone={
                          drug.status === "Dispensed"
                            ? "success"
                            : drug.status === "Partially dispensed"
                              ? "warning"
                              : "muted"
                        }
                      >
                        {drug.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export function PharmacistDrugDispenseHistoryPage() {
  const { role } = useRole();
  const allowed = pharmacistRoles.includes(role);

  if (!allowed) {
    return (
      <EmptyState
        icon={UserRound}
        title="Pharmacist access required"
        description="Switch to Pharmacist role to view patient drug dispense history."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pharmacist Workspace"
        title="Drug Dispense History"
        description="Review patient-wise dispense history and open detailed drug records."
        className="static mx-0 border-b bg-transparent px-0 py-2"
      />
      <DrugDispenseHistory />
    </div>
  );
}
