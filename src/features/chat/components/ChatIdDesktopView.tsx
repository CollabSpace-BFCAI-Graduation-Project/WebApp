"use client";
import { Button } from "@/components/ui/button";

import type { Space } from "@/lib/types/api-types";
import { Plus } from "lucide-react";
import { NewChannelInput } from "./NewChannelInput";
import { useEffect, useMemo, useState } from "react";
import { ChannelChatWindow } from "./ChannelChatWindow";
import { ChannelCard } from "./ChannelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSpaceChannel,
  deleteSpaceChannel,
  getSpaceChannels,
  updateSpaceChannel,
} from "@/features/spaces/services";
import { toast } from "sonner";
import { useActiveChannel } from "../hooks/useActiveChannel";

interface ChatIdDesktopViewProps {
  space: Space;
  spaceId: string;
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const ChatIdDesktopView = ({ space, spaceId }: ChatIdDesktopViewProps) => {
  const queryClient = useQueryClient();
  const [activeChannel, setActiveChannel] = useActiveChannel("");
  const [isCreating, setIsCreating] = useState(false);
  const canLoadChannels = uuidPattern.test(spaceId);
  const { data, error, isLoading } = useQuery({
    queryKey: ["spaces", spaceId, "channels"],
    queryFn: () => getSpaceChannels(spaceId),
    enabled: canLoadChannels,
  });
  const channels = useMemo(() => data?.data ?? [], [data?.data]);
  const selectedChannel = channels.find((channel) => channel.id === activeChannel) ?? channels[0];
  const createMutation = useMutation({
    mutationFn: (name: string) =>
      createSpaceChannel(spaceId, { name, description: null }),
    onSuccess: async (channel) => {
      setIsCreating(false);
      await queryClient.invalidateQueries({
        queryKey: ["spaces", spaceId, "channels"],
      });
      void setActiveChannel(channel.id);
    },
    onError: (createError) => {
      toast.error(
        createError instanceof Error
          ? createError.message
          : "Unable to create channel.",
      );
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateSpaceChannel(spaceId, id, { name, description: null }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["spaces", spaceId, "channels"],
      }),
    onError: (updateError) => {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Unable to rename channel.",
      );
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSpaceChannel(spaceId, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["spaces", spaceId, "channels"],
      }),
    onError: (deleteError) => {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete channel.",
      );
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load channels.",
      );
    }
  }, [error]);

  useEffect(() => {
    if (!activeChannel && channels[0]?.id) {
      void setActiveChannel(channels[0].id);
    }
  }, [activeChannel, channels, setActiveChannel]);

  const handleCreateChannel = (name: string) => {
    createMutation.mutate(name);
  };
  return (
    <div className="gap-3 w-full hidden md:flex">
      <div className="flex flex-col gap-4 border rounded-lg w-[45%] lg:w-[25%]">
        <h1 className="font-bold text-lg bg-primary/50 p-3 rounded-t-lg">
          {space.name}
        </h1>
        <div className="flex flex-col gap-3 p-3">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-semibold">Channels</span>
            <Plus
              className="size-5 rounded cursor-pointer hover:bg-muted p-0.5"
              onClick={() => setIsCreating(true)}
            />
          </div>
          <div className="flex flex-col gap-3">
            {isCreating && (
              <NewChannelInput
                onCreateChannel={handleCreateChannel}
                onCancel={() => setIsCreating(false)}
              />
            )}
            {isLoading ? (
              <>
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </>
            ) : channels.length
              ? channels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    isActive={channel.id === selectedChannel?.id}
                    setActiveChannel={() => void setActiveChannel(channel.id)}
                    removeChannel={(id) => deleteMutation.mutate(id)}
                    renameChannel={(id, name) =>
                      updateMutation.mutate({ id, name })
                    }
                  />
                ))
              : !isCreating && (
                  <div className="p-6 flex flex-col justify-center items-center">
                    <p className="text-muted-foreground">No channels yet</p>
                    <Button
                      variant="link"
                      className="cursor-pointer"
                      onClick={() => setIsCreating(true)}
                    >
                      Create the first channel
                    </Button>
                  </div>
                )}
          </div>
        </div>
      </div>
      <ChannelChatWindow
        space={space}
        spaceId={spaceId}
        channel={selectedChannel}
        className="w-[55%] lg:w-[75%]"
      />
    </div>
  );
};
