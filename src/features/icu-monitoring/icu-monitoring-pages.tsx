"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Brain, ClipboardList, Droplets, Gauge, HeartPulse, Plus, Save, Stethoscope, TrendingUp, Waves } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyActionBar } from "@/features/admin/admin-shared";
import {
  cvsInsights,
  cvsMetrics,
  cvsParameterCards,
  cvsRecords,
  cvsTrendData,
  icuModules,
  trendOptions,
  type CvsMetric,
  type CvsParameterId,
  type CvsRecord,
  type CvsStatus,
} from "@/data/icu-monitoring";
import { cn } from "@/lib/utils";

const moduleIcons = [HeartPulse, Stethoscope, Gauge, Waves, Droplets, Brain, ClipboardList];

function PageMotion({ children }: { children: React.ReactNode }) {
  return <motion.div animate={{ opacity: 1, y: 0 }} className="space-y-4" initial={{ opacity: 0, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }}>{children}</motion.div>;
}

function BackButton({ href = "/icu-monitoring/cvs" }: { href?: string }) {
  return <Button asChild variant="outline"><Link href={href}><ArrowLeft className="h-4 w-4" />Back</Link></Button>;
}

function CvsTabs() {
  return (
    <Tabs defaultValue="cvs">
      <TabsList className="bg-white shadow-sm">
        {icuModules.map((module) => (
          <TabsTrigger asChild key={module.label} value={module.label.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}>
            <Link href={module.route}>{module.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function statusTone(status: CvsStatus) {
  return status === "Stable" ? "success" : status === "Watch" ? "warning" : "critical";
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * 96;
    const y = 34 - ((value - min) / Math.max(max - min, 1)) * 28;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg aria-hidden className="h-10 w-28" viewBox="0 0 96 38">
      <polyline fill="none" points={points} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

function ClientChart({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="space-y-3 p-2">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton className="h-3" key={index} />)}
        </div>
      </div>
    );
  }
  return children;
}

function MetricCard({ metric }: { metric: CvsMetric }) {
  const Icon = metric.icon;
  return (
    <Link href={`/icu-monitoring/cvs/${metric.id}`} className="group block">
      <Card className="transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(39,37,54,0.10)]">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{metric.label}</div>
                <div className="text-xs text-muted-foreground">Updated {metric.updatedAt}</div>
              </div>
            </div>
            <Badge tone={statusTone(metric.status)}>{metric.status}</Badge>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{metric.value}</span>
                <span className="text-sm font-medium text-muted-foreground">{metric.unit}</span>
              </div>
              {metric.detail ? <div className="mt-1 text-xs font-semibold text-muted-foreground">{metric.detail}</div> : null}
            </div>
            <Sparkline color={metric.color} values={metric.sparkline} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function HeaderBand({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">ICU bedside monitoring</div>
        <h1 className="mt-1 text-2xl font-bold text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function IcuMonitoringPage() {
  return (
    <PageMotion>
      <HeaderBand title="ICU Monitoring" subtitle="Bedside clinical observations grouped by organ system with CVS monitoring ready for entry, trends, and review." actions={<Button asChild><Link href="/icu-monitoring/cvs">Open CVS</Link></Button>} />
      <CvsTabs />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {icuModules.map((module, index) => {
          const Icon = moduleIcons[index] ?? ClipboardList;
          return (
            <Card className="transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(39,37,54,0.08)]" key={module.label}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
                  <Badge tone={module.ready ? "success" : "muted"}>{module.ready ? "Ready" : "Placeholder"}</Badge>
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">{module.label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{module.ready ? "Cardiovascular observations, invasive pressures, trends, and records." : "Clean placeholder for next ICU monitoring phase."}</div>
                </div>
                <Button asChild className="w-full" variant={module.ready ? "default" : "outline"}><Link href={module.route}>{module.ready ? "Open module" : "Preview placeholder"}</Link></Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageMotion>
  );
}

export function CvsDashboardPage() {
  return (
    <PageMotion>
      <HeaderBand
        title="CVS Monitoring"
        subtitle="Live cardiovascular bedside snapshot for ICU review with compact entry pathways and trend context."
        actions={<><Button asChild><Link href="/icu-monitoring/cvs/add"><Plus className="h-4 w-4" />Add CVS Entry</Link></Button><Button asChild variant="outline"><Link href="/icu-monitoring/cvs/trends">View Trends</Link></Button><Button asChild variant="outline"><Link href="/icu-monitoring/cvs/records">View All Records</Link></Button></>}
      />
      <CvsTabs />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{cvsMetrics.map((metric) => <MetricCard key={metric.id} metric={metric} />)}</div>
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader><div><CardTitle>Bedside trend preview</CardTitle><CardDescription>Last seven cardiovascular readings</CardDescription></div><Button asChild size="sm" variant="outline"><Link href="/icu-monitoring/cvs/trends"><TrendingUp className="h-4 w-4" />Open trends</Link></Button></CardHeader>
          <CardContent className="h-64">
            <ClientChart>
              <ResponsiveContainer height="100%" width="100%">
                <LineChart data={cvsTrendData}><CartesianGrid stroke="#eceaf2" /><XAxis dataKey="time" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line dataKey="hr" dot={false} stroke="#7367f0" strokeWidth={3} /><Line dataKey="nibpMap" dot={false} stroke="#22a06b" strokeWidth={3} /><Line dataKey="arterialMap" dot={false} stroke="#5b8def" strokeWidth={3} /></LineChart>
              </ResponsiveContainer>
            </ClientChart>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-gradient-to-br from-white to-[#f5f7ff]">
          <CardHeader><div><CardTitle>Clinical Insight</CardTitle><CardDescription>Static decision-support preview</CardDescription></div></CardHeader>
          <CardContent className="space-y-3">
            {cvsInsights.map((insight) => <div className="rounded-xl border border-border bg-white p-3 text-sm font-medium text-foreground shadow-sm" key={insight}>{insight}</div>)}
          </CardContent>
        </Card>
      </div>
    </PageMotion>
  );
}

export function CvsAddPage() {
  return (
    <PageMotion>
      <HeaderBand title="Add CVS Entry" subtitle="Choose the cardiovascular parameter to document for this ICU bedside record." actions={<BackButton />} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cvsParameterCards.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.route} key={item.id} className="group block">
              <Card className="transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(39,37,54,0.10)]">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground">{item.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageMotion>
  );
}

const formFields: Record<CvsParameterId, { title: string; fields: string[] }> = {
  "heart-rate": { title: "Heart Rate", fields: ["Date & Time", "Heart Rate bpm", "Rhythm", "Source", "Notes"] },
  temperature: { title: "Temperature", fields: ["Date & Time", "Temperature C", "Source", "Site", "Notes"] },
  "bp-nibp": { title: "Blood Pressure - NIBP", fields: ["Date & Time", "SBP", "DBP", "MAP", "Position", "Arm", "Cuff Size", "Source", "Notes"] },
  "bp-arterial": { title: "Blood Pressure - Arterial Line", fields: ["Date & Time", "SBP", "DBP", "MAP", "Arterial Line Site", "Waveform", "Source", "Transducer Zeroed", "Notes"] },
  cvp: { title: "CVP", fields: ["Date & Time", "CVP mmHg", "Patient Position", "Transducer Zeroed", "Waveform", "Notes"] },
  pcwp: { title: "PCWP", fields: ["Date & Time", "PCWP mmHg", "Patient Position", "Waveform", "Notes"] },
};

export function CvsParameterFormPage({ parameter }: { parameter: CvsParameterId }) {
  const router = useRouter();
  const config = formFields[parameter];
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const required = config.fields.filter((field) => !field.includes("Notes"));
  const missing = required.filter((field) => !values[field]?.trim());
  return (
    <PageMotion>
      <HeaderBand title={config.title} subtitle="Structured ICU bedside entry with validation, draft state, and audit-friendly save action." actions={<BackButton href="/icu-monitoring/cvs/add" />} />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardContent className="grid gap-3 p-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <label className={cn("space-y-1 text-sm", field === "Notes" && "md:col-span-2")} key={field}>
                <span className="font-medium text-foreground">{field}</span>
                <Input
                  className={submitted && !field.includes("Notes") && !values[field]?.trim() ? "border-danger" : undefined}
                  onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))}
                  placeholder={field === "Date & Time" ? "Today 18:00" : field}
                  value={values[field] ?? ""}
                />
              </label>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Autosave draft</CardTitle><CardDescription>Static preview</CardDescription></div></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border border-info/20 bg-info/10 p-3 text-info">Draft prepared locally. Final save writes to mock workflow only.</div>
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            {submitted && missing.length ? <div className="rounded-xl border border-danger/20 bg-danger/10 p-3 text-danger">{missing.length} required fields need values.</div> : null}
          </CardContent>
        </Card>
      </div>
      <StickyActionBar
        onReset={() => setValues({})}
        onSave={() => {
          setSubmitted(true);
          if (missing.length) {
            toast.error("Complete required CVS fields before saving");
            return;
          }
          toast.success(`${config.title} saved to CVS monitoring`);
          router.push("/icu-monitoring/cvs/records");
        }}
        saveLabel="Save CVS entry"
      />
    </PageMotion>
  );
}

export function CvsTrendsPage() {
  const [selected, setSelected] = React.useState<(typeof trendOptions)[number]>(trendOptions[0]);
  const columns = React.useMemo<ColumnDef<(typeof cvsTrendData)[number]>[]>(() => [
    { header: "Time", accessorKey: "time" },
    { header: selected.label, cell: ({ row }) => `${row.original[selected.key]} ${selected.unit}` },
  ], [selected]);
  return (
    <PageMotion>
      <HeaderBand title="CVS Trends" subtitle="Parameter-specific line charts with bedside data table for ICU review." actions={<BackButton />} />
      <Tabs value={selected.id} onValueChange={(value) => setSelected(trendOptions.find((item) => item.id === value) ?? trendOptions[0])}>
        <TabsList>{trendOptions.map((item) => <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>)}</TabsList>
        <TabsContent value={selected.id}>
          <Card>
            <CardContent className="h-72 p-4">
              <ClientChart>
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={cvsTrendData}><CartesianGrid stroke="#eceaf2" /><XAxis dataKey="time" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line dataKey={selected.key} dot={{ r: 3 }} stroke={selected.color} strokeWidth={3} /></LineChart>
                </ResponsiveContainer>
              </ClientChart>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <DataTable data={cvsTrendData} columns={columns} />
    </PageMotion>
  );
}

export function CvsRecordsPage() {
  const columns = React.useMemo<ColumnDef<CvsRecord>[]>(() => [
    { header: "Date & Time", accessorKey: "dateTime" },
    { header: "HR", cell: ({ row }) => `${row.original.hr} bpm` },
    { header: "Temperature", cell: ({ row }) => `${row.original.temperature} C` },
    { header: "BP NIBP SBP/DBP/MAP", accessorKey: "nibp" },
    { header: "BP Arterial SBP/DBP/MAP", accessorKey: "arterial" },
    { header: "CVP", cell: ({ row }) => `${row.original.cvp} mmHg` },
    { header: "PCWP", cell: ({ row }) => `${row.original.pcwp} mmHg` },
    { header: "Notes", accessorKey: "notes" },
  ], []);
  return (
    <PageMotion>
      <HeaderBand title="CVS Records" subtitle="Complete mock cardiovascular monitoring table for ICU bedside review." actions={<><BackButton /><Button asChild><Link href="/icu-monitoring/cvs/add"><Plus className="h-4 w-4" />Add Entry</Link></Button></>} />
      <DataTable data={cvsRecords} columns={columns} />
    </PageMotion>
  );
}

export function CvsPlaceholderPage({ title }: { title: string }) {
  return (
    <PageMotion>
      <HeaderBand title={title} subtitle="This ICU module is reserved for the next monitoring workflow." actions={<BackButton href="/icu-monitoring" />} />
      <EmptyState icon={ClipboardList} title={`${title} placeholder`} description="CVS is fully implemented first. This card keeps the ICU navigation ready for future clinical documentation." />
    </PageMotion>
  );
}
