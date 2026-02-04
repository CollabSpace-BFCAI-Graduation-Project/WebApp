import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { NavSidebarHeader } from "./NavSidebarHeader";
import { NavSidebarFooter } from "./NavSidebarFooter";
import { NavSidebarContent } from "./NavSidebarContent";

export function NavSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <NavSidebarHeader />
      <NavSidebarContent />
      <NavSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
