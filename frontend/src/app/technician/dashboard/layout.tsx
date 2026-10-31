import { ProtectedRoute } from "@/app/(guards)/protected-route";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { technicianSidebarItems } from "@/constants/sidebar-items";
import type { ReactNode } from "react";

export default function TechnicianDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar sidebarItems={technicianSidebarItems} />
        <div className="flex min-h-svh w-full flex-1 flex-col">
          <DashboardNavbar
            title="Technician dashboard"
            subtitle="Service queue"
          />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
