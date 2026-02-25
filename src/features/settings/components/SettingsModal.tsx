"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { useSettingsModalStore } from "@/store/settings-modal";
import { ProfileSettings } from "./profile-settings/ProfileSettings";
import { RequestsSettings } from "./requests-settings/RequestsSettings";
import { PrivacySettings } from "./privacy-settings/PrivacySettings";
import { NotificationsSettings } from "./notifications-settings/NotificationsSettings";
import { GeneralSettings } from "./general-settings/GeneralSettings";
import { SettingsModalSidebar } from "./SettingsModalSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsModalHeader } from "./SettingsModalHeader";

const views = [
  { tab: "Profile", content: <ProfileSettings /> },
  { tab: "My Requests", content: <RequestsSettings /> },
  { tab: "Privacy", content: <PrivacySettings /> },
  { tab: "Notifications", content: <NotificationsSettings /> },
  { tab: "General", content: <GeneralSettings /> },
];

export function SettingsModal() {
  const open = useSettingsModalStore((state) => state.isOpen);
  const setIsOpen = useSettingsModalStore((state) => state.setIsOpen);
  const activeTab = useSettingsModalStore((state) => state.activeTab);

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="items-start min-h-auto">
          <SettingsModalSidebar />
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <SettingsModalHeader />
            {views.find((view) => view.tab === activeTab)?.content}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
