import { Home, ClipboardList, Wrench, LucideIcon } from "lucide-react";

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

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
