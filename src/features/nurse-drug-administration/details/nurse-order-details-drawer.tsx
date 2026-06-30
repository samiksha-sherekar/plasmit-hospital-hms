"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AdministrationHistoryTab } from "./administration-history-tab";
import { NotesTab } from "./notes-tab";
import { OrderDetailsTab } from "./order-details-tab";
import { type NurseOrderDetailsModel } from "./types";

export function NurseOrderDetailsDrawer({ order }: { order: NurseOrderDetailsModel }) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="order-details" className="w-full">
        <TabsList className="w-full justify-start rounded-lg bg-surface-muted p-1">
          <TabsTrigger value="order-details">Order Details</TabsTrigger>
          <TabsTrigger value="administration-history">Administration History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="order-details">
          <OrderDetailsTab order={order} />
        </TabsContent>
        <TabsContent value="administration-history">
          <AdministrationHistoryTab order={order} />
        </TabsContent>
        <TabsContent value="notes">
          <NotesTab order={order} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
