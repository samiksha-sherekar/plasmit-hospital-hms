"use client";

import { Archive, BarChart3, Boxes, ClipboardList, Factory, FileInput, FileOutput, Layers3, MapPinned, PackageCheck, PackageMinus, PackagePlus, Pill, ReceiptText, Repeat, RotateCcw, ShoppingCart, Store, Tags, Truck, Users } from "lucide-react";

import { PharmacyWorkflowPage } from "@/features/pharmacy-workflows/pharmacy-workflow-page";

export const ManufacturerMasterPage = () => <PharmacyWorkflowPage title="Manufacturer Master" breadcrumb="Home / Masters / " workflow="manufacturer-master" icon={Factory} />;
export const UnitMasterPage = () => <PharmacyWorkflowPage title="Unit Master" breadcrumb="Home / Masters / " workflow="unit-master" icon={Layers3} />;
export const RackStoreLocationPage = () => <PharmacyWorkflowPage title="Rack / Store Location" breadcrumb="Home / Masters / " workflow="rack-store-location" icon={MapPinned} />;

export const CurrentStockPage = () => <PharmacyWorkflowPage title="Current Stock" breadcrumb="Home / Inventory / " workflow="current-stock" icon={Store} />;
export const BatchStockPage = () => <PharmacyWorkflowPage title="Batch Stock" breadcrumb="Home / Inventory / " workflow="batch-stock" icon={Boxes} />;
export const ExpiryTrackingPage = () => <PharmacyWorkflowPage title="Expiry Tracking" breadcrumb="Home / Inventory / " workflow="expiry-tracking" icon={Archive} />;
export const StockAdjustmentPage = () => <PharmacyWorkflowPage title="Stock Adjustment" breadcrumb="Home / Inventory / " workflow="stock-adjustment" icon={PackageMinus} />;
export const StockTransferPage = () => <PharmacyWorkflowPage title="Stock Transfer" breadcrumb="Home / Inventory / " workflow="stock-transfer" icon={Repeat} />;

export const PurchaseRequisitionPage = () => <PharmacyWorkflowPage title="Purchase Requisition" breadcrumb="Home / Purchase / " workflow="purchase-requisition" icon={ClipboardList} />;
export const PurchaseOrderPage = () => <PharmacyWorkflowPage title="Purchase Order" breadcrumb="Home / Purchase / " workflow="purchase-order" icon={ShoppingCart} />;
export const GrnWorkflowPage = () => <PharmacyWorkflowPage title="Goods Receipt Note (GRN)" breadcrumb="Home / Purchase / " workflow="goods-receipt-note" icon={PackageCheck} />;
export const PurchaseReturnPage = () => <PharmacyWorkflowPage title="Purchase Return" breadcrumb="Home / Purchase / " workflow="purchase-return" icon={RotateCcw} />;

export const IpdDrugOrdersPage = () => <PharmacyWorkflowPage title="IPD Drug Orders" breadcrumb="Home / Dispensing / " workflow="ipd-drug-orders" icon={FileInput} />;
export const OpdPrescriptionPage = () => <PharmacyWorkflowPage title="OPD Prescription" breadcrumb="Home / Dispensing / " workflow="opd-prescription" icon={Pill} />;
export const DispenseQueuePage = () => <PharmacyWorkflowPage title="Dispense Queue" breadcrumb="Home / Dispensing / " workflow="dispense-queue" icon={PackagePlus} />;
export const ReturnsPage = () => <PharmacyWorkflowPage title="Returns" breadcrumb="Home / Dispensing / " workflow="returns" icon={FileOutput} />;

export const SupplierListPage = () => <PharmacyWorkflowPage title="Supplier List" breadcrumb="Home / Suppliers / " workflow="supplier-list" icon={Truck} />;
export const SupplierPerformancePage = () => <PharmacyWorkflowPage title="Supplier Performance" breadcrumb="Home / Suppliers / " workflow="supplier-performance" icon={Users} />;

export const LowStockReportPage = () => <PharmacyWorkflowPage title="Low Stock" breadcrumb="Home / Reports / " workflow="low-stock-report" icon={Tags} />;
export const ExpiringStockReportPage = () => <PharmacyWorkflowPage title="Expiring Stock" breadcrumb="Home / Reports / " workflow="expiring-stock-report" icon={Archive} />;
export const PurchaseReportPage = () => <PharmacyWorkflowPage title="Purchase Report" breadcrumb="Home / Reports / " workflow="purchase-report" icon={ReceiptText} />;
export const DispenseReportPage = () => <PharmacyWorkflowPage title="Dispense Report" breadcrumb="Home / Reports / " workflow="dispense-report" icon={BarChart3} />;
export const ConsumptionReportPage = () => <PharmacyWorkflowPage title="Consumption Report" breadcrumb="Home / Reports / " workflow="consumption-report" icon={BarChart3} />;
