import { SettingsTab } from "../types";
import { LucideIcon } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SettingsSidebarItemProps {
  tab: SettingsTab;
  Icon: LucideIcon;
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
        <Icon className="size-4" />
        <span>{tab}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
