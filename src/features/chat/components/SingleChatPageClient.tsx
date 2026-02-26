"use client";

import { chats } from "@/lib/dummyData";
import { ChatIdDesktopView } from "./ChatIdDesktopView";
import { ChatIdMobileView } from "./ChatIdMobileView";
import { useSetBreadcrumb } from "@/hooks/useSetBreadcrumb";
import { HomeIcon } from "@/components/ui/home";
import { MessageCircleMoreIcon } from "@/components/ui/message-circle-more";
import { MessageSquareIcon } from "@/components/ui/message-square";

interface SingleChatPageClientProps {
  chat: (typeof chats)[0];
}

export const SingleChatPageClient = ({ chat }: SingleChatPageClientProps) => {
  useSetBreadcrumb([
    { label: "Spaces", href: "/", icon: <HomeIcon size={18} /> },
    {
      label: "Chat",
      href: "/chat",
      icon: <MessageSquareIcon size={18} />,
    },
    { label: chat.name, icon: <MessageCircleMoreIcon size={18} /> },
  ]);
  return (
    <div className="flex flex-col md:flex-row p-6 h-screen gap-6">
      <ChatIdMobileView chat={chat} />
      <ChatIdDesktopView chat={chat} />
    </div>
  );
};
