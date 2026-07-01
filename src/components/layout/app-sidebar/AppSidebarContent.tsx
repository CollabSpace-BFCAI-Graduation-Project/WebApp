"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { SettingsModal } from "@/features/settings/components/SettingsModal";
import { useSettingsModalStore } from "@/store/settings-modal";
import { NotificationModal } from "@/features/notifications/components/NotificationModal";
import { SidebarLink } from "./SidebarLink";
import { SidebarLinkItem } from "@/lib/types/types";
import { MessageSquareIcon } from "@/components/ui/message-square";
import { UsersIcon } from "@/components/ui/users";
import { SettingsIcon } from "@/components/ui/settings";
import { GripIcon } from "@/components/ui/grip";
import { sidebarItemVariants, staggerContainer } from "@/lib/animations";

const sidebarLinks: SidebarLinkItem[] = [
  {
    name: "Spaces",
    url: "/spaces",
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

            <motion.ul
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-px"
            >
              {sidebarLinks.map((item, index) => (
                <SidebarLink key={item.url} item={item} />
              ))}
            </motion.ul>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <NotificationModal />
            <motion.li
              initial={sidebarItemVariants.initial as any}
              animate={sidebarItemVariants.animate as any}
              exit={sidebarItemVariants.exit as any}
              transition={sidebarItemVariants.transition as any}
            >
              <SidebarMenuButton
                className="
                data-[active=true]:default-theme:bg-foreground/70
                data-[active=true]:default-theme:text-background"
                onClick={() => {
                  setIsOpen(true);
                  setActiveTab("General");
                }}
              >
                <SettingsIcon size={18} />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </SidebarMenuButton>
            </motion.li>
            <SettingsModal />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
