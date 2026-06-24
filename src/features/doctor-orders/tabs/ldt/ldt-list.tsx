"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Plus, SearchX, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

import { LdtSummaryCards } from "./ldt-summary-cards";
import type { LdtOrder, LdtOrderPriority, LdtOrderStatus, LdtOrderType } from "./types";

const initialOrders: LdtOrder[] = [
  { id: "ldt-001", orderNo: "LDT-9001", orderType: "Insert", ldtName: "PICC line", priority: "Routine", orderDate: "2026-06-23", status: "Pending" },
  { id: "ldt-002", orderNo: "LDT-9002", orderType: "Remove", ldtName: "Foley catheter", priority: "Urgent", orderDate: "2026-06-23", status: "Active" },
  { id: "ldt-003", orderNo: "LDT-9003", orderType: "Replace", ldtName: "Peripheral IV cannula", priority: "STAT", orderDate: "2026-06-23", status: "Completed" },
];

const orderTypeOptions: LdtOrderType[] = ["Insert", "Remove", "Replace"];
const priorityOptions: LdtOrderPriority[] = ["Routine", "Urgent", "STAT"];
const statusOptions: LdtOrderStatus[] = ["Pending", "Active", "Completed", "Cancelled"];

type DrawerMode = "create" | "edit";

export function LdtListPage() {
  const [search, setSearch] = React.useState("");
  const [orderType, setOrderType] = React.useState<LdtOrderType | "All Types">("All Types");
  const [priority, setPriority] = React.useState<LdtOrderPriority | "All Priority">("All Priority");
  const [status, setStatus] = React.useState<LdtOrderStatus | "All Status">("All Status");
  const [dateRange, setDateRange] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<DrawerMode>("create");
  const [editingOrder, setEditingOrder] = React.useState<LdtOrder | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<LdtOrder | null>(null);
  const [draft, setDraft] = React.useState({
    orderType: "Insert" as LdtOrderType,
    priority: "Routine" as LdtOrderPriority,
    ldtName: "",
    orderDate: "",
    status: "Pending" as LdtOrderStatus,
  });

  const filteredOrders = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return initialOrders.filter((order) => {
      const matchesSearch = `${order.orderNo} ${order.orderType} ${order.ldtName} ${order.priority} ${order.orderDate} ${order.status}`.toLowerCase().includes(query);
      const matchesType = orderType === "All Types" || order.orderType === orderType;
      const matchesPriority = priority === "All Priority" || order.priority === priority;
      const matchesStatus = status === "All Status" || order.status === status;
      const matchesDate = !dateRange || order.orderDate === dateRange;
      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesDate;
    });
  }, [dateRange, orderType, priority, search, status]);

  const openCreateDrawer = () => {
    setDrawerMode("create");
    setEditingOrder(null);
    setDraft({ orderType: "Insert", priority: "Routine", ldtName: "", orderDate: "", status: "Pending" });
    setDrawerOpen(true);
  };

  const openEditDrawer = (order: LdtOrder) => {
    setDrawerMode("edit");
    setEditingOrder(order);
    setDraft({ orderType: order.orderType, priority: order.priority, ldtName: order.ldtName, orderDate: order.orderDate, status: order.status });
    setDrawerOpen(true);
  };

  const columns = React.useMemo<ColumnDef<LdtOrder>[]>(
    () => [
      { header: "Order No", accessorKey: "orderNo" },
      { header: "Order Type", accessorKey: "orderType" },
      { header: "LDT Name", accessorKey: "ldtName" },
      { header: "Priority", cell: ({ row }) => <Badge tone={row.original.priority === "STAT" ? "danger" : row.original.priority === "Urgent" ? "warning" : "success"}>{row.original.priority}</Badge> },
      { header: "Order Date", accessorKey: "orderDate" },
      { header: "Status", cell: ({ row }) => <Badge tone={row.original.status === "Completed" ? "success" : row.original.status === "Cancelled" ? "danger" : row.original.status === "Active" ? "info" : "warning"}>{row.original.status}</Badge> },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" type="button"><Eye className="h-3.5 w-3.5" />View</Button>
            <Button size="sm" variant="outline" type="button" onClick={() => openEditDrawer(row.original)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
            <Button size="sm" variant="outline" type="button" className="text-danger" onClick={() => setDeleteTarget(row.original)}><XCircle className="h-3.5 w-3.5" />Delete</Button>
          </div>
        ),
      },
    ],
    [],
  );

  const isEditing = drawerMode === "edit" && Boolean(editingOrder);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1" />
            <Button className="sm:ml-auto" onClick={openCreateDrawer}>
              <Plus className="h-4 w-4" />
              Create LDT Order
            </Button>
          </div>

          <LdtSummaryCards orders={initialOrders} />

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(4,minmax(160px,1fr))]">
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Search</span>
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search LDT orders..." aria-label="Search LDT orders" />
            </label>
            <SelectFilter label="Order Type" value={orderType} onChange={setOrderType} options={["All Types", ...orderTypeOptions]} />
            <SelectFilter label="Priority" value={priority} onChange={setPriority} options={["All Priority", ...priorityOptions]} />
            <SelectFilter label="Status" value={status} onChange={setStatus} options={["All Status", ...statusOptions]} />
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Date Range</span>
              <Input type="date" value={dateRange} onChange={(event) => setDateRange(event.target.value)} />
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setSearch("");
                setOrderType("All Types");
                setPriority("All Priority");
                setStatus("All Status");
                setDateRange("");
              }}
            >
              Reset Filters
            </Button>
          </div>

          {filteredOrders.length ? (
            <DataTable data={filteredOrders} columns={columns} />
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted p-6 text-center">
              <SearchX className="mb-3 h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">No LDT Orders Found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">Create your first LDT order.</p>
              <Button className="mt-4" variant="outline" size="sm" onClick={openCreateDrawer}>
                <Plus className="h-4 w-4" />
                Create LDT Order
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Drawer
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setEditingOrder(null);
        }}
        title={isEditing ? "Edit LDT Order" : "Create LDT Order"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setDrawerOpen(false)}>
              Save
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Order Type</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={draft.orderType}
                onChange={(event) => setDraft((current) => ({ ...current, orderType: event.target.value as LdtOrderType }))}
              >
                {orderTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Priority</span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={draft.priority}
                onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value as LdtOrderPriority }))}
              >
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>LDT Name</span>
              <Input value={draft.ldtName} onChange={(event) => setDraft((current) => ({ ...current, ldtName: event.target.value }))} placeholder="Enter LDT name" />
            </label>
            <label className="space-y-1 text-xs font-medium text-muted-foreground">
              <span>Order Date</span>
              <Input type="date" value={draft.orderDate} onChange={(event) => setDraft((current) => ({ ...current, orderDate: event.target.value }))} />
            </label>
          </div>         
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete LDT order"
        description={`Are you sure you want to delete ${deleteTarget?.orderNo ?? "this LDT order"}?`}
        confirmLabel="Delete"
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[] }) {
  return (
    <label className="space-y-1 text-xs font-medium text-muted-foreground">
      <span>{label}</span>
      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}