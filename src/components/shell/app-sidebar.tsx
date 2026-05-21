"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/components/providers/role-provider";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const { role } = useRole();
  const visibleItems = navigationItems.filter((item) => item.allowedRoles.includes(role));
  const groups = Array.from(new Set(visibleItems.map((item) => item.group)));

  return (
    <aside
      className={cn(
        "hidden h-dvh shrink-0 border-r border-border bg-white text-sidebar-foreground shadow-[8px_0_28px_rgba(39,37,54,0.04)] transition-all lg:sticky lg:top-0 lg:z-50 lg:flex lg:flex-col",
        collapsed ? "w-[72px]" : "w-[264px]",
      )}
    >
      <div className={cn("flex h-20 items-center border-b border-border px-3", collapsed ? "justify-center" : "justify-start")}>
        {collapsed ? (
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <Image
              src="/plasmit-sidebar-logo.webp"
              alt="Plasmit Healthcare IT Vector"
              width={110}
              height={44}
              priority
              className="h-9 w-[90px] max-w-none -translate-x-1 object-contain object-left"
            />
          </div>
        ) : (
          <Image
            src="/plasmit-sidebar-logo.webp"
            alt="Plasmit Healthcare IT Vector"
            width={220}
            height={89}
            priority
            className="h-auto w-[220px] object-contain"
          />
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 py-4">
        {groups.map((group) => (
          <div className="mb-4" key={group}>
            {!collapsed ? <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground/55">{group}</div> : null}
            <div className="space-y-1">
              {visibleItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.route || (item.route !== "/dashboard" && pathname.startsWith(item.route));
                  return (
                    <Link
                      aria-label={collapsed ? item.label : undefined}
                      className={cn(
                        "group flex h-10 items-center gap-3 rounded-lg px-2.5 text-sm font-semibold outline-none transition hover:bg-primary-soft hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/25",
                        active && "bg-gradient-to-r from-[#7367f0] to-[#5b8def] text-sidebar-active-foreground shadow-[0_8px_20px_rgba(115,103,240,0.24)] hover:text-white",
                        collapsed && "justify-center",
                      )}
                      href={item.route}
                      key={item.id}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
                      {!collapsed && item.status === "planned" ? <Badge tone="muted">Plan</Badge> : null}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2.5">
        <Button
          className={cn("w-full", collapsed && "px-0")}
          onClick={() => onCollapsedChange(!collapsed)}
          variant="ghost"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed ? "Collapse" : null}
        </Button>
      </div>
    </aside>
  );
}
