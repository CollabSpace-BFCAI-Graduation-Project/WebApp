"use client";
import { useQuery } from "@tanstack/react-query";
import { SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettingsModalStore } from "@/store/settings-modal";
import { useAuthStore } from "@/store/auth-store";
import { getCurrentProfile } from "@/features/settings/services";

export const AppSidebarFooter = () => {
  const { open } = useSidebar();
  const setIsOpen = useSettingsModalStore((state) => state.setIsOpen);
  const setActiveTab = useSettingsModalStore((state) => state.setActiveTab);
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: getCurrentProfile,
    enabled: !!user,
  });
  const avatarUrl = profile?.avatarImage;
  const initials = user?.name
    ? user.name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("")
    : "CS";

  return (
    <SidebarFooter>
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full w-full justify-start", open && "p-2 gap-3")}
        onClick={() => {
          setIsOpen(true);
          setActiveTab("Profile");
        }}
      >
        <Avatar>
          {avatarUrl && <AvatarImage src={avatarUrl} alt={user?.name ?? "User"} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "transition-all duration-200 overflow-hidden font-medium",
            open ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0",
          )}
        >
          {user?.name ?? "User"}
        </span>
      </Button>
    </SidebarFooter>
  );
};
