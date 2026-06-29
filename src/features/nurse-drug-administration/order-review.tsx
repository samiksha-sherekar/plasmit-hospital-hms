"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

import { NurseOrderDetailsDrawer } from "./details/nurse-order-details-drawer";
import { nurseDrugCategories } from "./data";
import type { NurseDrugOrder } from "./types";
import type { NurseOrderDetailsModel } from "./details/types";
import { buildSchedule, formatDateDisplay, formatDateTimeDisplay, getEndDate, getNextDueLabel } from "./schedule-utils";

type NurseOrderAction = "Receive" | "Discontinue" | "Return" | "Modify";

function remainingQty(order: NurseDrugOrder) {
  return Math.max(order.receivedQty - order.administeredQty, 0);
}

function orderStatus(order: NurseDrugOrder) {
  if (order.receivedQty <= 0) return "Pending";
  if (order.receivedQty < order.orderedQty) return "Partially received";
  return "Received";
}

function ReadOnlyInput({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input value={String(value)} readOnly className="bg-background font-semibold" />
    </label>
  );
}

function mapOrderToDetails(order: NurseDrugOrder): NurseOrderDetailsModel {
  const orderDate = order.orderDate ?? new Date().toISOString();
  const startDate = order.startDate ?? orderDate;
  const endDate = order.endDate ?? getEndDate(startDate, order.days);
  const lastAdministration = order.lastAdministeredAt ? formatDateTimeDisplay(order.lastAdministeredAt) : "Not Administered";
  const schedule = buildSchedule(startDate, order.days, order.frequency);
  const scheduleSlots = schedule.flatMap((day) => day.times.map((time) => ({ date: day.date, time })));

  return {
    patientName: order.name,
    mrn: order.id,
    ward: order.category,
    bed: order.form,
    prescriber: order.lastAdministeredBy || "-",
    orderNumber: order.id,
    orderType: order.category,
    orderDate: formatDateDisplay(orderDate) || "-",
    priority: order.priority || "-",
    orderStatus: orderStatus(order),
    orderedBy: order.lastAdministeredBy || "-",
    genericName: order.name,
    brandName: order.name,
    drugForm: order.form,
    category: order.category,
    strength: order.dosage || "-",
    dose: order.dosage || "-",
    doseUnit: "-",
    route: order.route || "-",
    diluent: order.diluent,
    diluentVolume: order.bagVolume ? String(order.bagVolume) : "-",
    infusionRate: order.administeredVolume ? String(order.administeredVolume) : "-",
    administrationInstructions: order.instructions || "-",
    pharmacy: "-",
    startDate: formatDateDisplay(startDate) || "-",
    endDate,
    scheduledTime: order.cells[0]?.time || "-",
    frequency: order.frequency || "-",
    days: order.days || "-",
    lastAdministration,
    nextDueTime: getNextDueLabel(order.frequency),
    orderedQty: String(order.orderedQty),
    dispensedQty: String(order.dispensedQty),
    receivedQty: String(order.receivedQty),
    administeredQty: String(order.administeredQty),
    remainingQty: String(remainingQty(order)),
    schedule,
    administrations: scheduleSlots.map((slot, index) => {
      const administeredCell = order.cells.find((cell) => cell.status === "administered" && cell.time === slot.time);
      const isAdministered = Boolean(administeredCell);
      const actualDateTime = isAdministered && order.lastAdministeredAt ? formatDateTimeDisplay(order.lastAdministeredAt) : "-";

      return {
        id: `${order.id}-${index}`,
        administrationDate: slot.date,
        scheduledTime: slot.time,
        actualTime: actualDateTime,
        doseGiven: order.dosage || "-",
        status: isAdministered ? "Administered" : "Pending",
        nurse: isAdministered ? order.lastAdministeredBy || "-" : "-",
        remarks: isAdministered ? order.administrationNote || "Completed" : "Awaiting administration",
      };
    }),
    notes: order.administrationNote
      ? [
          {
            id: `${order.id}-note-1`,
            time: formatDateTimeDisplay(order.lastAdministeredAt || "") || "-",
            author: order.lastAdministeredBy || "-",
            note: order.administrationNote,
          },
        ]
      : [],
  };
}

function PopupShell({
  open,
  action,
  order,
  onOpenChange,
  children,
  footer,
}: {
  open: boolean;
  action: NurseOrderAction | "Status";
  order: NurseDrugOrder;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={action}
      description={`${order.name} / ${order.category}`}
      className="w-[calc(100vw-2rem)] max-w-3xl"
      footer={<div className="flex justify-end gap-2">{footer}</div>}
    >
      <div className="space-y-4">{children}</div>
    </Drawer>
  );
}

function OrderActionFields({ action, order, canReceive }: { action: NurseOrderAction | "Status"; order: NurseDrugOrder; canReceive: boolean }) {
  if (action === "Status") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <ReadOnlyInput label="Status" value={orderStatus(order)} />
        <ReadOnlyInput label="Received" value={`${order.receivedQty}/${order.orderedQty}`} />
        <ReadOnlyInput label="Administered" value={`${order.administeredQty}/${order.receivedQty}`} />
        <ReadOnlyInput label="Priority" value={order.priority || "Routine"} />
        <ReadOnlyInput label="Diluent" value={order.diluent || "-"} />
        <ReadOnlyInput label="Bolus route" value={order.bolusRoute || "-"} />
      </div>
    );
  }

  if (action === "Receive") {
    return (
      <div className="space-y-3">
        <div className="rounded-md border border-border bg-surface-muted p-3 text-sm">
          Pharmacy dispensed {order.dispensedQty} of {order.orderedQty}. Receive is {canReceive ? "enabled" : "disabled"} for this order.
        </div>
        <Input type="number" min={0} max={Math.max(order.dispensedQty - order.receivedQty, 0)} defaultValue={Math.max(order.dispensedQty - order.receivedQty, 0)} aria-label="Receive quantity" />
      </div>
    );
  }

  if (action === "Discontinue") {
    return (
      <label className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Reason for Discontinuing</span>
        <Input placeholder="Enter reason" defaultValue={order.discontinuedReason ?? ""} />
      </label>
    );
  }

  if (action === "Return") {
    return (
      <div className="grid gap-2 sm:grid-cols-4">
        <ReadOnlyInput label="Received qt" value={order.receivedQty} />
        <ReadOnlyInput label="Adm qt" value={order.administeredQty} />
        <ReadOnlyInput label="Remaining qt" value={remainingQty(order)} />
        <label className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Return qt</span>
          <Input type="number" min={0} max={remainingQty(order)} defaultValue={remainingQty(order)} />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Reason for Modifying</span>
        <Input placeholder="Enter reason" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Start date</span>
          <Input type="date" />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">End date</span>
          <Input type="date" />
        </label>
      </div>
    </div>
  );
}

function OrderActionPopup({
  open,
  action,
  order,
  onOpenChange,
}: {
  open: boolean;
  action: NurseOrderAction | "Status" | null;
  order: NurseDrugOrder | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!order || !action) return null;
  const canReceive = order.dispensedQty > order.receivedQty;

  const accept = () => {
    toast.success(`${action} saved for ${order.name}`);
    onOpenChange(false);
  };

  return (
    <PopupShell
      open={open}
      action={action}
      order={order}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button className="bg-danger" onClick={() => onOpenChange(false)}>Cancel</Button>
          {action === "Status" ? null : (
            <Button onClick={accept} disabled={action === "Receive" && !canReceive}>
              <CheckCircle2 className="h-4 w-4" />
              {action === "Return" ? "Return" : "Accept"}
            </Button>
          )}
        </>
      }
    >
      <OrderActionFields action={action} order={order} canReceive={canReceive} />
    </PopupShell>
  );
}

function CategoryList({
  orders,
  activeCategory,
  onCategoryChange,
}: {
  orders: NurseDrugOrder[];
  activeCategory: NurseDrugOrder["category"];
  onCategoryChange: (category: NurseDrugOrder["category"]) => void;
}) {
  return (
    <Card className="xl:self-start">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {nurseDrugCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={[
              "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition",
              activeCategory === category ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:bg-surface-muted",
            ].join(" ")}
            onClick={() => onCategoryChange(category)}
          >
            <span>{category}</span>
            <span className="text-xs">{orders.filter((order) => order.category === category).length}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function OrderCard({ order, onAction }: { order: NurseDrugOrder; onAction: (order: NurseDrugOrder, action: NurseOrderAction | "Status") => void }) {
  const status = orderStatus(order);
  const canReceive = order.dispensedQty > order.receivedQty;

  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_150px_320px] lg:items-start">
        <div className="min-w-0 space-y-1">
          <div className="truncate text-sm font-semibold text-foreground">{order.name}</div>
          <div className="text-xs text-muted-foreground">
            {order.form} / {order.dosage || "-"} / {order.frequency || "-"} / {order.days || "-"} days
          </div>
          <div className="text-xs text-muted-foreground">Instructions: {order.instructions || "-"} {order.taperedDose ? `(Tapered dose: ${order.taperedDose})` : ""}</div>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <Badge tone="muted">{order.category}</Badge>
            {order.priority ? <Badge tone="info">{order.priority}</Badge> : null}
            {order.diluent ? <Badge tone="muted">{order.diluent}</Badge> : null}
            {order.bolusDose ? <Badge tone="warning">Bolus {order.bolusDose}</Badge> : null}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">Status</div>
          <button
            type="button"
            title={`Status: ${status}. Received: ${order.receivedQty}/${order.orderedQty}. Administered: ${order.administeredQty}/${order.receivedQty}`}
            onClick={() => onAction(order, "Status")}
          >
            <Badge tone={status === "Received" ? "success" : status === "Partially received" ? "warning" : "muted"}>{status}</Badge>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Button type="button" size="sm" variant="outline" onClick={() => onAction(order, "Status")}>
            View Details
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={!canReceive} title={canReceive ? `Dispensed pending: ${order.dispensedQty - order.receivedQty}` : "Receive disabled after receiving dispensed drugs"} onClick={() => onAction(order, "Receive")}>Receive</Button>
          {/* <Button type="button" size="sm" variant="outline" onClick={() => onAction(order, "Discontinue")}>Discontinue</Button>
          <Button type="button" size="sm" variant="outline" title={`Remaining quantity: ${remainingQty(order)}`} onClick={() => onAction(order, "Return")}>Return</Button> */}
          <Button type="button" size="sm" variant="outline" onClick={() => onAction(order, "Modify")}>Modify</Button>
        </div>
      </div>
    </div>
  );
}

function OrdersPanel({
  activeCategory,
  categoryOrders,
  onAction,
}: {
  activeCategory: NurseDrugOrder["category"];
  categoryOrders: NurseDrugOrder[];
  onAction: (order: NurseDrugOrder, action: NurseOrderAction | "Status") => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{activeCategory}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categoryOrders.length ? (
          categoryOrders.map((order) => <OrderCard key={order.id} order={order} onAction={onAction} />)
        ) : (
          <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">No {activeCategory.toLowerCase()} drug orders found.</div>
        )}
      </CardContent>
    </Card>
  );
}

export function DrugOrderReviewTab({ orders }: { orders: NurseDrugOrder[] }) {
  const [activeCategory, setActiveCategory] = React.useState<NurseDrugOrder["category"]>("SOS");
  const [popupOrder, setPopupOrder] = React.useState<NurseDrugOrder | null>(null);
  const [popupAction, setPopupAction] = React.useState<NurseOrderAction | "Status" | null>(null);
  const [detailsOrder, setDetailsOrder] = React.useState<NurseDrugOrder | null>(null);
  const categoryOrders = orders.filter((order) => order.category === activeCategory);
  const detailsModel = React.useMemo(() => (detailsOrder ? mapOrderToDetails(detailsOrder) : undefined), [detailsOrder]);

  const openPopup = (order: NurseDrugOrder, action: NurseOrderAction | "Status") => {
    if (action === "Status") {
      setDetailsOrder(order);
      return;
    }
    setPopupOrder(order);
    setPopupAction(action);
  };

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        <CategoryList orders={orders} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <OrdersPanel activeCategory={activeCategory} categoryOrders={categoryOrders} onAction={openPopup} />
      </div>
      <OrderActionPopup open={Boolean(popupOrder && popupAction)} action={popupAction} order={popupOrder} onOpenChange={(open) => !open && setPopupOrder(null)} />
      <Drawer
        open={Boolean(detailsOrder)}
        onOpenChange={(open) => !open && setDetailsOrder(null)}
        title="Order Details"
        description={detailsOrder ? `${detailsOrder.name} / ${detailsOrder.category}` : undefined}
        className="w-[calc(100vw-2rem)] max-w-5xl"
      >
        {detailsModel ? <NurseOrderDetailsDrawer order={detailsModel} /> : null}
      </Drawer>
    </>
  );
}
