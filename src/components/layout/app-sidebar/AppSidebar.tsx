"use client";

import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "./AppSidebarHeader";
import { AppSidebarContent } from "./AppSidebarContent";
import { AppSidebarFooter } from "./AppSidebarFooter";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
