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
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/70 px-3 py-3">
        <FixFlowLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminSidebarItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<Link href={item.url} />}
                  // isActive={isActive}
                  className={`
                    mt-1
                    ${isActive && "bg-gray-300"} 
                    ${!isActive ? "hover:bg-gray-200" : "hover:bg-gray-300"}`}
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
