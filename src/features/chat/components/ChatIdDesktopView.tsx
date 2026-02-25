"use client";
import { Button } from "@/components/ui/button";

import { chats } from "@/lib/dummyData";
import { useChannelStore } from "@/store/channels";
import { Plus } from "lucide-react";
import { NewChannelInput } from "./NewChannelInput";
import { useState } from "react";
import { ChannelChatWindow } from "./ChannelChatWindow";
import { ChannelCard } from "./ChannelCard";

interface ChatIdDesktopViewProps {
  chat: (typeof chats)[0];
}

export const ChatIdDesktopView = ({ chat }: ChatIdDesktopViewProps) => {
  const {
    channels,
    addChannel,
    activeChannel,
    setActiveChannel,
    removeChannel,
  } = useChannelStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChannel = (name: string) => {
    setIsCreating(false);
    addChannel(name);
  };
  return (
    <div className="gap-3 w-full hidden md:flex">
      <div className="flex flex-col gap-4 border rounded-lg w-[45%] lg:w-[25%]">
        <h1 className="font-bold text-lg bg-primary/50 p-3 rounded-t-lg">
          {chat.name}
        </h1>
        <div className="flex flex-col gap-3 p-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-semibold">Channels</span>
            <Plus
              className="size-5 rounded cursor-pointer hover:bg-muted p-0.5"
              onClick={() => setIsCreating(true)}
            />
          </div>
          <div className="flex flex-col gap-3">
            {isCreating && (
              <NewChannelInput
                onCreateChannel={handleCreateChannel}
                onCancel={() => setIsCreating(false)}
              />
            )}
            {channels.length
              ? channels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    isActive={channel.name === activeChannel}
                    setActiveChannel={() => setActiveChannel(channel.name)}
                    removeChannel={removeChannel}
                  />
                ))
              : !isCreating && (
                  <div className="p-6 flex flex-col justify-center items-center">
                    <p className="text-muted-foreground">No channels yet</p>
                    <Button
                      variant="link"
                      className="cursor-pointer"
                      onClick={() => setIsCreating(true)}
                    >
                      Create the first channel
                    </Button>
                  </div>
                )}
          </div>
        </div>
      </div>
      <ChannelChatWindow chat={chat} className="w-[55%] lg:w-[75%]" />
    </div>
  );
};
