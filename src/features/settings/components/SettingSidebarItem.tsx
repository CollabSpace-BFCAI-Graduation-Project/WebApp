/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useReducedMotion } from "motion/react";
import { SettingsTab } from "../types";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { listItemVariants } from "@/lib/animations";

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
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className="group/menu-item relative"
      variants={listItemVariants}
      initial={reduceMotion ? false : (listItemVariants.initial as any)}
      animate={reduceMotion ? undefined : (listItemVariants.animate as any)}
      transition={listItemVariants.transition as any}
    >
      <SidebarMenuButton isActive={isActive} onClick={() => onSelect(tab)}>
        {Icon}
        <span>{tab}</span>
      </SidebarMenuButton>
    </motion.li>
  );
};
