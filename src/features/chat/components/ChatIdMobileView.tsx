"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chats } from "@/lib/dummyData";
import { useChannelStore } from "@/store/channels";
import { Plus } from "lucide-react";
import { NewChannelInput } from "./NewChannelInput";
import { useState } from "react";
import { ChannelChatWindow } from "./ChannelChatWindow";

interface ChatIdMobileViewProps {
  chat: (typeof chats)[0];
}

export const ChatIdMobileView = ({ chat }: ChatIdMobileViewProps) => {
  const { channels, addChannel } = useChannelStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChannel = (name: string) => {
    setIsCreating(false);
    addChannel(name);
  };
  return (
    <div className="flex flex-col gap-3 w-full h-full md:hidden">
      <div className="flex flex-col gap-3">
        <h1 className="font-bold pl-2 text-lg">{chat.name}</h1>
        <Select>
          <SelectTrigger className="w-full py-4">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Channels</SelectLabel>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.name}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full">
        {isCreating ? (
          <NewChannelInput
            onCreateChannel={handleCreateChannel}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <Button
            variant="default"
            className="w-full"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="size-4" />
            Create Channel
          </Button>
        )}
      </div>
      <ChannelChatWindow chat={chat} />
    </div>
  );
};
