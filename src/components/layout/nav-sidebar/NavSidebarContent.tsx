"use client";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Grid, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import { NotificationModal } from "../../../features/notifications/components/NotificationModal";
import { SettingsModal } from "@/features/settings/components/SettingsModal";

const navLinks = [
  {
    name: "Spaces",
    url: "/",
    icon: Grid,
  },
  {
    name: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Team",
    url: "/team",
    icon: Users,
  },
];

export const NavSidebarContent = () => {
  const { toggleSidebar, isMobile } = useSidebar();
  return (
    <SidebarContent className="flex justify-between">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navLinks.map((item, index) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={index === 0}
                  className="
                  data-[active=true]:default-theme:bg-foreground/70
                  data-[active=true]:default-theme:text-background"
                >
                  <Link
                    href={item.url}
                    onClick={() => {
                      if (isMobile) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <NotificationModal />
            <SettingsModal />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
