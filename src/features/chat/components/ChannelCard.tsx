import { cn } from "@/lib/utils";
import { Check, X, Pen, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
interface ChannelCardProps {
  channel: {
    id: number;
    name: string;
  };
  isActive: boolean;
  setActiveChannel: Dispatch<SetStateAction<string>>;
  setChannels: Dispatch<SetStateAction<{ id: number; name: string }[]>>;
}

export const ChannelCard = ({
  channel,
  isActive,
  setActiveChannel,
  setChannels,
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

  return (
    <div
      onClick={() => setActiveChannel(channel.name)}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg group",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
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
              onChange={(e) => setChannelName(e.target.value)}
              className="border-none outline-0 placeholder:text-secondary!  selection:bg-secondary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Check
              className="size-5 text-green-500 hover:text-green-400 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={() => {
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
          <div className="flex gap-2 items-center">
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
              onClick={() => {
                setChannels((prev) =>
                  prev.filter((ch) => ch.id !== channel.id),
                );
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
