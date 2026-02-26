"use client";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { SettingsModal } from "@/features/settings/components/SettingsModal";
import { useSettingsModalStore } from "@/store/settings-modal";
import { NotificationModal } from "@/features/notifications/components/NotificationModal";
import { SidebarLink } from "./SidebarLink";
import { SidebarLinkItem } from "@/lib/types";
import { MessageSquareIcon } from "@/components/ui/message-square";
import { UsersIcon } from "@/components/ui/users";
import { SettingsIcon } from "@/components/ui/settings";
import { GripIcon } from "@/components/ui/grip";

const sidebarLinks: SidebarLinkItem[] = [
  {
    name: "Spaces",
    url: "/",
    icon: <GripIcon size={18} />,
  },
  {
    name: "Chat",
    url: "/chat",
    icon: <MessageSquareIcon size={18} />,
  },
  {
    name: "Team",
    url: "/team",
    icon: <UsersIcon size={18} />,
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
                  <SettingsIcon size={18} />
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
