import { SettingsTab } from "../types";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface SettingsSidebarItemProps {
  tab: SettingsTab;
  Icon: ReactNode;
  isActive: boolean;
  onSelect: (tab: SettingsTab) => void;
}

export const SettingsSidebarItem = ({
  tab,
  Icon,
  isActive,
  onSelect,
}: SettingsSidebarItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} onClick={() => onSelect(tab)}>
        {Icon}
        <span>{tab}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
