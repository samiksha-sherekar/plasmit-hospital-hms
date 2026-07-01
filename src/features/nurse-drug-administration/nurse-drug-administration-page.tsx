"use client";

import * as React from "react";
import { UserRound } from "lucide-react";

import { useRole } from "@/components/providers/role-provider";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPatients } from "@/data/patients";
import type { Role } from "@/types";

import { MedicationListTab } from "./administration-details/drug-list-tab";
import { TimelineTab } from "./administration-details/timeline-tab";
import { defaultAdministrationDetail, defaultFluidDetail, nurseDrugOrders } from "./data";
import { AdministrationDetailsPanel, FluidAdministrationDetailsPanel } from "./detail-panels";
import { DrugOrderReviewTab } from "./order-review";
import { NurseMedicationPatientSummary } from "./patient-summary";
import type { AdministrationCell, AdministrationDetail, FluidAdministrationDetail, NurseDrugOrder } from "./types";import type { MedicationAdministration } from "./administration-details/types";

const nurseRoles: Role[] = ["Nurse", "Super Admin", "Hospital Admin"];

function formatCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function formatCurrentDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function buildAdministrationDetail(order: NurseDrugOrder, selectedDate: string, cell?: AdministrationCell): AdministrationDetail {
  const isOverdue = cell?.status === "overdue";
  return {
    ...defaultAdministrationDetail,
    orderId: order.id,
    orderName: order.name,
    category: order.category,
    administrationDate: selectedDate,
    dosage: cell?.label?.replace("Overdue ", "") || order.dosage,
    time: formatCurrentTime(),
    priority: order.priority ?? defaultAdministrationDetail.priority,
    lastAdministeredAt: order.lastAdministeredAt ?? "",
    lastAdministeredBy: order.lastAdministeredBy ?? "",
    action: isOverdue ? "Late administered" : "Administered",
    reason: isOverdue ? "Scheduled dose overdue by more than 1 hour" : "",
    administrationNote: order.administrationNote ?? "",
    counterChecked: false,
    counterCheckedBy: "",
    counterCheckedAt: "",
  };
}

function mapToMedicationAdministration(order: NurseDrugOrder): MedicationAdministration {
  const status = order.category === "Continuous" ? "Running" : order.administeredQty > 0 && order.administeredQty < order.orderedQty ? "Partial" : order.receivedQty > 0 ? "Due" : "Pending";
  const orderStatus = order.category === "Discontinued" ? "Discontinued" : order.receivedQty > 0 ? "Received" : order.dispensedQty > 0 ? "Dispensed" : "Pending";
  return {
    id: order.id,
    patientId: order.id,
    patientName: order.name,
    drugName: order.name,
    genericName: order.orderLabel || order.name,
    category: order.category,
    form: order.form,
    dose: order.dosage,
    doseUnit: "",
    route: order.route,
    frequency: order.frequency,
    priority: order.priority || "Routine",
    orderDate: order.orderDate || formatCurrentDate(),
    startDate: order.startDate || order.orderDate || formatCurrentDate(),
    endDate: order.endDate || order.orderDate || formatCurrentDate(),
    nextDueTime: order.nextDueTime || order.scheduledTime || "-",
    orderStatus,
    status,
    orderedQty: order.orderedQty,
    dispensedQty: order.dispensedQty,
    receivedQty: order.receivedQty,
    administeredQty: order.administeredQty,
    timeline: order.cells.map((cell) => ({
      date: order.orderDate || formatCurrentDate(),
      time: cell.time,
      label: cell.label || order.name,
      status: cell.status === "administered" ? "done" : cell.status === "overdue" ? "overdue" : cell.status === "infusion" ? "running" : cell.status === "bolus" ? "held" : "due",
    })),
  };
}
function buildFluidDetail(order: NurseDrugOrder, selectedDate: string): FluidAdministrationDetail {
  const bagVolume = order.bagVolume ?? 500;
  const volumeAdministered = order.administeredVolume ?? 0;
  const volumeRemaining = Math.max(bagVolume - volumeAdministered, 0);

  return {
    ...defaultFluidDetail,
    orderId: order.id,
    orderName: order.name,
    category: order.category,
    administrationDate: selectedDate,
    rate: order.dosage,
    time: formatCurrentTime(),
    diluent: order.diluent ?? defaultFluidDetail.diluent,
    lastAdministeredAt: order.lastAdministeredAt ?? "",
    lastAdministeredBy: order.lastAdministeredBy ?? "",
    bagVolume: String(bagVolume),
    volumeAdministered: String(volumeAdministered),
    volumeRemaining: String(volumeRemaining),
    newBag: false,
    bagCount: String(order.bagCount ?? 1),
    bolusDose: order.bolusDose ?? "",
    bolusRoute: order.bolusRoute ?? defaultFluidDetail.bolusRoute,
    counterChecked: false,
    counterCheckedBy: "",
    counterCheckedAt: "",
  };
}

export function NurseDrugAdministrationPage() {
  const { role } = useRole();
  const allowed = nurseRoles.includes(role);
  const [administrationDetail, setAdministrationDetail] = React.useState<AdministrationDetail>(defaultAdministrationDetail);
  const [fluidDetail, setFluidDetail] = React.useState<FluidAdministrationDetail>(defaultFluidDetail);
  const [administrationOpen, setAdministrationOpen] = React.useState(false);
  const [fluidOpen, setFluidOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(formatCurrentDate);
  const [selectedPatientId, setSelectedPatientId] = React.useState(mockPatients[0]?.id ?? "");
  const today = React.useMemo(() => formatCurrentDate(), []);

  const displayedOrders = React.useMemo(() => {
    if (selectedDate < today) {
      return nurseDrugOrders.map((order) => ({
        ...order,
        lastAdministeredAt: order.lastAdministeredAt || "Yesterday 22:00",
        cells: order.cells.map((cell) => ({
          ...cell,
          label: cell.label?.replace("Overdue ", "") ?? (cell.status === "infusion" ? `${order.dosage} infusion` : undefined),
          status: cell.status === "empty" ? cell.status : ("administered" as const),
        })),
      }));
    }

    if (selectedDate > today) {
      return nurseDrugOrders.map((order) => ({
        ...order,
        lastAdministeredAt: "",
        lastAdministeredBy: "",
        administeredVolume: 0,
        cells: order.cells.map((cell) => ({
          ...cell,
          label: cell.status === "infusion" ? `${order.dosage} planned` : cell.label?.replace("Overdue ", ""),
          status: cell.status === "empty" ? cell.status : ("due" as const),
        })),
      }));
    }

    return nurseDrugOrders;
  }, [selectedDate, today]);

  if (!allowed) {
    return (
      <EmptyState
        icon={UserRound}
        title="Nurse access required"
        description="Switch to Nurse role to open drug administration."
      />
    );
  }

  const handleCellSelect = (order: NurseDrugOrder, cell?: AdministrationCell) => {
    if (order.category === "Continuous" || order.category === "Diluent" || order.form === "IV Fluid") {
      setFluidDetail(buildFluidDetail(order, selectedDate));
      setFluidOpen(true);
      return;
    }
    setAdministrationDetail(buildAdministrationDetail(order, selectedDate, cell));
    setAdministrationOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* <PageHeader
        title="Drug Administration"
        className="static mx-0 border-b bg-transparent px-0 py-2"
      /> */}

      {/* <NurseMedicationPatientSummary patientId={selectedPatientId} onPatientChange={setSelectedPatientId} /> */}

      {/* <AlertBanner icon={Pill} tone="info" title="Administration safety">
        Select a time slot to review administration details, counter-check requirements, overdue status, and fluid bag information before accepting.
      </AlertBanner> */}

            <Tabs defaultValue="drug-order" className="space-y-4">
        <TabsList className="w-full justify-start rounded-lg bg-surface-muted p-1">
          <TabsTrigger value="drug-order">Drug Order</TabsTrigger>
          <TabsTrigger value="drug-administration">Drug Administration</TabsTrigger>
        </TabsList>

        <TabsContent value="drug-order">
          <DrugOrderReviewTab orders={displayedOrders} />
        </TabsContent>

        <TabsContent value="drug-administration">
          <Tabs defaultValue="medication-list" className="w-full">
            <TabsList className="w-full justify-start rounded-lg bg-surface-muted p-1">
              <TabsTrigger value="medication-list">Medication List</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="medication-list">
              <MedicationListTab orders={displayedOrders.map(mapToMedicationAdministration)} onAdminister={(record) => { const original = displayedOrders.find((order) => order.id === record.id); if (original) handleCellSelect(original, original.cells.find((cell) => cell.status === "due" || cell.status === "overdue" || cell.status === "administered" || cell.status === "infusion" || cell.status === "bolus")); }} />
            </TabsContent>

            <TabsContent value="timeline">
              <TimelineTab
                orders={displayedOrders}
                selectedDate={selectedDate}
                today={today}
                onDateChange={setSelectedDate}
                onCellSelect={handleCellSelect}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      <AdministrationDetailsPanel
        open={administrationOpen}
        detail={administrationDetail}
        onOpenChange={setAdministrationOpen}
        onChange={setAdministrationDetail}
      />
      <FluidAdministrationDetailsPanel open={fluidOpen} detail={fluidDetail} onOpenChange={setFluidOpen} onChange={setFluidDetail} />
    </div>
  );
}












