"use client";

import * as React from "react";
import { ClipboardCheck, CircleCheckBig } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LdtResultReviewTab } from "./ldt/result-review-tab";
import { LdtTestOrderTab, type LdtDraft } from "./ldt/test-order-tab";
import type { LdtOrderPriority, LdtOrderStatus, LdtSummaryRow } from "./ldt/types";
import { LdtOrderSummaryTab } from "./ldt/order-summary-tab";

type MainTab = "test-order" | "order-summary" | "review";

type DraftErrors = Partial<Record<keyof LdtDraft, string>>;

const today = new Date().toISOString().slice(0, 10);

const initialRows: LdtSummaryRow[] = [
  { id: "ldt-001", orderNo: "LDT-001", ldtType: "PICC Single Lumen", priority: "Routine", indication: "Blood", status: "Pending", orderDate: today },
  { id: "ldt-002", orderNo: "LDT-002", ldtType: "PICC Double Lumen", priority: "Urgent", indication: "Urine", status: "Active", orderDate: today },
  { id: "ldt-003", orderNo: "LDT-003", ldtType: "Central Venous Catheter", priority: "STAT", indication: "Saline", status: "Completed", orderDate: today },
];

export function LdtTab() {
  const [activeTab, setActiveTab] = React.useState<MainTab>("test-order");
  const [summaryRows, setSummaryRows] = React.useState<LdtSummaryRow[]>(initialRows);
  const [draft, setDraft] = React.useState<LdtDraft>({
    ldtType: "",
    priority: "",
    reason: "",
    clinicalNotes: "",
    ldtName: "",
    orderDate: "",
    status: "Pending",
  });
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<LdtOrderPriority | "All Priority">("All Priority");
  const [statusFilter, setStatusFilter] = React.useState<LdtOrderStatus | "All Status">("All Status");
  const [dateRange, setDateRange] = React.useState("");
  const [editingRow, setEditingRow] = React.useState<LdtSummaryRow | null>(null);
  const [viewingRow, setViewingRow] = React.useState<LdtSummaryRow | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<LdtSummaryRow | null>(null);
  const [draftErrors, setDraftErrors] = React.useState<DraftErrors>({});
  const [submitMessage, setSubmitMessage] = React.useState<string | null>(null);

  const filteredSummaryRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return summaryRows.filter((row) => {
      const matchesSearch = `${row.orderNo} ${row.ldtType} ${row.indication} ${row.priority} ${row.status}`.toLowerCase().includes(query);
      const matchesPriority = priorityFilter === "All Priority" || row.priority === priorityFilter;
      const matchesStatus = statusFilter === "All Status" || row.status === statusFilter;
      const matchesDate = !dateRange || row.orderDate === dateRange;
      return matchesSearch && matchesPriority && matchesStatus && matchesDate;
    });
  }, [dateRange, priorityFilter, search, statusFilter, summaryRows]);

  const resetForm = React.useCallback((row?: LdtSummaryRow | null) => {
    if (!row) {
      setDraft({
        ldtType: "",
        priority: "",
        reason: "",
        clinicalNotes: "",
        ldtName: "",
        orderDate: "",
        status: "Pending",
      });
      return;
    }

    setDraft({
      ldtType: row.ldtType,
      priority: row.priority,
      reason: row.indication,
      clinicalNotes: "",
      ldtName: row.ldtType,
      orderDate: row.orderDate,
      status: row.status,
    });
  }, []);

  const validateDraft = React.useCallback((value: LdtDraft) => {
    const nextErrors: DraftErrors = {};

    if (!value.ldtType.trim()) nextErrors.ldtType = "LDT Type is required.";
    if (!value.priority) nextErrors.priority = "Priority is required.";
    if (!value.orderDate.trim()) nextErrors.orderDate = "Order Date is required.";
    if (!value.reason.trim()) nextErrors.reason = "Reason / Indication is required.";

    return nextErrors;
  }, []);

  const saveLdtOrder = () => {
    const nextErrors = validateDraft(draft);
    setDraftErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage(null);
      return;
    }

    const ldtType = draft.ldtName.trim() || draft.ldtType;
    const indication = draft.reason.trim() || "-";
    const priority = draft.priority || "Routine";
    const orderDate = draft.orderDate || today;

    if (editingRow) {
      setSummaryRows((current) =>
        current.map((row) =>
          row.id === editingRow.id
            ? {
                ...row,
                ldtType,
                priority,
                indication,
                status: draft.status,
                orderDate,
              }
            : row,
        ),
      );
      setEditingRow(null);
      setSubmitMessage(`LDT order ${editingRow.orderNo} updated successfully.`);
    } else {
      const nextOrderNo = `LDT-${String(summaryRows.length + 1).padStart(3, "0")}`;
      setSummaryRows((current) => [
        {
          id: `ldt-${String(current.length + 1).padStart(3, "0")}`,
          orderNo: nextOrderNo,
          ldtType,
          indication,
          priority,
          status: draft.status,
          orderDate,
        },
        ...current,
      ]);
      setSubmitMessage(`LDT order ${nextOrderNo} saved successfully.`);
    }

    setDraft({
      ldtType: "",
      priority: "",
      reason: "",
      clinicalNotes: "",
      ldtName: "",
      orderDate: "",
      status: "Pending",
    });
    setActiveTab("order-summary");
    setViewingRow(null);
    setDraftErrors({});
  };

  const handleView = (row: LdtSummaryRow) => {
    setViewingRow(row);
    setEditingRow(null);
    resetForm(row);
    setDraftErrors({});
    setSubmitMessage(null);
    setViewDrawerOpen(true);
  };

  const handleEdit = (row: LdtSummaryRow) => {
    setEditingRow(row);
    setViewingRow(null);
    resetForm(row);
    setDraftErrors({});
    setSubmitMessage(null);
    setActiveTab("test-order");
  };

  const handleDelete = (row: LdtSummaryRow) => {
    setDeleteTarget(row);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setSummaryRows((current) => current.filter((item) => item.id !== deleteTarget.id));
    if (editingRow?.id === deleteTarget.id) setEditingRow(null);
    if (viewingRow?.id === deleteTarget.id) {
      setViewingRow(null);
      setViewDrawerOpen(false);
    }
    setDeleteTarget(null);
    setSubmitMessage(`LDT order ${deleteTarget.orderNo} deleted successfully.`);
  };

  const closeViewDrawer = (open: boolean) => {
    setViewDrawerOpen(open);
    if (!open) setViewingRow(null);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MainTab)} className="w-full">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0">
              <Button type="button" size="sm" variant={activeTab === "test-order" ? "default" : "outline"} onClick={() => setActiveTab("test-order")} className="min-w-[132px] shrink-0">
                <ClipboardCheck className="h-4 w-4" />
                Test Order
              </Button>
              <Button type="button" size="sm" variant={activeTab === "order-summary" ? "default" : "outline"} onClick={() => setActiveTab("order-summary")} className="min-w-[132px] shrink-0">
                <ClipboardCheck className="h-4 w-4" />
                Order Summary
              </Button>
              <Button type="button" size="sm" variant={activeTab === "review" ? "default" : "outline"} onClick={() => setActiveTab("review")} className="min-w-[132px] shrink-0">
                <ClipboardCheck className="h-4 w-4" />
                Review
              </Button>
            </div>

            {submitMessage ? (
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <CircleCheckBig className="h-4 w-4" />
                {submitMessage}
              </div>
            ) : null}

            <TabsContent value="test-order" className="mt-0">
              <LdtTestOrderTab draft={draft} onDraftChange={setDraft} onSave={saveLdtOrder} readOnly={Boolean(viewingRow) && !editingRow} errors={draftErrors} />
            </TabsContent>
            <TabsContent value="order-summary" className="mt-0 space-y-4">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(160px,1fr))]">
                <label className="space-y-1 text-xs font-medium text-muted-foreground mt-1">
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search LDT orders..." aria-label="Search LDT orders" />
                </label>
                <SelectFilter label="" value={priorityFilter} onChange={setPriorityFilter} options={["All Priority", "Routine", "Urgent", "STAT"]} />
                <SelectFilter label="" value={statusFilter} onChange={setStatusFilter} options={["All Status", "Pending", "Active", "Completed", "Cancelled"]} />
                <label className="space-y-1 text-xs font-medium text-muted-foreground mt-1">
                  <div className="relative">
                    <Input type="date" value={dateRange} onChange={(event) => setDateRange(event.target.value)} aria-label="Filter order date" className="pr-10" />
                  </div>
                </label>
              </div>
              <LdtOrderSummaryTab rows={filteredSummaryRows} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
            </TabsContent>
            <TabsContent value="review" className="mt-0">
              <LdtResultReviewTab />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <Drawer
        open={viewDrawerOpen && Boolean(viewingRow)}
        onOpenChange={closeViewDrawer}
        title={viewingRow ? `View ${viewingRow.orderNo}` : "View LDT Order"}
        description={viewingRow ? "LDT order details" : undefined}
        footer={
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setViewDrawerOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {viewingRow ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Order No" value={viewingRow.orderNo} />
            <DetailItem label="LDT Type" value={viewingRow.ldtType} />
            <DetailItem label="Priority" value={viewingRow.priority} />
            <DetailItem label="Indication" value={viewingRow.indication} />
            <DetailItem label="Order Date" value={viewingRow.orderDate} />
            <DetailItem label="Status" value={viewingRow.status} />
          </div>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete LDT order"
        description={`Are you sure you want to delete ${deleteTarget?.orderNo ?? "this LDT order"}?`}
        confirmLabel="Delete"
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted/40 p-3">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[] }) {
  return (
    <label className="space-y-1 text-xs font-medium text-muted-foreground">
      <span>{label}</span>
      <select className="h-10 w-full rounded-md border border-input px-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
