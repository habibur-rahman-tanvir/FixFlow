"use client";

import { FixFlowLogo } from "@/components/fixflow-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Building2,
  ChartNoAxesCombined,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Ticket,
  Users,
  History,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ManagerSidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const managerSidebarItems: ManagerSidebarItem[] = [
  {
    title: "Overview",
    url: "/manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Issues",
    url: "/manager/dashboard/issues",
    icon: Ticket,
  },
  {
    title: "Service Requests",
    url: "/manager/dashboard/service-requests",
    icon: Ticket,
  },
  {
    title: "Members",
    url: "/manager/dashboard/members",
    icon: Users,
  },
  {
    title: "Technicians",
    url: "/manager/dashboard/technicians",
    icon: Wrench,
  },
  {
    title: "Organization",
    url: "/manager/dashboard/organization",
    icon: Building2,
  },
  {
    title: "Reports & Analytics",
    url: "/manager/dashboard/reports",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Activity Logs",
    url: "/manager/dashboard/activity-logs",
    icon: History,
  },
  {
    title: "Settings",
    url: "/manager/dashboard/settings",
    icon: Settings,
  },
];

export const ManagerSidebar = () => {
  const pathname = usePathname();

  const activeItemUrl = managerSidebarItems.reduce<string | null>(
    (currentActiveUrl, item) => {
      const matches =
        pathname === item.url || pathname.startsWith(`${item.url}/`);

      if (!matches) return currentActiveUrl;
      if (!currentActiveUrl || item.url.length > currentActiveUrl.length) {
        return item.url;
      }

      return currentActiveUrl;
    },
    null,
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <FixFlowLogo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {managerSidebarItems.map((item) => {
            const isActive = item.url === activeItemUrl;

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<Link href={item.url} />}
                  className={
                    isActive
                      ? "mt-1 bg-gray-300 hover:bg-gray-300"
                      : "mt-1 hover:bg-gray-200"
                  }
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
