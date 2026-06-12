"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { File, Paperclip, Send } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatChannel, ChatMessage, ChatMessageAttachmentDto, Space, UserSummaryDto } from "@/lib/types/api-types";
import { cn } from "@/lib/utils";
import {
  getCategoryGradientClass,
  getInitials,
} from "@/features/spaces/components/space-details/space-utils";
import { resolveBackendMediaUrl } from "@/lib/media-url";
import { cacheFileAsDataUrl, getCachedDataUrl } from "@/lib/file-cache";
import {
  getChannelMessages,
  getFolderContents,
  getSpaceStorage,
  sendChannelMessage,
} from "@/features/spaces/services";
import { useAuthStore } from "@/store/auth-store";
import { useChatMessages } from "@/hooks/useSignalR";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { MentionAutocomplete } from "./MentionAutocomplete";
import { useMention } from "../hooks/useMention";
interface ChannelChatWindowProps {
  space: Space;
  spaceId: string;
  channel?: ChatChannel;
  className?: string;
}

function normalizeAttachment(raw: Record<string, unknown>): ChatMessageAttachmentDto {
  const rawUrl = (raw.url ?? raw.Url ?? null) as string | null;
  const rawFileId = (raw.fileId ?? raw.FileId ?? null) as string | null;
  return {
    id: String(raw.id ?? raw.Id ?? ""),
    fileId: rawFileId,
    url: rawUrl ? (resolveBackendMediaUrl(rawUrl) ?? null) : null,
    fileName: String(raw.fileName ?? raw.FileName ?? ""),
    fileSize: Number(raw.fileSize ?? raw.FileSize ?? 0),
    mimeType: String(raw.mimeType ?? raw.MimeType ?? ""),
    isDeleted: Boolean(raw.isDeleted ?? raw.IsDeleted ?? false),
  };
}

function normalizeChatMessage(raw: Record<string, unknown>): ChatMessage {
  return {
    id: String(raw.id ?? raw.Id ?? ""),
    channelId: String(raw.channelId ?? raw.ChannelId ?? ""),
    text: String(raw.text ?? raw.Text ?? ""),
    isEdited: Boolean(raw.isEdited ?? raw.IsEdited ?? false),
    isDeleted: Boolean(raw.isDeleted ?? raw.IsDeleted ?? false),
    createdAt: String(raw.createdAt ?? raw.CreatedAt ?? ""),
    editedAt: (raw.editedAt ?? raw.EditedAt ?? null) as string | null,
    parentMessage: (raw.parentMessage ?? raw.ParentMessage ?? null) as ChatMessage["parentMessage"],
    sender: normalizeUserSummary((raw.sender ?? raw.Sender ?? {}) as Record<string, unknown>),
    deletedBy: (raw.deletedBy ?? raw.DeletedBy ?? null) as ChatMessage["deletedBy"],
    mentions: ((raw.mentions ?? raw.Mentions ?? []) as Record<string, unknown>[]).map(normalizeUserSummary),
    attachments: ((raw.attachments ?? raw.Attachments ?? []) as Record<string, unknown>[]).map(normalizeAttachment),
  };
}

function normalizeUserSummary(raw: Record<string, unknown>): UserSummaryDto {
  return {
    id: String(raw.id ?? raw.Id ?? ""),
    username: String(raw.username ?? raw.Username ?? ""),
    displayName: (raw.displayName ?? raw.DisplayName ?? null) as string | null,
    avatarUrl: resolveBackendMediaUrl((raw.avatarUrl ?? raw.AvatarUrl ?? null) as string | null) ?? null,
  };
}

function renderMessageText(text: string, mentions: UserSummaryDto[]) {
  const mentionMap = new Map(mentions.map((m) => [m.id, m.username]));
  const mentionUsernames = mentions.map((m) => m.username);

  const displayText = text.replace(/@\{([^}]+)\}/g, (_, id: string) => {
    const username = mentionMap.get(id);
    return username ? `@${username}` : `@${id}`;
  });

  const parts = displayText.split(/(@\w+)/g);
  return parts.map((part, i) => {
    const isMention =
      part.startsWith("@") &&
      mentionUsernames.some((u) => u === part.slice(1));
    return isMention ? (
      <span key={i} className="rounded-sm bg-primary/15 px-0.5 font-medium text-primary">
        {part}
      </span>
    ) : (
      part
    );
  });
}

export const ChannelChatWindow = ({
  space,
  spaceId,
  channel,
  className,
}: ChannelChatWindowProps) => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localFileUrls, setLocalFileUrls] = useState<Map<string, string>>(new Map());
  const token = useAuthStore((s) => s.token);
  const attachAuth = useCallback(
    (url: string) => {
      if (!token) return url;
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}token=${encodeURIComponent(token)}`;
    },
    [token],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localUrlRef = useRef<Map<string, string>>(new Map());
  const invalidatedFileIdsRef = useRef<Set<string>>(new Set());
  const reduceMotion = useReducedMotion();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mentionMembers = useMemo(
    () =>
      (space.members ?? []).map((m) => ({
        id: m.id,
        username: m.username,
        displayName: m.name ?? null,
      })),
    [space.members],
  );

  const [cursorPosition, setCursorPosition] = useState(0);
  const [isMentionOpen, setIsMentionOpen] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const { isMentioning, query, replaceMention, setCursorPosition: setMentionCursor } = useMention(draft);

  useEffect(() => {
    setMentionCursor(cursorPosition);
  }, [cursorPosition, setMentionCursor]);

  useEffect(() => {
    if (isMentioning) {
      setIsMentionOpen(true);
    } else {
      setIsMentionOpen(false);
    }
  }, [isMentioning]);

  const handleMentionSelect = useCallback(
    (user: { id: string; username: string; displayName: string | null }) => {
      const newDraft = replaceMention(user.username);
      setDraft(newDraft);
      setIsMentionOpen(false);
    },
    [replaceMention],
  );

  const { data, error, isLoading } = useQuery({
    queryKey: ["spaces", spaceId, "channels", channel?.id, "messages"],
    queryFn: () => getChannelMessages(spaceId, channel?.id ?? ""),
    enabled: Boolean(channel?.id),
  });
  const { messages: realtimeMessages, addMessage } = useChatMessages(spaceId, channel?.id ?? null);

  const { data: allStorageFiles } = useQuery({
    queryKey: ["spaces", spaceId, "storage", "all"],
    queryFn: async () => {
      const root = await getSpaceStorage(spaceId);
      const folders = root.folders ?? [];
      if (folders.length === 0) return root.files;
      const folderContents = await Promise.all(
        folders.map((f) => getFolderContents(spaceId, f.id)),
      );
      const files = [...root.files];
      for (const fc of folderContents) {
        files.push(...fc.files);
      }
      return files;
    },
    enabled: Boolean(channel?.id),
    staleTime: 0,
  });

  const fileUrlMap: Map<string, string> = useMemo(() => {
    const map = new Map<string, string>();
    if (allStorageFiles) {
      for (const file of allStorageFiles) {
        map.set(file.id, file.downloadUrl);
      }
    }
    return map;
  }, [allStorageFiles]);

  const initialMessages: ChatMessage[] = useMemo(
    () => (data?.data ?? []).map((m) => normalizeChatMessage(m as unknown as Record<string, unknown>)).filter((m) => !m.isDeleted),
    [data?.data],
  );

  const normalizedRealtimeMessages = useMemo(
    () => realtimeMessages.map((m) => normalizeChatMessage(m as unknown as Record<string, unknown>)),
    [realtimeMessages],
  );

  const mergedMessages = useMemo(() => {
    if (!normalizedRealtimeMessages.length) return initialMessages.toReversed();
    const seen = new Set<string>();
    return [...normalizedRealtimeMessages, ...initialMessages]
      .filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return !m.isDeleted;
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }, [initialMessages, realtimeMessages]);

  const sendMutation = useMutation({
    mutationFn: (payload: { text: string; files?: File[]; mentionedUserIds?: string[] }) =>
      sendChannelMessage(spaceId, channel?.id ?? "", {
        text: payload.text,
        parentId: null,
        files: payload.files,
        mentionedUserIds: payload.mentionedUserIds,
      }),
    onSuccess: async (rawMessage, variables) => {
      const newMessage = normalizeChatMessage(rawMessage as unknown as Record<string, unknown>);
      setDraft("");
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (newMessage.attachments.length > 0 && variables.files) {
        const newLocalUrls = new Map(localFileUrls);
        for (let i = 0; i < newMessage.attachments.length && i < variables.files.length; i++) {
          const fileId = newMessage.attachments[i].fileId;
          if (fileId) {
            newLocalUrls.set(fileId, URL.createObjectURL(variables.files[i]));
            cacheFileAsDataUrl(fileId, variables.files[i]).catch(() => {});
          }
        }
        localUrlRef.current = newLocalUrls;
        setLocalFileUrls(newLocalUrls);
      }
      addMessage(newMessage);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["spaces", spaceId, "channels", channel?.id, "messages"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["spaces", spaceId, "storage", "all"],
        }),
      ]);
    },
    onError: (sendError) => {
      toast.error(
        sendError instanceof Error ? sendError.message : "Unable to send message.",
      );
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load messages.",
      );
    }
  }, [error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mergedMessages.length]);

  useEffect(() => {
    if (!realtimeMessages.length) return;
    const latestMsg = realtimeMessages[realtimeMessages.length - 1];
    if (!latestMsg.attachments?.length) return;
    if (invalidatedFileIdsRef.current.has(latestMsg.id)) return;
    invalidatedFileIdsRef.current.add(latestMsg.id);
    queryClient.invalidateQueries({
      queryKey: ["spaces", spaceId, "storage", "all"],
    });
  }, [realtimeMessages, spaceId, queryClient]);

  useEffect(() => {
    if (!realtimeMessages.length || !channel) return;
    const latestMsg = realtimeMessages[realtimeMessages.length - 1];
    if (!latestMsg.attachments?.length) return;
    for (const att of latestMsg.attachments) {
      const fileId = att.fileId;
      if (!fileId) continue;
      const fId: string = fileId;
      if (invalidatedFileIdsRef.current.has(`fetch_${fId}`)) continue;
      Promise.resolve().then(async () => {
        try {
          const proxyUrl = `/api/backend-files/api/files/${fId}`;
          const headers: Record<string, string> = {};
          if (token) headers.Authorization = `Bearer ${token}`;
          const res = await fetch(proxyUrl, { headers });
          if (!res.ok) return;
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          setLocalFileUrls((prev) => new Map(prev).set(fId, blobUrl));
        } catch {
          // file not downloadable by id — expected for chat attachments
        }
      });
      invalidatedFileIdsRef.current.add(`fetch_${fId}`);
    }
  }, [realtimeMessages, spaceId, channel, token]);

  useEffect(() => {
    return () => {
      localUrlRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const sendMessage = () => {
    if (!channel) return;

    const body = draft.trim();

    if (!body && selectedFiles.length === 0) {
      return;
    }

    const mentionedUserIds = mentionMembers
      .filter((m) => {
        const pattern = new RegExp(`(^|\\s)@${m.username}(\\s|$)`);
        return pattern.test(body);
      })
      .map((m) => m.id);

    sendMutation.mutate({
      text: body || "\u200B",
      files: selectedFiles.length > 0 ? selectedFiles : undefined,
      ...(mentionedUserIds.length > 0 ? { mentionedUserIds } : {}),
    });
  };

  const displayMessages = mergedMessages;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-lg border",
        className,
      )}
    >
      <div className="flex items-center gap-2 bg-primary/50 p-5">
        <div
          className={cn(
            getCategoryGradientClass(space.category),
            "aspect-square w-10 rounded-xl",
          )}
        />
        <div>
          <h1 className="font-semibold">#{channel?.name ?? "No channel"}</h1>
          <p className="text-sm text-muted-foreground">
            {channel?.description ?? "Space discussion"}
          </p>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {!channel ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="font-medium">No channel selected</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create or select a channel to start chatting.
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : displayMessages.length ? (
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
            {displayMessages.map((message, index) => (
              <motion.div
                key={message.id}
                className="flex items-start gap-3"
                variants={staggerItem}
                custom={index}
                initial={reduceMotion ? false : staggerItem.initial}
                animate={reduceMotion ? undefined : staggerItem.animate}
                transition={staggerItem.transition}
              >
                <Avatar className="mt-1">
                  {message.sender.avatarUrl && (
                    <AvatarImage src={message.sender.avatarUrl} alt={message.sender.username} />
                  )}
                  <AvatarFallback>
                    {getInitials(message.sender.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 rounded-lg bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      @{message.sender.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {message.text && message.text !== "\u200B" && (
                    <p className="break-words text-sm">
                      {renderMessageText(message.text, message.mentions)}
                    </p>
                  )}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.attachments.map((attachment) => {
                        const rawUrl = attachment.url
                          ?? (attachment.fileId ? (fileUrlMap.get(attachment.fileId) ?? localFileUrls.get(attachment.fileId) ?? getCachedDataUrl(attachment.fileId) ?? null) : null);
                        if (!rawUrl) {
                          return (
                            <div key={attachment.id} className="flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1 text-xs border opacity-60">
                              <File className="size-3.5 shrink-0" />
                              <span className="max-w-[200px] truncate">{attachment.fileName}</span>
                            </div>
                          );
                        }
                        const isLocalUrl = rawUrl.startsWith("blob:") || rawUrl.startsWith("data:");
                        const proxyUrl = isLocalUrl ? rawUrl : (resolveBackendMediaUrl(rawUrl) ?? rawUrl);
                        const authedUrl = isLocalUrl ? proxyUrl : attachAuth(proxyUrl);
                        const mime = (attachment.mimeType ?? "").toLowerCase();
                        const isImage = mime.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(attachment.fileName);
                        return isImage ? (
                          <a key={attachment.id} href={authedUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border">
                            <img src={authedUrl} alt={attachment.fileName} className="max-h-60 max-w-full object-cover" />
                          </a>
                        ) : (
                          <a key={attachment.id} href={authedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1 text-xs border hover:bg-accent">
                            <File className="size-3.5 shrink-0" />
                            <span className="max-w-[200px] truncate">{attachment.fileName}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="font-medium">No messages yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start the conversation in #{channel.name}.
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          {selectedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs border"
                >
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-muted-foreground hover:text-foreground cursor-pointer font-bold text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div ref={inputContainerRef} className="relative flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setSelectedFiles((prev) => [
                    ...prev,
                    ...Array.from(e.target.files!),
                  ]);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!channel || sendMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip />
              <span className="sr-only">Attach files</span>
            </Button>
            <div className="relative flex-1">
              <MentionAutocomplete
                members={mentionMembers}
                query={query}
                isOpen={isMentionOpen}
                onSelect={handleMentionSelect}
                onClose={() => setIsMentionOpen(false)}
                containerRef={inputContainerRef}
              />
              <Input
                value={draft}
                disabled={!channel || sendMutation.isPending}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setCursorPosition(event.target.selectionStart ?? 0);
                }}
                onSelect={(event) => {
                  setCursorPosition(
                    (event.target as HTMLInputElement).selectionStart ?? 0,
                  );
                }}
                onKeyDown={(event) => {
                  if (isMentionOpen) {
                    if (
                      event.key === "ArrowDown" ||
                      event.key === "ArrowUp" ||
                      event.key === "Escape"
                    ) {
                      return;
                    }
                    if (event.key === "Enter" && !event.shiftKey) {
                      return;
                    }
                  }
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  channel ? `Message #${channel.name}...` : "Select a channel"
                }
              />
            </div>
            <Button
              type="button"
              size="icon"
              disabled={(!draft.trim() && selectedFiles.length === 0) || !channel || sendMutation.isPending}
              onClick={sendMessage}
            >
              <Send />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
