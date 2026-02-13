import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { SettingsModalSidebar } from "./SettingsModalSidebar";
import { useState } from "react";
import { SettingsTab } from "@/lib/types";
import { ProfileSettings } from "./profile-settings/ProfileSettings";
import { RequestsSettings } from "./requests-settings/RequestsSettings";

const settingsContent: {
  [key in SettingsTab]: React.ReactNode;
} = {
  Profile: <ProfileSettings />,
  "My Requests": <RequestsSettings />,
  Privacy: <div>Privacy Settings Content</div>,
  Notifications: <div>Notifications Settings Content</div>,
  General: <div>General Settings Content</div>,
};

export const SettingsModal = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="
                  data-[active=true]:default-theme:bg-foreground/70
                  data-[active=true]:default-theme:text-background"
          >
            <button>
              <Settings />
              <span>Settings</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-3xl! p-0 overflow-hidden h-[600px] flex">
        {/* Sidebar */}
        <SettingsModalSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content */}
        <div className="flex-1">{settingsContent[activeTab]}</div>
      </DialogContent>
    </Dialog>
  );
};
