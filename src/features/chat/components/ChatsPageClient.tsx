"use client";

import { ChatsGrid } from "@/features/chat/components/ChatsGrid";
import { ChatsHeader } from "@/features/chat/components/ChatsHeader";
import { useSetBreadcrumb } from "@/hooks/useSetBreadcrumb";
import { HouseIcon, MessageCircle } from "lucide-react";

export default function ChatsPageClient() {
  useSetBreadcrumb([
    { label: "Spaces", href: "/", icon: <HouseIcon className="size-4" /> },
    { label: "Chat", icon: <MessageCircle className="size-4" /> },
  ]);

  return (
    <div className="space-y-10 pt-10 w-full max-w-4xl mx-auto">
      <ChatsHeader />
      <ChatsGrid />
    </div>
  );
}
