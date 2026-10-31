import {
  Home,
  Users,
  ClipboardList,
  Wrench,
  LucideIcon,
  BuildingComplexPlus,
} from "lucide-react";

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

// All are dummy.

export const adminSidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard/",
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
  // {
  //   title: "Reports",
  //   url: "/admin/reports",
  //   icon: ChartNoAxesCombined,
  // },
  // {
  //   title: "Settings",
  //   url: "/admin/settings",
  //   icon: Settings,
  // },
];

export const managerSidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/manager",
    icon: Home,
  },
  {
    title: "Tasks",
    url: "/manager/tasks",
    icon: ClipboardList,
  },
  {
    title: "Technicians",
    url: "/manager/technicians",
    icon: Wrench,
  },
];

export const technicianSidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/technician",
    icon: Home,
  },
  {
    title: "My Tasks",
    url: "/technician/tasks",
    icon: ClipboardList,
  },
];
