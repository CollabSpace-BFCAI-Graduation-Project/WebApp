"use client";

import { chats } from "@/lib/dummyData";
import { cn } from "@/lib/utils";
import { useActiveChannel } from "../hooks/useActiveChannel";

interface ChannelChatWindowProps {
  chat: (typeof chats)[0];
  className?: string;
}

export const ChannelChatWindow = ({
  chat,
  className,
}: ChannelChatWindowProps) => {
  const [activeChannel] = useActiveChannel(chat.name);
  return (
    <div
      className={cn(
        "flex-col gap-4 rounded-lg overflow-hidden border h-full w-full",
        className,
      )}
    >
      <div className="bg-primary/50 p-5 flex items-center gap-2">
        <div
          className={cn(chat.background, " w-10 aspect-square rounded-xl")}
        ></div>
        <h1>{activeChannel}</h1>
      </div>
    </div>
  );
};
