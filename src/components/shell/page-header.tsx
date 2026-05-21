import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  metrics,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  metrics?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("sticky top-16 z-30 -mx-4 border-b border-border bg-[#f8f9fc]/92 px-4 py-5 backdrop-blur md:-mx-6 md:px-6", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? <div className="mb-1 text-xs font-bold text-primary">{eyebrow}</div> : null}
          <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="mt-1.5 max-w-3xl text-sm font-medium leading-6 text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {metrics ? <div className="mt-3">{metrics}</div> : null}
    </div>
  );
}
