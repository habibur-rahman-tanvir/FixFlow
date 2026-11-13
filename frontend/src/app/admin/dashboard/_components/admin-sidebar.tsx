"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { FixFlowLogo } from "@/components/fixflow-logo";
import { usePathname } from "next/navigation";
import { Home, Users, LucideIcon, BuildingComplexPlus } from "lucide-react";

type AdminSidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const adminSidebarItems: AdminSidebarItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Organizations",
    url: "/admin/dashboard/organizations",
    icon: BuildingComplexPlus,
  },
  {
    title: "Users",
    url: "/admin/dashboard/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const activeItemUrl = adminSidebarItems.reduce<string | null>(
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
      <SidebarHeader className="border-b border-border/70 px-3 py-3">
        <FixFlowLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminSidebarItems.map((item) => {
            const isActive = item.url === activeItemUrl;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<Link href={item.url} />}
                  // isActive={isActive}
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
}
