import Link from "next/link";
import type { ReactNode } from "react";
import {
  BedDouble,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  HeartPulse,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { admissionScreenMap, admissionScreens, admissionWorkflowCards } from "@/features/admission/data/admission-data";
import type { AdmissionScreenId } from "@/features/admission/types";
import { cn } from "@/lib/utils";

const iconMap: Record<AdmissionScreenId, LucideIcon> = {
  admin: ShieldCheck,
  reception: Search,
  doctor: Stethoscope,
  "admission-desk": ClipboardCheck,
  billing: CreditCard,
  "bed-manager": BedDouble,
  "nurse-receive": UserCheck,
  "nurse-care": HeartPulse,
};

const roleTabs: Array<{ label: string; route: string; activeIds: AdmissionScreenId[] }> = [
  { label: "Reception", route: "/admission/reception", activeIds: ["reception"] },
  { label: "Doctor", route: "/admission/doctor", activeIds: ["doctor"] },
  { label: "Admission Desk", route: "/admission/admission-desk", activeIds: ["admission-desk"] },
  { label: "Bed Manager", route: "/admission/bed-manager", activeIds: ["bed-manager"] },
  { label: "Nurse", route: "/admission/nurse-receive", activeIds: ["nurse-receive", "nurse-care"] },
  { label: "Billing", route: "/admission/billing", activeIds: ["billing"] },
  { label: "Admin", route: "/admission", activeIds: ["admin"] },
];

function stepRoute(label: string) {
  const title = label.replace(/^\d+\.\s*/, "");
  return admissionWorkflowCards.find((card) => card.title === title)?.route;
}

export function AdmissionScreenLayout({
  activeScreen,
  activeStep,
  children,
}: {
  activeScreen: AdmissionScreenId;
  activeStep?: string;
  children: ReactNode;
}) {
  const screen = admissionScreenMap[activeScreen];
  const Icon = iconMap[activeScreen];
  const stepValue = activeStep ?? screen.steps[0];

  return (
    <>
      <div className="space-y-4 py-4">
        <Card>
          <CardContent className="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">Frontend role preview</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{screen.role}</div>
              <div className="text-xs text-muted-foreground">{screen.roleSummary}</div>
            </div>
            <div className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
              {roleTabs.map((tab) => {
                const active = tab.activeIds.includes(activeScreen);
                return (
                  <Button asChild className="shrink-0" key={tab.label} size="sm" variant={active ? "default" : "outline"}>
                    <Link href={tab.route}>{tab.label}</Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border border-border bg-surface-muted/70 p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-info/25 bg-info/10 text-info">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-foreground">{screen.workspaceTitle}</h2>
                <p className="mt-1 max-w-full break-words text-sm text-muted-foreground lg:max-w-4xl">{screen.workspaceDescription}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-1.5 sm:gap-2">
              {screen.chips.map((chip) => (
                <Badge key={chip} tone="info">
                  {chip}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {screen.steps.map((step) => {
              const route = stepRoute(step);
              const active = step === stepValue;
              const className = cn("min-h-8 shrink-0", active && "shadow-sm");
              return route ? (
                <Button asChild key={step} size="sm" variant={active ? "default" : "outline"} className={className}>
                  <Link href={route}>
                    <ClipboardList className="h-4 w-4" />
                    {step}
                  </Link>
                </Button>
              ) : (
                <Button key={step} size="sm" variant={active ? "default" : "outline"} className={className}>
                  <ClipboardList className="h-4 w-4" />
                  {step}
                </Button>
              );
            })}
          </div>
        </div>

        {children}
      </div>
    </>
  );
}

export function AdmissionQuickLinks({ activeScreen }: { activeScreen: AdmissionScreenId }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {admissionScreens
        .filter((screen) => screen.id !== activeScreen)
        .slice(0, 4)
        .map((screen) => (
          <Link
            className="rounded-lg border border-border bg-surface p-3 text-sm transition hover:border-primary/40 hover:bg-surface-muted"
            href={screen.route}
            key={screen.id}
          >
            <div className="font-semibold text-foreground">{screen.role}</div>
            <div className="mt-1 text-xs text-muted-foreground">{screen.roleSummary}</div>
          </Link>
        ))}
    </div>
  );
}
