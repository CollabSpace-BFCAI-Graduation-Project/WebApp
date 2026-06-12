"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BellIcon } from "@/components/ui/bell";
import { Badge } from "@/components/ui/badge";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { refetchUserSpaces } from "@/features/spaces/query-utils";
import { getSpaceJoinRequests, respondToJoinRequest } from "@/features/spaces/services";
import { useSignalR } from "@/hooks/useSignalR";
import {
  findSpaceForChannel,
  findSpaceForMessage,
  getDirectInvites,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  respondToDirectInvite,
} from "../services";
import {
  isActionableDirectInviteNotification,
  isActionableJoinRequestNotification,
  getPendingInvitesWithoutNotification,
  resolveDirectInviteId,
} from "../invite-utils";

type Notification = import("@/lib/types/api-types").Notification;

const MENTION_TITLE_PATTERN = /mentioned you in (.+?) > #(.+)$/i;

function isMentionNotification(notification: Notification) {
  const type = (notification.type ?? "").toLowerCase();
  const title = (notification.title ?? "").toLowerCase();
  const body = (notification.body ?? "").toLowerCase();
  return (
    type.includes("mention") ||
    type === "new_mention" ||
    title.includes("mentioned") ||
    title.includes("new mention") ||
    body.includes("mentioned you")
  );
}

function parseMentionText(text: string): { spaceName: string; channelName: string } | null {
  const match = text.match(MENTION_TITLE_PATTERN);
  if (!match) return null;
  return { spaceName: match[1].trim(), channelName: match[2].trim() };
}

export function NotificationModal() {
  const queryClient = useQueryClient();
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [respondedInviteIds, setRespondedInviteIds] = useState<Set<string>>(
    () => new Set(),
  );
  const { data: directInvitesResponse } = useQuery({
    queryKey: ["spaces", "direct-invites"],
    queryFn: () => getDirectInvites(),
    refetchInterval: 30_000,
  });
  const directInvites = directInvitesResponse?.data ?? [];
  const {
    data: notificationsResponse,
    error: notificationsError,
    isLoading,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    refetchInterval: 30_000,
  });
  const { data: unreadResponse } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30_000,
  });
  const notifications = notificationsResponse?.data ?? [];
  const activeDirectInvites = directInvites.filter(
    (invite) => !respondedInviteIds.has(invite.id),
  );
  const pendingInvitesWithoutNotification = getPendingInvitesWithoutNotification(
    notifications,
    activeDirectInvites,
  );
  const unreadCount =
    (unreadResponse?.count ??
      notifications.filter((item) => !item.isRead).length) +
    pendingInvitesWithoutNotification.length;
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({
          queryKey: ["notifications", "unread-count"],
        }),
      ]),
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to mark notification as read.",
      );
    },
  });
  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({
          queryKey: ["notifications", "unread-count"],
        }),
      ]),
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to mark notifications as read.",
      );
    },
  });
  const respondInviteMutation = useMutation({
    mutationFn: ({
      inviteId,
      accept,
    }: {
      inviteId: string;
      accept: boolean;
      notificationId: string;
      spaceId?: string;
    }) => respondToDirectInvite(inviteId, accept),
    onMutate: ({ inviteId }) => {
      setRespondedInviteIds((current) => new Set(current).add(inviteId));
    },
    onSuccess: async (response, variables) => {
      toast.success(
        response.message ||
          (variables.accept ? "Invitation accepted." : "Invitation declined."),
      );
      if (variables.notificationId) {
        await markNotificationAsRead(variables.notificationId);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({
          queryKey: ["notifications", "unread-count"],
        }),
        refetchUserSpaces(queryClient),
        queryClient.invalidateQueries({ queryKey: ["spaces", "direct-invites"] }),
      ]);

      if (variables.accept && variables.spaceId) {
        router.push(`/spaces/${variables.spaceId}`);
      }
    },
    onError: (error) => {
      setRespondedInviteIds(() => new Set());
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to respond to this invitation.",
      );
    },
  });

  const [respondedJoinRequestIds, setRespondedJoinRequestIds] = useState<Set<string>>(() => new Set());
  const respondJoinRequestMutation = useMutation({
    mutationFn: async ({
      spaceId,
      notificationId,
      accept,
      notificationBody,
    }: {
      spaceId: string;
      notificationId: string;
      accept: boolean;
      notificationBody: string;
    }) => {
      const { data } = await getSpaceJoinRequests(spaceId, 1, 100);
      const pendingRequests = data ?? [];
      const matchedRequest = pendingRequests.find(
        (req) =>
          notificationBody.toLowerCase().includes(req.user.username.toLowerCase()) ||
          (req.user.displayName &&
            notificationBody.toLowerCase().includes(req.user.displayName.toLowerCase()))
      );

      if (!matchedRequest) {
        throw new Error("Join request not found. It may have been handled already.");
      }

      await respondToJoinRequest(spaceId, matchedRequest.id, accept);
      return { notificationId, spaceId };
    },
    onMutate: ({ notificationId }) => {
      setRespondedJoinRequestIds((current) => new Set(current).add(notificationId));
    },
    onSuccess: async (result, variables) => {
      toast.success(variables.accept ? "Join request accepted." : "Join request declined.");
      await markNotificationAsRead(result.notificationId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] }),
        queryClient.invalidateQueries({ queryKey: ["spaces", result.spaceId, "details"] }),
      ]);
    },
    onError: (error, variables) => {
      setRespondedJoinRequestIds((current) => {
        const next = new Set(current);
        next.delete(variables.notificationId);
        return next;
      });
      toast.error(error instanceof Error ? error.message : "Unable to respond to join request.");
    },
  });

  useEffect(() => {
    if (notificationsError) {
      toast.error(
        notificationsError instanceof Error
          ? notificationsError.message
          : "Unable to load notifications.",
      );
    }
  }, [notificationsError]);

  const navigateByMentionTitle = useCallback(async (notification: Notification) => {
    const parsed = parseMentionText(notification.title ?? "") ?? parseMentionText(notification.body ?? "");
    console.log("[nav] parsed text", parsed);
    if (!parsed) return;

    try {
      const { getSpaces, getSpaceChannels } = await import("@/features/spaces/services");
      const spacesRes = await getSpaces(1, 100);
      console.log("[nav] spaces count", spacesRes.data.length);
      const space = spacesRes.data.find(
        (s) => s.name.toLowerCase() === parsed.spaceName.toLowerCase(),
      );
      console.log("[nav] space found", space?.id, space?.name);
      if (!space) return;

      const channelsRes = await getSpaceChannels(space.id, 1, 100);
      console.log("[nav] channels count", channelsRes.data?.length);
      const channel = channelsRes.data.find(
        (ch) => ch.name.toLowerCase() === parsed.channelName.toLowerCase(),
      );
      console.log("[nav] channel found", channel?.id, channel?.name);
      if (channel) {
        router.push(`/chat/${space.id}?channel=${channel.id}`);
      } else {
        router.push(`/chat/${space.id}`);
      }
    } catch (err) {
      console.error("[nav] error", err);
    }
  }, [router]);

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      console.log("[click] handleNotificationClick", notification.id, notification.title);
      if (!notification.isRead) {
        markReadMutation.mutate(notification.id);
      }
      const isMention = isMentionNotification(notification);
      console.log("[click] isMentionNotification", isMention);
      if (!isMention) return;

      const entityId = notification.relatedEntityId;
      const entityType = notification.relatedEntityType;
      console.log("[click] relatedEntityId", entityId, "entityType", entityType);

      if (entityId) {
        const entityType = (notification.relatedEntityType ?? "").toLowerCase();
        if (entityType === "message") {
          findSpaceForMessage(entityId).then((result) => {
            console.log("[click] findSpaceForMessage result", result);
            if (result) {
              router.push(`/chat/${result.spaceId}?channel=${result.channelId}`);
            } else {
              navigateByMentionTitle(notification);
            }
          });
        } else if (entityType === "channel") {
          findSpaceForChannel(entityId).then((spaceId) => {
            console.log("[click] findSpaceForChannel result", spaceId);
            if (spaceId) {
              router.push(`/chat/${spaceId}?channel=${entityId}`);
            } else {
              navigateByMentionTitle(notification);
            }
          });
        } else {
          navigateByMentionTitle(notification);
        }
      } else {
        navigateByMentionTitle(notification);
      }
    },
    [router, markReadMutation, navigateByMentionTitle, findSpaceForMessage],
  );

  const { on, off, connectionState } = useSignalR();

  const handleRealtimeNotification = useCallback(
    (notification: import("@/lib/types/api-types").Notification) => {
      toast(notification.title, {
        description: notification.body,
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
    [queryClient],
  );

  useEffect(() => {
    if (connectionState !== "connected") return;

    on("ReceiveNotification", handleRealtimeNotification);
    return () => {
      off("ReceiveNotification");
    };
  }, [connectionState, on, off, handleRealtimeNotification]);

  return (
      <Sheet open={open} onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          void Promise.all([
            queryClient.invalidateQueries({ queryKey: ["notifications"] }),
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] }),
            queryClient.invalidateQueries({ queryKey: ["spaces", "direct-invites"] }),
          ]);
        }
      }}>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="
                data-[active=true]:default-theme:bg-foreground/70
                data-[active=true]:default-theme:text-background"
          render={<SheetTrigger />}
        >
          <span className="relative">
            <BellIcon size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-destructive" />
            )}
          </span>
          <span className="group-data-[collapsible=icon]:hidden">
            Notifications
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SheetContent showCloseButton={false} className="flex flex-col">
        <SheetHeader className="bg-primary/50">
          <SheetTitle className="flex items-center gap-2">
            <BellIcon size={18} />
            <span className="text-lg font-bold">Notifications</span>
            {unreadCount > 0 && <Badge variant="secondary">{unreadCount}</Badge>}
          </SheetTitle>
          <SheetDescription>
            Updates from invites, mentions, requests, and system announcements.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center justify-end px-4 pt-4">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!unreadCount || markAllReadMutation.isPending}
            onClick={() => markAllReadMutation.mutate()}
          >
            Mark all read
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : notifications.length || pendingInvitesWithoutNotification.length ? (
            <div className="flex flex-col gap-3">
              {pendingInvitesWithoutNotification.map((invite) => (
                <motion.article
                  key={`invite-${invite.id}`}
                  initial={reduceMotion ? false : ({ opacity: 0, y: 8 } as any)}
                  animate={reduceMotion ? undefined : ({ opacity: 1, y: 0 } as any)}
                  whileHover={reduceMotion ? undefined : ({ y: -2, scale: 1.01 } as any)}
                  transition={{ duration: 0.18, ease: "easeOut" as any }}
                  className="rounded-xl border bg-card p-4 text-left transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        Space invitation
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {invite.inviter.displayName ?? invite.inviter.username}{" "}
                        invited you to join {invite.spaceName}.
                      </p>
                    </div>
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {new Date(invite.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={respondInviteMutation.isPending}
                      onClick={() =>
                        respondInviteMutation.mutate({
                          inviteId: invite.id,
                          notificationId: "",
                          spaceId: invite.spaceId,
                          accept: true,
                        })
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={respondInviteMutation.isPending}
                      onClick={() =>
                        respondInviteMutation.mutate({
                          inviteId: invite.id,
                          notificationId: "",
                          spaceId: invite.spaceId,
                          accept: false,
                        })
                      }
                    >
                      Decline
                    </Button>
                  </div>
                </motion.article>
              ))}
              {notifications.map((notification) => {
                const inviteId = resolveDirectInviteId(
                  notification,
                  activeDirectInvites,
                );
                const directInvite = inviteId
                  ? activeDirectInvites.find((invite) => invite.id === inviteId)
                  : undefined;
                const canRespondToInvite =
                  isActionableDirectInviteNotification(notification) &&
                  inviteId !== null &&
                  directInvite?.status.toLowerCase() === "pending";

                return (
                <motion.div
                  key={notification.id}
                  initial={reduceMotion ? false : ({ opacity: 0, y: 8 } as any)}
                  animate={reduceMotion ? undefined : ({ opacity: 1, y: 0 } as any)}
                  whileHover={reduceMotion ? undefined : ({ y: -2, scale: 1.01 } as any)}
                  transition={{ duration: 0.18, ease: "easeOut" as any }}
                >
                  <article
                    onClick={() => handleNotificationClick(notification)}
                    className="rounded-xl border bg-card p-4 text-left transition-colors cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.body}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {canRespondToInvite ? (
                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={respondInviteMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            respondInviteMutation.mutate({
                              inviteId,
                              notificationId: notification.id,
                              spaceId: directInvite?.spaceId,
                              accept: true,
                            });
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={respondInviteMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            respondInviteMutation.mutate({
                              inviteId,
                              notificationId: notification.id,
                              spaceId: directInvite?.spaceId,
                              accept: false,
                            });
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    ) : isActionableJoinRequestNotification(notification) && notification.relatedEntityId && !respondedJoinRequestIds.has(notification.id) ? (
                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={respondJoinRequestMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            respondJoinRequestMutation.mutate({
                              spaceId: notification.relatedEntityId!,
                              notificationId: notification.id,
                              accept: true,
                              notificationBody: notification.body,
                            });
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={respondJoinRequestMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            respondJoinRequestMutation.mutate({
                              spaceId: notification.relatedEntityId!,
                              notificationId: notification.id,
                              accept: false,
                              notificationBody: notification.body,
                            });
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    ) : null}
                  </article>
                </motion.div>
              )})}
            </div>
          ) : (
            <div className="flex min-h-60 items-center justify-center text-center">
              <div>
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  New invites, mentions, and requests will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
