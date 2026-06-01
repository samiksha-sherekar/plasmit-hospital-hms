import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  metrics,
  className,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  metrics?: ReactNode;
  className?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <div className={cn("sticky top-16 z-30 -mx-4 border-b border-border bg-[#f8f9fc]/92 px-4 py-5 backdrop-blur md:-mx-6 md:px-6", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-full">
          {breadcrumbs?.length ? (
            <nav className="mb-1 flex flex-wrap items-center gap-1 text-xs font-bold text-primary" aria-label="Breadcrumb">
              {breadcrumbs.map((item, index) => (
                <span className="inline-flex items-center gap-1" key={`${item.label}-${index}`}>
                  {index > 0 ? <span className="text-muted-foreground">/</span> : null}
                  {item.href ? (
                    <Link className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/20" href={item.href}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          ) : eyebrow ? (
            <div className="mb-1 text-xs font-bold text-primary">{eyebrow}</div>
          ) : null}
          <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="mt-1.5 max-w-full break-words text-sm font-medium leading-6 text-muted-foreground lg:max-w-3xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {metrics ? <div className="mt-3">{metrics}</div> : null}
    </div>
  );
}
