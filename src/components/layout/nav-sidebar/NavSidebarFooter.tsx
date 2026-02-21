"use client";
import { SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettingsModalStore } from "@/store/settings-modal";

export const NavSidebarFooter = () => {
  const { open } = useSidebar();
  const setIsOpen = useSettingsModalStore((state) => state.setIsOpen);
  const setActiveTab = useSettingsModalStore((state) => state.setActiveTab);
  return (
    <SidebarFooter>
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full w-full justify-start", open && "p-2")}
        onClick={() => {
          setIsOpen(true);
          setActiveTab("Profile");
        }}
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "transition-all duration-200 overflow-hidden",
            open ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0",
          )}
        >
          mohamed-abdelhafiz-dev
        </span>
      </Button>
    </SidebarFooter>
  );
};
