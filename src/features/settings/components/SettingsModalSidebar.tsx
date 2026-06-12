import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SettingsTab } from "../types";
import { SettingsSidebarItem } from "./SettingSidebarItem";
import { useSettingsModalStore } from "@/store/settings-modal";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback } from "react";
import { api } from "@/lib/api-client";
import { UsersIcon } from "@/components/ui/users";
import { ClockIcon } from "@/components/ui/clock";
import { LockIcon } from "@/components/ui/lock";
import { SettingsIcon } from "@/components/ui/settings";
import { LogoutIcon } from "@/components/ui/logout";

const navItems: { tab: SettingsTab; Icon: ReactNode }[] = [
  { tab: "Profile", Icon: <UsersIcon size={18} /> },
  { tab: "My Requests", Icon: <ClockIcon size={18} /> },
  { tab: "Privacy", Icon: <LockIcon size={18} /> },
  { tab: "General", Icon: <SettingsIcon size={18} /> },
];

export const SettingsModalSidebar = () => {
  const activeTab = useSettingsModalStore((s) => s.activeTab);
  const setActiveTab = useSettingsModalStore((s) => s.setActiveTab);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

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
                <SidebarMenuButton
                  onClick={async () => {
                    try {
                      await api.post("/auth/revoke", {
                        refreshToken: useAuthStore.getState().refreshToken,
                      });
                    } catch {
                      // Silently proceed even if revoke fails
                    }
                    logout();
                    router.replace("/login");
                  }}
                  className="w-full text-destructive justify-start hover:bg-destructive! hover:text-destructive-foreground! transition-colors duration-300"
                >
                  <LogoutIcon size={18} />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
