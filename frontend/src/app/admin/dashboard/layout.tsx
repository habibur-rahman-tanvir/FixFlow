import { ProtectedRoute } from "@/app/(guards)/protected-route";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { adminSidebarItems } from "@/constants/sidebar-items";

export default function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin/dashboard">) {
  return (
    <ProtectedRoute role="admin">
      <SidebarProvider>
        <AppSidebar sidebarItems={adminSidebarItems} />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
