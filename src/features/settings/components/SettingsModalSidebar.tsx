import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SettingsTab } from "../types";
import { LogOut, User, Clock, Lock, Bell, Settings } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { SettingsSidebarItem } from "./SettingSidebarItem";
import { useSettingsModalStore } from "@/store/settings-modal";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

const navItems: { tab: SettingsTab; Icon: LucideIcon }[] = [
  { tab: "Profile", Icon: User },
  { tab: "My Requests", Icon: Clock },
  { tab: "Privacy", Icon: Lock },
  { tab: "Notifications", Icon: Bell },
  { tab: "General", Icon: Settings },
];

export const SettingsModalSidebar = () => {
  const activeTab = useSettingsModalStore((s) => s.activeTab);
  const setActiveTab = useSettingsModalStore((s) => s.setActiveTab);

  const handleTabChange = useCallback(
    (tab: SettingsTab) => {
      setActiveTab(tab);
    },
    [setActiveTab],
  );

  return (
    <Sidebar collapsible="none" className="hidden md:flex w-48">
      <SidebarContent>
        <SidebarGroup className="h-full">
          <SidebarGroupContent className="h-full">
            <SidebarMenu className="h-full">
              {navItems.map((item) => (
                <SettingsSidebarItem
                  key={item.tab}
                  tab={item.tab}
                  Icon={item.Icon}
                  isActive={item.tab === activeTab}
                  onSelect={handleTabChange}
                />
              ))}
              <SidebarMenuItem className="mt-auto">
                <SidebarMenuButton onClick={() => {}} asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive justify-start hover:bg-destructive! hover:text-destructive-foreground! transition-colors duration-300"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
