"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarItem } from "@/constants/sidebar-items";
import Link from "next/link";
import { FixFlowLogo } from "@/components/fixflow-logo";
import { usePathname } from "next/navigation";

export function AppSidebar({ sidebarItems }: { sidebarItems: SidebarItem[] }) {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/70 px-3 py-3">
        <FixFlowLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => {
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
