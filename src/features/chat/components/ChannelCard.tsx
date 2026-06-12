/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Check, X, Pen, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChatChannel } from "@/lib/types/api-types";
import { listItemVariants } from "@/lib/animations";

interface ChannelCardProps {
  channel: ChatChannel;
  isActive: boolean;
  setActiveChannel: () => void;
  removeChannel: (id: string) => void;
  renameChannel: (id: string, name: string) => void;
}

export const ChannelCard = ({
  channel,
  isActive,
  setActiveChannel,
  removeChannel,
  renameChannel,
}: ChannelCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [channelName, setChannelName] = useState(channel.name);
  const channelNameInputRef = useRef<HTMLInputElement>(null);
  const [prevIsActive, setPrevIsActive] = useState(isActive);
  const reduceMotion = useReducedMotion();

  if (isActive !== prevIsActive) {
    setPrevIsActive(isActive);
    if (!isActive) {
      setIsEditing(false);
    }
  }

  useEffect(() => {
    if (isEditing) {
      channelNameInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleChannelNameChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const input = e.currentTarget;

    if ("key" in e && e.key === "Enter" && input.value.trim().length) {
      e.preventDefault();
      renameChannel(channel.id, input.value.trim());
      setIsEditing(false);
      return;
    }
    setChannelName(input.value);
  };

  return (
    <motion.div
      onClick={setActiveChannel}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg group cursor-pointer",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/50",
      )}
      variants={listItemVariants}
      initial={reduceMotion ? false : (listItemVariants.initial as any)}
      animate={reduceMotion ? undefined : (listItemVariants.animate as any)}
      transition={listItemVariants.transition as any}
      whileHover={reduceMotion ? undefined : ({ x: 2 } as any)}
      whileTap={reduceMotion ? undefined : ({ scale: 0.99 } as any)}
    >
      {isEditing ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="text-primary-foreground/50">#</span>
            <input
              ref={channelNameInputRef}
              placeholder="channel-name"
              value={channelName}
              onChange={handleChannelNameChange}
              onKeyDown={handleChannelNameChange}
              onClick={(e) => e.stopPropagation()}
              dir="auto"
              className="min-w-0 flex-1 border-none bg-transparent outline-0 placeholder:text-secondary! selection:bg-secondary selection:text-secondary-foreground"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Check
              className="size-5 text-green-500 hover:text-green-400 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (!channelName.trim().length) return;
                renameChannel(channel.id, channelName.trim());
                setIsEditing(false);
              }}
            />
            <X
              className="size-5 text-destructive hover:text-destructive/60 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
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
          <div className="flex min-w-0 flex-1 items-center gap-2 selection:bg-secondary selection:text-secondary-foreground">
            <span className="shrink-0">#</span>
            <span className="truncate" dir="auto">
              {channel.name}
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
            <Pen
              className="size-5 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                setIsEditing(true);
              }}
            />
            <Trash2
              className="size-5 text-destructive hover:text-destructive/60 rounded p-0.5 transition duration-300 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                removeChannel(channel.id);
              }}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};
