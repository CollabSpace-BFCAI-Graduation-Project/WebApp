import { Channel } from "@/features/chat/types";
import { create } from "zustand";

interface ChannelStore {
  channels: Channel[];
  activeChannel: string | null;

  addChannel: (name: string) => void;
  removeChannel: (id: string) => void;
  setActiveChannel: (name: string | null) => void;
}

export const useChannelStore = create<ChannelStore>((set) => ({
  channels: [
    { id: "1", name: "general" },
    { id: "2", name: "python" },
  ],

  activeChannel: "general",

  addChannel: (name) =>
    set((state) => {
      const newChannel = {
        id: crypto.randomUUID(),
        name: name.trim(),
      };

      return {
        channels: [...state.channels, newChannel],
        activeChannel: newChannel.name,
      };
    }),

  removeChannel: (id) =>
    set((state) => ({
      channels: state.channels.filter((c) => c.id !== id),
    })),

  setActiveChannel: (name) =>
    set(() => ({
      activeChannel: name,
    })),
}));
