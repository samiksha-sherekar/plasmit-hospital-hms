"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRole } from "@/components/providers/role-provider";
import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { role, roles, setRole } = useRole();
  const visibleItems = navigationItems.filter((item) => item.allowedRoles.includes(role));

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="lg:hidden" size="icon" variant="outline" aria-label="Open navigation">
          <Menu className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/35" />
        <Dialog.Content className="fixed left-0 top-0 z-[90] flex h-[100dvh] max-h-[100dvh] w-[min(88vw,360px)] flex-col overflow-hidden overscroll-none border-r border-border bg-sidebar text-sidebar-foreground shadow-soft outline-none">
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-3">
            <Dialog.Title className="sr-only">Plasmit Hospital navigation</Dialog.Title>
            <Dialog.Description className="sr-only">Mobile navigation</Dialog.Description>
            <Image
              src="/plasmit-sidebar-logo.webp"
              alt="Plasmit Healthcare IT Vector"
              width={210}
              height={85}
              priority
              className="h-auto w-[190px] object-contain"
            />
            <Dialog.Close asChild>
              <Button size="icon" variant="ghost" aria-label="Close navigation">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="shrink-0 border-b border-border p-3">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/55">Select role</div>
            <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
              {roles.map((item) => (
                <button
                  className={cn(
                    "h-9 shrink-0 rounded-full border border-border bg-white px-3 text-xs font-semibold text-sidebar-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25",
                    item === role && "border-transparent bg-gradient-to-r from-[#7367f0] to-[#5b8def] text-white shadow-[0_8px_18px_rgba(115,103,240,0.24)]",
                  )}
                  key={item}
                  onClick={() => setRole(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <nav className="min-h-0 flex-1 touch-pan-y scroll-pb-6 overflow-y-auto overscroll-y-none p-2 pb-6 [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.route;
              return (
                <Link
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium",
                    active ? "bg-sidebar-active text-sidebar-active-foreground" : "hover:bg-sidebar-active/10",
                  )}
                  href={item.route}
                  key={item.id}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
