"use client";

import { ChatIdDesktopView } from "./ChatIdDesktopView";
import { ChatIdMobileView } from "./ChatIdMobileView";
import { Skeleton } from "@/components/ui/skeleton";
import { getSpaceById } from "@/features/spaces/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

interface SingleChatPageClientProps {
  spaceId: string;
}

export const SingleChatPageClient = ({ spaceId }: SingleChatPageClientProps) => {
  const {
    data: space,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["spaces", spaceId, "details"],
    queryFn: () => getSpaceById(spaceId),
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load this chat.",
      );
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col gap-6 p-6 md:flex-row">
        <Skeleton className="hidden h-full rounded-lg md:block md:w-[25%]" />
        <Skeleton className="h-full rounded-lg md:w-[75%]" />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md rounded-xl border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">Chat unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "This space chat could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row p-6 h-screen gap-6">
      <ChatIdMobileView space={space} spaceId={spaceId} />
      <ChatIdDesktopView space={space} spaceId={spaceId} />
    </div>
  );
};
