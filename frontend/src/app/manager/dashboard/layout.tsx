import { ProtectedRoute } from "@/app/(guards)/protected-route";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { ManagerSidebar } from "./_components/manager-sidebar";

export default function ManagerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <ManagerSidebar />
        <div className="flex min-h-svh w-full flex-1 flex-col">
          <DashboardNavbar
            title="Manager dashboard"
            subtitle="Field operations"
          />
          {/* <main className="flex-1 p-4 sm:p-6">{children}</main> */}
          <main className="flex-1">{children}</main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
