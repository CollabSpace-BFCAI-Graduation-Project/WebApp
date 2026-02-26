"use client";

import { HomeIcon } from "@/components/ui/home";
import { MessageCircleMoreIcon } from "@/components/ui/message-circle-more";
import { ChatsGrid } from "@/features/chat/components/ChatsGrid";
import { ChatsHeader } from "@/features/chat/components/ChatsHeader";
import { useSetBreadcrumb } from "@/hooks/useSetBreadcrumb";

export default function ChatsPageClient() {
  useSetBreadcrumb([
    { label: "Spaces", href: "/", icon: <HomeIcon size={18} /> },
    { label: "Chat", icon: <MessageCircleMoreIcon size={18} /> },
  ]);

  return (
    <div className="space-y-10 pt-10 w-full max-w-4xl mx-auto">
      <ChatsHeader />
      <ChatsGrid />
    </div>
  );
}
