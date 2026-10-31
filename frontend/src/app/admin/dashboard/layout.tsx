import { ProtectedRoute } from "@/app/(guards)/protected-route";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { adminSidebarItems } from "@/constants/sidebar-items";

export default function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin/dashboard">) {
  return (
    <ProtectedRoute role="admin">
      <SidebarProvider>
        <AppSidebar sidebarItems={adminSidebarItems} />
        <div className="flex min-h-svh w-full flex-1 flex-col">
          <DashboardNavbar
            title="Admin dashboard"
            subtitle="Operations center"
          />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
