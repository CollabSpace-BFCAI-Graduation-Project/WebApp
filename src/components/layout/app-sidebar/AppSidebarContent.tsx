"use client";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Grid, Users, MessageSquare, Settings } from "lucide-react";

import { SettingsModal } from "@/features/settings/components/SettingsModal";
import { useSettingsModalStore } from "@/store/settings-modal";
import { NotificationModal } from "@/features/notifications/components/NotificationModal";
import { SidebarLink } from "./SidebarLink";
import { SidebarLinkItem } from "@/lib/types";

const sidebarLinks: SidebarLinkItem[] = [
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

export const AppSidebarContent = () => {
  const setIsOpen = useSettingsModalStore((state) => state.setIsOpen);
  const setActiveTab = useSettingsModalStore((state) => state.setActiveTab);

  return (
    <SidebarContent className="flex justify-between">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarLinks.map((item) => (
              <SidebarLink key={item.url} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <NotificationModal />
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="
                data-[active=true]:default-theme:bg-foreground/70
                data-[active=true]:default-theme:text-background"
              >
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setActiveTab("General");
                  }}
                >
                  <Settings />
                  <span>Settings</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SettingsModal />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
