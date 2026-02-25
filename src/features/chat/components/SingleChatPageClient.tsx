"use client";

import { chats } from "@/lib/dummyData";
import { ChatIdDesktopView } from "./ChatIdDesktopView";
import { ChatIdMobileView } from "./ChatIdMobileView";
import { useSetBreadcrumb } from "@/hooks/useSetBreadcrumb";
import { HouseIcon, LucideMessageSquareQuote, MessageCircle, MessageSquareQuote, Send } from "lucide-react";

interface SingleChatPageClientProps {
  chat: (typeof chats)[0];
}

export const SingleChatPageClient = ({ chat }: SingleChatPageClientProps) => {
  useSetBreadcrumb([
    { label: "Spaces", href: "/", icon: <HouseIcon className="size-4" /> },
    {
      label: "Chat",
      href: "/chat",
      icon: <MessageCircle className="size-4" />,
    },
    { label: chat.name, icon: <Send className="size-4" /> },
  ]);
  return (
    <div className="flex flex-col md:flex-row p-6 h-screen gap-6">
      <ChatIdMobileView chat={chat} />
      <ChatIdDesktopView chat={chat} />
    </div>
  );
};
