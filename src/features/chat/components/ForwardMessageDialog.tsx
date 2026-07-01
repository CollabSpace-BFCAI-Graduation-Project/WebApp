"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Hash, Search, Send } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import {
  getCategoryGradientClass,
  normalizeCategory,
} from "@/features/spaces/components/space-details/space-utils";
import {
  forwardMessage,
  getSpaceChannels,
  getSpaces,
  sendChannelMessage,
} from "@/features/spaces/services";
import { cn } from "@/lib/utils";
import type { ChatChannel, ChatMessage, Space } from "@/lib/types/api-types";


interface ForwardMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Space the message currently lives in. */
  spaceId: string;
  /** Channel the message currently lives in. */
  channelId: string;
  /** Message being forwarded. */
  message: ChatMessage | null;
}

export function ForwardMessageDialog({
  open,
  onOpenChange,
  spaceId,
  channelId,
  message,
}: ForwardMessageDialogProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{
    spaceId: string;
    channelId: string;
  } | null>(null);

  const token = useAuthStore((state) => state.token);

  // Load all spaces the user is a member of.
  const { data: spacesData, isLoading: spacesLoading } = useQuery({
    queryKey: ["spaces"],
    queryFn: () => getSpaces(1, 100),
    enabled: open,
  });

  const spaces = useMemo(() => spacesData?.data ?? [], [spacesData?.data]);

  // Load channels for every space so the user can forward across spaces.
  // We use per-space query keys so results are cached individually.
  const channelQueries = useQuery({
    queryKey: ["spaces", "forward-channels", spaces.map((s) => s.id).join(",")],
    queryFn: async () => {
      const entries = await Promise.all(
        spaces.map(async (space) => {
          try {
            const res = await getSpaceChannels(space.id);
            return [space.id, (res.data ?? []) as ChatChannel[]] as const;
          } catch {
            return [space.id, [] as ChatChannel[]] as const;
          }
        }),
      );
      return new Map<string, ChatChannel[]>(entries);
    },
    enabled: open && spaces.length > 0,
  });

  const channelsBySpace = useMemo(
    () => channelQueries.data ?? new Map<string, ChatChannel[]>(),
    [channelQueries.data],
  );

  const filteredSpaces = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return spaces;
    return spaces.filter((space) => {
      const spaceMatch =
        space.name.toLowerCase().includes(q) ||
        normalizeCategory(space.category).includes(q);
      const channels = channelsBySpace.get(space.id) ?? [];
      const channelMatch = channels.some((c) =>
        c.name.toLowerCase().includes(q),
      );
      return spaceMatch || channelMatch;
    });
  }, [spaces, channelsBySpace, search]);

  const forwardMutation = useMutation({
    mutationFn: async () => {
      if (!message || !selected) return;

      const isSameSpace = selected.spaceId === spaceId;

      if (isSameSpace) {
        // Native forwarding within the same space
        return forwardMessage(
          spaceId,
          channelId,
          message.id,
          selected.channelId,
        );
      } else {
        // Cross-space forwarding: Download files and re-send them to the target space/channel
        const files: File[] = [];
        if (message.attachments && message.attachments.length > 0) {
          const downloadPromises = message.attachments.map(async (att) => {
            if (!att.fileId) return;
            try {
              const proxyUrl = `/api/backend-files/api/spaces/${spaceId}/storage/files/${att.fileId}/download`;
              const headers: Record<string, string> = {};
              if (token) headers.Authorization = `Bearer ${token}`;
              const res = await fetch(proxyUrl, { headers });
              if (res.ok) {
                const blob = await res.blob();
                const file = new File([blob], att.fileName, {
                  type: att.mimeType || blob.type,
                });
                files.push(file);
              }
            } catch (err) {
              console.error("Failed to download attachment for cross-space forwarding:", err);
            }
          });
          await Promise.all(downloadPromises);
        }

        return sendChannelMessage(selected.spaceId, selected.channelId, {
          text: message.text || "\u200B",
          files: files.length > 0 ? files : undefined,
        });
      }
    },
    onSuccess: async () => {
      toast.success("Message forwarded.");
      if (selected) {
        await queryClient.invalidateQueries({
          queryKey: [
            "spaces",
            selected.spaceId,
            "channels",
            selected.channelId,
            "messages",
          ],
        });
      }
      onOpenChange(false);
      setSelected(null);
      setSearch("");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to forward the message.",
      );
    },
  });

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setSelected(null);
      setSearch("");
    }
  };

  const snippet = useMemo(() => {
    if (!message) return "";
    const text = (message.text ?? "").replace(/\u200B/g, "").trim();
    if (text) return text.length > 80 ? `${text.slice(0, 80)}…` : text;
    if (message.attachments?.length) return message.attachments[0].fileName;
    return "";
  }, [message]);

  const isLoading = spacesLoading || channelQueries.isLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Forward message</DialogTitle>
          <DialogDescription>
            Choose a channel to send a copy of this message to.
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              @{message.sender.username}
            </p>
            <p className="mt-0.5 line-clamp-2 break-words text-sm">{snippet}</p>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spaces or channels…"
            className="pl-8"
          />
        </div>

        <div className="max-h-72 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : filteredSpaces.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No destinations found.
            </p>
          ) : (
            filteredSpaces.map((space) => (
              <SpaceDestination
                key={space.id}
                space={space}
                channels={channelsBySpace.get(space.id) ?? []}
                currentSpaceId={spaceId}
                currentChannelId={channelId}
                selectedChannelId={
                  selected?.spaceId === space.id ? selected.channelId : null
                }
                onSelect={(chId) =>
                  setSelected({ spaceId: space.id, channelId: chId })
                }
              />
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selected || forwardMutation.isPending}
            onClick={() => forwardMutation.mutate()}
          >
            <Send />
            {forwardMutation.isPending ? "Forwarding…" : "Forward"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: one space + its channels
// ---------------------------------------------------------------------------

interface SpaceDestinationProps {
  space: Space;
  channels: ChatChannel[];
  currentSpaceId: string;
  currentChannelId: string;
  selectedChannelId: string | null;
  onSelect: (channelId: string) => void;
}

function SpaceDestination({
  space,
  channels,
  currentSpaceId,
  currentChannelId,
  selectedChannelId,
  onSelect,
}: SpaceDestinationProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 px-1">
        <div
          className={cn(
            "size-5 rounded-md",
            getCategoryGradientClass(space.category),
          )}
        />
        <span className="truncate text-xs font-semibold">{space.name}</span>
        {space.id === currentSpaceId && (
          <span className="text-[10px] font-medium text-muted-foreground">
            (current)
          </span>
        )}
      </div>

      {channels.length === 0 ? (
        <p className="px-1 py-1 text-xs text-muted-foreground">No channels</p>
      ) : (
        <div className="space-y-1">
          {channels.map((channel) => {
            const isCurrent =
              space.id === currentSpaceId && channel.id === currentChannelId;
            const isSelected = selectedChannelId === channel.id;
            return (
              <button
                key={channel.id}
                type="button"
                disabled={isCurrent}
                onClick={() => onSelect(channel.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-sm transition-colors",
                  isCurrent
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-accent",
                  isSelected && "border-primary bg-primary/5",
                )}
              >
                <Hash className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{channel.name}</span>
                {isCurrent ? (
                  <span className="text-[10px] text-muted-foreground">here</span>
                ) : isSelected ? (
                  <ArrowRight className="size-3.5 text-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
