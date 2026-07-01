/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "motion/react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarLinkItem } from "@/lib/types/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarItemVariants } from "@/lib/animations";

interface SidebarLinkProps {
  item: SidebarLinkItem;
}

export const SidebarLink = ({ item }: SidebarLinkProps) => {
  const path = usePathname();
  const router = useRouter();
  const { toggleSidebar, isMobile } = useSidebar();
  const isActive = path === item.url || path?.startsWith(`${item.url}/`);

  return (
    <motion.li
      initial={sidebarItemVariants.initial as any}
      animate={sidebarItemVariants.animate as any}
      exit={sidebarItemVariants.exit as any}
      transition={sidebarItemVariants.transition as any}
    >
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.name}
        className="data-[active=true]:default-theme:bg-foreground/70
                 data-[active=true]:default-theme:text-background"
        render={
          <Link
            href={item.url}
            onClick={(e) => {
              if (isMobile) {
                e.preventDefault();
                toggleSidebar();
                router.push(item.url);
              }
            }}
          />
        }
      >
        {item.icon}
        <span className="group-data-[collapsible=icon]:hidden">
          {item.name}
        </span>
      </SidebarMenuButton>
    </motion.li>
  );
};
