"use client";

import { useEffect } from "react";

import { SettingsModal } from "@/features/settings/components/SettingsModal";
import { useSettingsModalStore } from "@/store/settings-modal";

export default function SettingsPage() {
  const setIsOpen = useSettingsModalStore((state) => state.setIsOpen);
  const setActiveTab = useSettingsModalStore((state) => state.setActiveTab);

  useEffect(() => {
    setIsOpen(true);
    setActiveTab("General");
  }, [setActiveTab, setIsOpen]);

  return (
    <main className="min-h-screen py-6">
      <SettingsModal />
    </main>
  );
}
