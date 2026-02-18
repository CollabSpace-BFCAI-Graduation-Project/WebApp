"use client";

import { Plus } from "lucide-react";
import { ChannelCard } from "./ChannelCard";
import { useState, ChangeEvent } from "react";

import { NewChannelInput } from "./NewChannelInput";
import { Button } from "@/components/ui/button";

export const Channels = () => {
  const [activeChannel, setActiveChannel] = useState("general");

  const [channels, setChannels] = useState([
    {
      id: 1,
      name: "general",
    },
    {
      id: 2,
      name: "python",
    },
    {
      id: 3,
      name: "404",
    },
  ]);

  const [newChannelInput, setNewChannelInput] = useState({
    hidden: true,
    value: "",
  });

  const showNewChannelInput = () => {
    setNewChannelInput((prev) => ({ ...prev, hidden: false }));
  };

  const handleNewChannelInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewChannelInput((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  const resetNewChannelInput = () => {
    setNewChannelInput({ hidden: true, value: "" });
  };

  const AddToChannels = (channelName: string) => {
    setChannels((channels) => [
      ...channels,
      {
        id: channels.length + 1,
        name: channelName,
      },
    ]);
  };

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center text-muted-foreground">
        <span className="">Channels</span>
        <Plus
          className="size-5 rounded cursor-pointer hover:bg-muted p-0.5"
          onClick={showNewChannelInput}
        />
      </div>
      <div className="flex flex-col gap-3">
        {!newChannelInput.hidden && (
          <NewChannelInput
            hidden={newChannelInput.hidden}
            reset={resetNewChannelInput}
            AddToChannels={AddToChannels}
            value={newChannelInput.value}
            onChange={handleNewChannelInputChange}
          />
        )}
        {channels.length
          ? channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                isActive={channel.name === activeChannel}
                setActiveChannel={setActiveChannel}
                setChannels={setChannels}
              />
            ))
          : newChannelInput.hidden && (
              <div className="p-6 flex flex-col justify-center items-center">
                <p className="text-muted-foreground">No channels yet</p>
                <Button
                  variant="link"
                  className="cursor-pointer"
                  onClick={showNewChannelInput}
                >
                  Create the first channel
                </Button>
              </div>
            )}
      </div>
    </div>
  );
};
