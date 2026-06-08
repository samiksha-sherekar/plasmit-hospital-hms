"use client";

import * as React from "react";
import { Edit2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { PatientSummaryBanner } from "./shared/patient-summary-banner";

type RequestStatus = "Requested" | "In Progress" | "Completed";
type RequestPriority = "Routine" | "Urgent" | "STAT";
type RequestItem = {
  id: string;
  requestType: string;
  requestTitle: string;
  description: string;
  priority: RequestPriority;
  requiredByDateTime: string;
  assignedToDepartment: string;
  remarks: string;
  status: RequestStatus;
};

const requestTypes = ["Nursing", "Diet", "Physiotherapy", "Discharge", "Equipment", "Other"];
const departments = ["Nursing", "Diet", "Physiotherapy", "OT", "Maintenance", "Ward"];
const initialItems: RequestItem[] = [
  { id: "req-1", requestType: "Nursing", requestTitle: "Vital sign check", description: "Patient needs repeat vitals", priority: "Routine", requiredByDateTime: "2026-06-08T10:30", assignedToDepartment: "Nursing", remarks: "Before rounds", status: "Requested" },
  { id: "req-2", requestType: "Physiotherapy", requestTitle: "Mobility review", description: "Post-op ambulation support", priority: "Urgent", requiredByDateTime: "2026-06-08T12:00", assignedToDepartment: "Physiotherapy", remarks: "", status: "In Progress" },
];

function confirmDelete(message: string) {
  return window.confirm(message);
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const tone = status === "Completed" ? "success" : status === "In Progress" ? "warning" : "default";
  return <Badge tone={tone}>{status}</Badge>;
}

export function RequestsTab() {
  const [activeTab, setActiveTab] = React.useState<"test-order" | "order-summary">("test-order");
  const [items, setItems] = React.useState(initialItems);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [draft, setDraft] = React.useState<RequestItem>({
    id: "",
    requestType: "Nursing",
    requestTitle: "",
    description: "",
    priority: "Routine",
    requiredByDateTime: "",
    assignedToDepartment: "Nursing",
    remarks: "",
    status: "Requested",
  });

  const filtered = items.filter((item) => `${item.requestTitle} ${item.requestType} ${item.status}`.toLowerCase().includes(search.trim().toLowerCase()));

  const save = () => {
    if (!draft.requestTitle.trim()) return toast.error("Request Title is required");
    if (editingId) {
      setItems((current) => current.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item)));
      toast.success("Request updated");
    } else {
      setItems((current) => [{ ...draft, id: `req-${Date.now()}` }, ...current]);
      toast.success("Request saved");
    }
    setEditingId(null);
    setDraft({ ...draft, id: "", requestTitle: "", description: "", requiredByDateTime: "", remarks: "" });
  };

  const edit = (id: string) => {
    const item = items.find((row) => row.id === id);
    if (!item) return;
    setEditingId(id);
    setDraft(item);
    setActiveTab("test-order");
  };

  const remove = (id: string) => {
    if (!confirmDelete("Delete this request?")) return;
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Request deleted");
  };

  return (
    <div className="space-y-4">
      <PatientSummaryBanner />
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>Doctor general requests for nursing, diet, physiotherapy, discharge, and equipment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["test-order", "order-summary"] as const).map((tab) => (
              <Button key={tab} size="sm" variant={activeTab === tab ? "default" : "outline"} onClick={() => setActiveTab(tab)}>
                {tab === "test-order" ? "Test Order" : tab === "order-summary" ? "Order Summary" : "Result / Status Review"}
              </Button>
            ))}
          </div>

          {activeTab === "test-order" ? (
            <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><div className="text-xs font-medium text-muted-foreground">Request Type</div><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={draft.requestType} onChange={(e) => setDraft((d) => ({ ...d, requestType: e.target.value }))}>{requestTypes.map((t) => <option key={t}>{t}</option>)}</select></label>
                <label className="space-y-2"><div className="text-xs font-medium text-muted-foreground">Request Title</div><Input value={draft.requestTitle} onChange={(e) => setDraft((d) => ({ ...d, requestTitle: e.target.value }))} /></label>
                <label className="space-y-2"><div className="text-xs font-medium text-muted-foreground">Priority</div><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={draft.priority} onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as RequestPriority }))}><option>Routine</option><option>Urgent</option><option>STAT</option></select></label>
                <label className="space-y-2"><div className="text-xs font-medium text-muted-foreground">Required By Date & Time</div><Input type="datetime-local" value={draft.requiredByDateTime} onChange={(e) => setDraft((d) => ({ ...d, requiredByDateTime: e.target.value }))} /></label>
                <label className="space-y-2"><div className="text-xs font-medium text-muted-foreground">Assigned To Department</div><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={draft.assignedToDepartment} onChange={(e) => setDraft((d) => ({ ...d, assignedToDepartment: e.target.value }))}>{departments.map((d) => <option key={d}>{d}</option>)}</select></label>
                <label className="space-y-2 md:col-span-2"><div className="text-xs font-medium text-muted-foreground">Description</div><textarea className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} /></label>
                <label className="space-y-2 md:col-span-2"><div className="text-xs font-medium text-muted-foreground">Remarks</div><textarea className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none" value={draft.remarks} onChange={(e) => setDraft((d) => ({ ...d, remarks: e.target.value }))} /></label>
              </div>
              <div className="space-y-3 rounded-xl border border-border bg-surface-muted p-4">
                <div className="text-sm font-semibold text-foreground">Request Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="rounded-md border border-border bg-white p-3">Title: <span className="font-semibold">{draft.requestTitle || "-"}</span></div>
                  <div className="rounded-md border border-border bg-white p-3">Type: <span className="font-semibold">{draft.requestType}</span></div>
                  <div className="rounded-md border border-border bg-white p-3">Priority: <span className="font-semibold">{draft.priority}</span></div>
                  <div className="rounded-md border border-border bg-white p-3">Status: <span className="font-semibold">{draft.status}</span></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="flex-1" onClick={save}><Save className="h-4 w-4" />Submit Order</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setActiveTab("order-summary")}>View Summary</Button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "order-summary" ? (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div key={item.id} className="grid gap-3 rounded-xl border border-border bg-surface p-4 md:grid-cols-[minmax(0,1fr)_120px_120px_auto] md:items-center">
                  <div><div className="font-semibold text-foreground">{item.requestTitle}</div><div className="text-xs text-muted-foreground">{item.description}</div></div>
                  <StatusBadge status={item.status} />
                  <Badge tone={item.priority === "STAT" ? "danger" : item.priority === "Urgent" ? "warning" : "success"}>{item.priority}</Badge>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => edit(item.id)}><Edit2 className="h-4 w-4" />Edit</Button>
                    <Button size="sm" variant="outline" className="text-danger" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" />Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

        </CardContent>
      </Card>
    </div>
  );
}
