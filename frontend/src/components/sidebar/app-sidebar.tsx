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

export function AppSidebar({ sidebarItems }: { sidebarItems: SidebarItem[] }) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/70 px-3 py-3">
        <FixFlowLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                render={<Link href={item.url} />}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
