"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export const NavSidebarTrigger = () => {
  const { isMobile } = useSidebar();
  return isMobile && <SidebarTrigger />;
};
