"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, User, Clock, Lock, Bell, LogOut } from "lucide-react";
import { SettingsTab } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSettingsModalStore } from "@/store/settings-modal-store";
import { Button } from "@/components/ui/button";

const settingsNav: {
  name: SettingsTab;
  Icon: React.ReactNode;
}[] = [
  {
    name: "Profile",
    Icon: <User className="size-4" />,
  },
  {
    name: "My Requests",
    Icon: <Clock className="size-4" />,
  },
  {
    name: "Privacy",
    Icon: <Lock className="size-4" />,
  },
  {
    name: "Notifications",
    Icon: <Bell className="size-4" />,
  },
  {
    name: "General",
    Icon: <Settings className="size-4" />,
  },
];

export const SettingsModalSidebar = () => {
  const activeTab = useSettingsModalStore((state) => state.activeTab);
  const setActiveTab = useSettingsModalStore((state) => state.setActiveTab);

  return (
    <div className="w-48 p-2 pt-4 flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 pl-1">
          <Settings className="size-6" />
          <span className="text-lg font-bold">Settings</span>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col flex-1 gap-2">
        {settingsNav.map(({ Icon, name }) => (
          <button
            key={name}
            className={cn(
              "w-full justify-start flex items-center gap-2 p-1.5 hover:bg-primary/40 rounded-md transition-colors",
              activeTab === name &&
                "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            onClick={() => setActiveTab(name as SettingsTab)}
          >
            {Icon}
            <span className="text-sm font-semibold">{name}</span>
          </button>
        ))}
      </div>
      <Button
        variant="ghost"
        className="w-full text-destructive justify-start hover:bg-destructive! hover:text-destructive-foreground! transition-colors duration-300"
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </div>
  );
};
