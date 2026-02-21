"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SettingsModalSidebar } from "./SettingsModalSidebar";
import { ProfileSettings } from "./profile-settings/ProfileSettings";
import { RequestsSettings } from "./requests-settings/RequestsSettings";
import { PrivacySettings } from "./privacy-settings/PrivacySettings";
import { NotificationsSettings } from "./notifications-settings/NotificationsSettings";
import { GeneralSettings } from "./general-settings/GeneralSettings";
import { useSettingsModalStore } from "@/store/settings-modal";
import { SettingsTab } from "../types";

const settingsContent: {
  [key in SettingsTab]: React.ReactNode;
} = {
  Profile: <ProfileSettings />,
  "My Requests": <RequestsSettings />,
  Privacy: <PrivacySettings />,
  Notifications: <NotificationsSettings />,
  General: <GeneralSettings />,
};

export const SettingsModal = () => {
  const isOpen = useSettingsModalStore((state) => state.isOpen);
  const setIsOpen = useSettingsModalStore((state) => state.setIsOpen);
  const activeTab = useSettingsModalStore((state) => state.activeTab);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl! p-0 overflow-hidden h-[600px] flex">
        {/* Sidebar */}
        <SettingsModalSidebar />

        {/* Content */}
        <div className="flex-1">{settingsContent[activeTab]}</div>
      </DialogContent>
    </Dialog>
  );
};
