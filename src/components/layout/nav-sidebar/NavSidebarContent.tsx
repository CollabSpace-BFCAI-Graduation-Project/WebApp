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
import { Grid, Users, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { NotificationModal } from "../../../features/notifications/components/NotificationModal";
import { SettingsModal } from "@/features/settings/components/SettingsModal";
import { useSettingsModalStore } from "@/store/settings-modal-store";
import { usePathname } from "next/navigation";

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
  const setIsOpen = useSettingsModalStore((state) => state.setIsOpen);
  const setActiveTab = useSettingsModalStore((state) => state.setActiveTab);
  const path = usePathname();
  return (
    <SidebarContent className="flex justify-between">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navLinks.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.url === path ||
                    (item.url === "/chat" && path.includes("chat"))
                  }
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
