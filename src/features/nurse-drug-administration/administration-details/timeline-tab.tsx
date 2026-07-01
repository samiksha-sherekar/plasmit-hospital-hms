"use client";

import { AdministrationTimeline } from "../administration-timeline";
import type { AdministrationCell, NurseDrugOrder } from "../types";

export function TimelineTab({
  orders,
  selectedDate,
  today,
  onDateChange,
  onCellSelect,
}: {
  orders: NurseDrugOrder[];
  selectedDate: string;
  today: string;
  onDateChange: (date: string) => void;
  onCellSelect: (order: NurseDrugOrder, cell?: AdministrationCell) => void;
}) {
  return <AdministrationTimeline orders={orders} selectedDate={selectedDate} today={today} onDateChange={onDateChange} onCellSelect={onCellSelect} />;
}
