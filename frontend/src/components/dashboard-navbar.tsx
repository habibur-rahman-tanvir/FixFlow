"use client";

import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/next-theme/mode-toggle";
import { FixFlowLogo } from "@/components/fixflow-logo";

export type DashboardNavbarProps = {
  title?: string;
  subtitle?: string;
};

export function DashboardNavbar({
  title = "Dashboard",
  subtitle = "Workspace overview",
}: DashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger className="h-9 w-9 rounded-md border border-border bg-background" />
        </div>

        <FixFlowLogo compact />

        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
            {subtitle}
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          <ModeToggle />

          <Link
            href="/profile"
            className="hidden items-center gap-3 rounded-full border border-border bg-card px-2 py-1.5 text-left shadow-sm transition-colors hover:bg-accent/50 sm:flex"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-blue-700 text-sm font-semibold text-white">
              A
            </div>

            <div className="pr-1">
              <p className="text-sm font-medium text-foreground">Alicia Morgan</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Admin
              </p>
            </div>

            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
