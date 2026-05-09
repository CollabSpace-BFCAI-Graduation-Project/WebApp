import { SettingsTab } from "@/features/settings/types";
import { create } from "zustand";

interface SettingsModalState {
  isOpen: boolean;
  activeTab: SettingsTab;
  setIsOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: SettingsTab) => void;
}

export const useSettingsModalStore = create<SettingsModalState>((set) => {
  return {
    isOpen: false,
    activeTab: "General",
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    setActiveTab: (tab: SettingsTab) => set({ activeTab: tab }),
  };
});
