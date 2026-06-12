"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Space } from "@/lib/types/api-types";
import { Plus } from "lucide-react";
import { NewChannelInput } from "./NewChannelInput";
import { useEffect, useMemo, useState } from "react";
import { ChannelChatWindow } from "./ChannelChatWindow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSpaceChannel, getSpaceChannels } from "@/features/spaces/services";
import { toast } from "sonner";
import { useActiveChannel } from "../hooks/useActiveChannel";

interface ChatIdMobileViewProps {
  space: Space;
  spaceId: string;
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const ChatIdMobileView = ({ space, spaceId }: ChatIdMobileViewProps) => {
  const queryClient = useQueryClient();
  const [activeChannel, setActiveChannel] = useActiveChannel("");
  const [isCreating, setIsCreating] = useState(false);
  const canLoadChannels = uuidPattern.test(spaceId);
  const { data, error } = useQuery({
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
    <div className="flex flex-col gap-3 w-full h-full md:hidden">
      <div className="flex flex-col gap-3">
        <h1 className="font-bold pl-2 text-lg">{space.name}</h1>
        <Select
          value={activeChannel ?? undefined}
          onValueChange={(value) => void setActiveChannel(value)}
        >
          <SelectTrigger className="w-full py-4">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Channels</SelectLabel>
              {channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full">
        {isCreating ? (
          <NewChannelInput
            onCreateChannel={handleCreateChannel}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <Button
            variant="default"
            className="w-full"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="size-4" />
            Create Channel
          </Button>
        )}
      </div>
      <ChannelChatWindow space={space} spaceId={spaceId} channel={selectedChannel} />
    </div>
  );
};
