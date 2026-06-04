"use client";

import { Archive, BarChart3, Boxes, ClipboardList, Factory, FileInput, FileOutput, Layers3, MapPinned, PackageCheck, PackageMinus, PackagePlus, Pill, ReceiptText, Repeat, RotateCcw, ShoppingCart, Store, Tags, Truck, Users } from "lucide-react";

import { PharmacyWorkflowPage } from "@/features/pharmacy-workflows/pharmacy-workflow-page";

export const ManufacturerMasterPage = () => <PharmacyWorkflowPage title="Manufacturer Master" workflow="manufacturer-master" icon={Factory} />;
export const UnitMasterPage = () => <PharmacyWorkflowPage title="Unit Master" workflow="unit-master" icon={Layers3} />;
export const RackStoreLocationPage = () => <PharmacyWorkflowPage title="Rack / Store Location" workflow="rack-store-location" icon={MapPinned} />;

export const CurrentStockPage = () => <PharmacyWorkflowPage title="Current Stock" workflow="current-stock" icon={Store} />;
export const BatchStockPage = () => <PharmacyWorkflowPage title="Batch Stock" workflow="batch-stock" icon={Boxes} />;
export const ExpiryTrackingPage = () => <PharmacyWorkflowPage title="Expiry Tracking" workflow="expiry-tracking" icon={Archive} />;
export const StockAdjustmentPage = () => <PharmacyWorkflowPage title="Stock Adjustment" workflow="stock-adjustment" icon={PackageMinus} />;
export const StockTransferPage = () => <PharmacyWorkflowPage title="Stock Transfer" workflow="stock-transfer" icon={Repeat} />;

export const PurchaseRequisitionPage = () => <PharmacyWorkflowPage title="Purchase Requisition" workflow="purchase-requisition" icon={ClipboardList} />;
export const PurchaseOrderPage = () => <PharmacyWorkflowPage title="Purchase Order" workflow="purchase-order" icon={ShoppingCart} />;
export const GrnWorkflowPage = () => <PharmacyWorkflowPage title="Goods Receipt Note (GRN)" workflow="goods-receipt-note" icon={PackageCheck} />;
export const PurchaseReturnPage = () => <PharmacyWorkflowPage title="Purchase Return" workflow="purchase-return" icon={RotateCcw} />;

export const IpdDrugOrdersPage = () => <PharmacyWorkflowPage title="IPD Drug Orders" workflow="ipd-drug-orders" icon={FileInput} />;
export const OpdPrescriptionPage = () => <PharmacyWorkflowPage title="OPD Prescription" workflow="opd-prescription" icon={Pill} />;
export const DispenseQueuePage = () => <PharmacyWorkflowPage title="Dispense Queue" workflow="dispense-queue" icon={PackagePlus} />;
export const ReturnsPage = () => <PharmacyWorkflowPage title="Returns" workflow="returns" icon={FileOutput} />;

export const SupplierListPage = () => <PharmacyWorkflowPage title="Supplier List" workflow="supplier-list" icon={Truck} />;
export const SupplierPerformancePage = () => <PharmacyWorkflowPage title="Supplier Performance" workflow="supplier-performance" icon={Users} />;

export const LowStockReportPage = () => <PharmacyWorkflowPage title="Low Stock" workflow="low-stock-report" icon={Tags} />;
export const ExpiringStockReportPage = () => <PharmacyWorkflowPage title="Expiring Stock" workflow="expiring-stock-report" icon={Archive} />;
export const PurchaseReportPage = () => <PharmacyWorkflowPage title="Purchase Report" workflow="purchase-report" icon={ReceiptText} />;
export const DispenseReportPage = () => <PharmacyWorkflowPage title="Dispense Report" workflow="dispense-report" icon={BarChart3} />;
export const ConsumptionReportPage = () => <PharmacyWorkflowPage title="Consumption Report" workflow="consumption-report" icon={BarChart3} />;
