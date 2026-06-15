"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

type BreadcrumbItem = { label: string; href?: string };

function formatSegment(segment: string) {
  return decodeURIComponent(segment)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildBreadcrumbs(pathname: string, title: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const visibleSegments = segments.length > 1 ? segments.slice(1) : segments;

  return visibleSegments.map((segment, index) => {
    const realIndex = segments.length > 1 ? index + 1 : index;
    const href = `/${segments.slice(0, realIndex + 1).join("/")}`;
    const navItem = navigationItems.find((item) => item.route === href || item.children?.some((child) => child.route === href));
    const childItem = navigationItems.flatMap((item) => item.children ?? []).find((child) => child.route === href);
    const isLast = index === visibleSegments.length - 1;

    return {
      href: isLast ? undefined : href,
      label: isLast ? title : childItem?.label ?? navItem?.label ?? formatSegment(segment),
    };
  });
}

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
  breadcrumbs?: BreadcrumbItem[];
}) {
  const pathname = usePathname();
  const resolvedBreadcrumbs = breadcrumbs?.length ? breadcrumbs : buildBreadcrumbs(pathname, title);

  const breadcrumbNav = (
    <nav className="flex min-w-0 flex-wrap items-center justify-start gap-1 text-xs font-semibold text-muted-foreground lg:justify-end" aria-label="Breadcrumb">
      <Link className="inline-flex items-center gap-1 rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/20" href="/dashboard">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {resolvedBreadcrumbs.map((item, index) => {
        const isLast = index === resolvedBreadcrumbs.length - 1;

        return (
          <span className="inline-flex min-w-0 items-center gap-1" key={`${item.label}-${index}`}>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {item.href && !isLast ? (
              <Link className="truncate rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/20" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="truncate font-bold text-primary" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );

  return (
    <div className={cn("-mx-4 border-b border-border bg-[#f8f9fc]/92 px-4 py-3 md:-mx-6 md:px-6", className)}>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-full pt-0.5">
          {eyebrow ? <div className="mb-1 text-xs font-bold text-primary">{eyebrow}</div> : null}
          <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="mt-1.5 max-w-full break-words text-sm font-medium leading-6 text-muted-foreground lg:max-w-3xl">{description}</p> : null}
        </div>
        <div className="flex min-w-0 shrink-0 flex-col gap-2 lg:max-w-[48%] lg:items-end">
          {breadcrumbNav}
          {actions ? <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div> : null}
        </div>
      </div>
      {metrics ? <div className="mt-3">{metrics}</div> : null}
    </div>
  );
}
