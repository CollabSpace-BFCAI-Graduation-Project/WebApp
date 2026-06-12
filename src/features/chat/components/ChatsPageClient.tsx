"use client";

import { ChatsGrid } from "@/features/chat/components/ChatsGrid";
import { ChatsHeader } from "@/features/chat/components/ChatsHeader";
import { PageMotion } from "@/components/shared/PageMotion";
import { getSpaces } from "@/features/spaces/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ChatsPageClient() {
  const {
    data: pagedResult,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["spaces", "chat-list"],
    queryFn: () => getSpaces(),
  });

  const spaces = pagedResult?.data ?? [];

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load chats.",
      );
    }
  }, [error]);

  return (
    <PageMotion className="space-y-10 pt-10 w-full max-w-4xl mx-auto">
      <ChatsHeader />
      <ChatsGrid spaces={spaces} isLoading={isLoading} />
    </PageMotion>
  );
}
