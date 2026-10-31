import { ProtectedRoute } from "@/app/(guards)/protected-route";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { managerSidebarItems } from "@/constants/sidebar-items";
import type { ReactNode } from "react";

export default function ManagerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar sidebarItems={managerSidebarItems} />
        <div className="flex min-h-svh w-full flex-1 flex-col">
          <DashboardNavbar
            title="Manager dashboard"
            subtitle="Field operations"
          />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
