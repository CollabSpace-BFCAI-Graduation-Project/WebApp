"use client";

import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebarContent } from "./AppSidebarContent";
import { AppSidebarFooter } from "./AppSidebarFooter";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarContent />
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
