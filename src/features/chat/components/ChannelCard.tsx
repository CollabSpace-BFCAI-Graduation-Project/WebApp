import { cn } from "@/lib/utils";
import { Check, X, Pen, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Channel } from "../types";
interface ChannelCardProps {
  channel: Channel;
  isActive: boolean;
  setActiveChannel: Dispatch<SetStateAction<string>>;
  removeChannel: (id: string) => void;
}

export const ChannelCard = ({
  channel,
  isActive,
  setActiveChannel,
  removeChannel,
}: ChannelCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [channelName, setChannelName] = useState(channel.name);
  const channelNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      channelNameInputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsEditing(false);
    }
  }, [isActive]);

  const handleChannelNameChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const input = e.currentTarget;

    if ("key" in e && e.key === "Enter" && input.value.trim().length) {
      e.preventDefault();
      setIsEditing(false);
      //call api to update the name
      return;
    }
    setChannelName(input.value);
  };

  return (
    <div
      onClick={() => setActiveChannel(channel.name)}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg group",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/50",
      )}
    >
      {isEditing ? (
        <>
          <div className="flex gap-2 items-center">
            <span className="text-primary-foreground/50">#</span>
            <input
              ref={channelNameInputRef}
              placeholder="channel-name"
              value={channelName}
              onChange={handleChannelNameChange}
              onKeyDown={handleChannelNameChange}
              className="border-none outline-0 placeholder:text-secondary!  selection:bg-secondary selection:text-secondary-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Check
              className="size-5 text-green-500 hover:text-green-400 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={() => {
                if (!channelName.trim().length) return;
                setIsEditing(false);
                //call api to update the name
              }}
            />
            <X
              className="size-5 text-destructive hover:text-destructive/60 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={() => {
                setIsEditing(false);
                if (channelName !== channel.name) {
                  setChannelName(channel.name);
                }
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2 items-center selection:bg-secondary selection:text-secondary-foreground">
            <span className="">#</span>
            <span>{channelName}</span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
            <Pen
              className="size-5 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={() => {
                setIsEditing(true);
                //call api to update the name
              }}
            />
            <Trash2
              className="size-5 text-destructive hover:text-destructive/60 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={() => removeChannel(channel.id)}
            />
          </div>
        </>
      )}
    </div>
  );
};
