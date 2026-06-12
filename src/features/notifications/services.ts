import { api } from "@/lib/api-client";
import type {
  CursorResponse,
  DirectInvite,
  MessageResponse,
  Notification,
  PagedResponse,
  UnreadCount,
} from "@/lib/types/api-types";

function normalizePaged<T>(response: PagedResponse<T> & Record<string, unknown>) {
  const data = (response.data ?? response.Data ?? []) as T[];
  const meta = response.meta ?? response.Meta;

  return meta ? { data, meta } : { data };
}

function normalizeCursor<T>(response: CursorResponse<T> & Record<string, unknown>) {
  const data = (response.data ?? response.Data ?? []) as T[];
  const meta = response.meta ?? response.Meta;

  return meta ? { data, meta } : { data };
}

function normalizeNotification(
  notification: Notification & Record<string, unknown>,
): Notification {
  return {
    id: String(notification.id ?? notification.Id ?? ""),
    title: String(notification.title ?? notification.Title ?? ""),
    body: String(notification.body ?? notification.Body ?? ""),
    type: String(notification.type ?? notification.Type ?? ""),
    relatedEntityType: (notification.relatedEntityType ??
      notification.RelatedEntityType ??
      null) as string | null,
    relatedEntityId: (notification.relatedEntityId ??
      notification.RelatedEntityId ??
      null) as string | null,
    isRead: Boolean(notification.isRead ?? notification.IsRead ?? false),
    createdAt: String(notification.createdAt ?? notification.CreatedAt ?? ""),
  };
}

function normalizeDirectInvite(
  invite: DirectInvite & Record<string, unknown>,
): DirectInvite {
  const inviter = (invite.inviter ?? invite.Inviter ?? {}) as unknown as Record<
    string,
    unknown
  >;
  const invitedUser = (invite.invitedUser ?? invite.InvitedUser ?? {}) as unknown as Record<
    string,
    unknown
  >;

  return {
    id: String(invite.id ?? invite.Id ?? ""),
    inviter: {
      id: String(inviter.id ?? inviter.Id ?? ""),
      username: String(inviter.username ?? inviter.Username ?? ""),
      displayName: (inviter.displayName ?? inviter.DisplayName ?? null) as
        | string
        | null,
      avatarUrl: (inviter.avatarUrl ?? inviter.AvatarUrl ?? null) as
        | string
        | null,
    },
    invitedUser: {
      id: String(invitedUser.id ?? invitedUser.Id ?? ""),
      username: String(invitedUser.username ?? invitedUser.Username ?? ""),
      displayName: (invitedUser.displayName ?? invitedUser.DisplayName ?? null) as
        | string
        | null,
      avatarUrl: (invitedUser.avatarUrl ?? invitedUser.AvatarUrl ?? null) as
        | string
        | null,
    },
    spaceId: String(invite.spaceId ?? invite.SpaceId ?? ""),
    spaceName: String(invite.spaceName ?? invite.SpaceName ?? ""),
    status: String(invite.status ?? invite.Status ?? ""),
    createdAt: String(invite.createdAt ?? invite.CreatedAt ?? ""),
    respondedAt: (invite.respondedAt ?? invite.RespondedAt ?? null) as
      | string
      | null,
  };
}

export const getNotifications = async (limit = 50) => {
  const response = await api.get("/notifications", { params: { limit } });
  const normalized = normalizeCursor<Record<string, unknown>>(
    response as CursorResponse<Record<string, unknown>> & Record<string, unknown>,
  );

  return {
    ...normalized,
    data: normalized.data.map((item) =>
      normalizeNotification(item as Notification & Record<string, unknown>),
    ),
  };
};

export const getUnreadNotificationCount = async () => {
  const response = await api.get<UnreadCount & Record<string, unknown>>(
    "/notifications/unread-count",
  );

  return {
    count: Number(response.count ?? response.Count ?? 0),
  };
};

export const markNotificationAsRead = (notificationId: string) =>
  api.put<MessageResponse>(`/notifications/${notificationId}/read`);

export const markAllNotificationsAsRead = () =>
  api.put<MessageResponse>("/notifications/read-all");

export const getDirectInvites = async (page = 1, pageSize = 50) => {
  const response = await api.get("/spaces/my-direct-invites", {
    params: { Page: page, PageSize: pageSize },
  });
  const normalized = normalizePaged<Record<string, unknown>>(
    response as PagedResponse<Record<string, unknown>> & Record<string, unknown>,
  );

  return {
    ...normalized,
    data: normalized.data.map((item) =>
      normalizeDirectInvite(item as DirectInvite & Record<string, unknown>),
    ),
  };
};

export const respondToDirectInvite = (inviteId: string, accept: boolean) =>
  api.put<MessageResponse>(`/spaces/invites/direct/${inviteId}/respond`, {
    accept,
  });

export const findSpaceForChannel = async (channelId: string): Promise<string | null> => {
  try {
    const { getSpaces, getSpaceChannels } = await import("@/features/spaces/services");
    let page = 1;
    const pageSize = 50;

    while (true) {
      const spacesRes = await getSpaces(page, pageSize);
      const spaces = spacesRes.data ?? [];
      console.log("[fsc] page", page, "spaces count", spaces.length);
      if (spaces.length === 0) break;

      for (const space of spaces) {
        try {
          const channelsRes = await getSpaceChannels(space.id, 1, 100);
          const channels = channelsRes.data ?? [];
          console.log("[fsc] space", space.id, space.name, "channels", channels.length);
          if (channels.some((ch) => ch.id === channelId)) {
            console.log("[fsc] FOUND channel in space", space.id, space.name);
            return space.id;
          }
        } catch (err) {
          console.error("[fsc] error getting channels for", space.id, err);
          continue;
        }
      }

      if (spaces.length < pageSize) break;
      page++;
    }
  } catch (err) {
    console.error("[fsc] top-level error", err);
    return null;
  }
  console.log("[fsc] channel not found", channelId);
  return null;
};

export const findSpaceForMessage = async (
  messageId: string,
): Promise<{ spaceId: string; channelId: string } | null> => {
  try {
    const { getSpaces, getSpaceChannels } = await import("@/features/spaces/services");
    let page = 1;
    const pageSize = 50;

    while (true) {
      const spacesRes = await getSpaces(page, pageSize);
      const spaces = spacesRes.data ?? [];
      if (spaces.length === 0) break;

      for (const space of spaces) {
        try {
          const channelsRes = await getSpaceChannels(space.id, 1, 100);
          const channels = channelsRes.data ?? [];

          for (const channel of channels) {
            try {
              const msgRes = await api.get<{ data: Record<string, unknown>[] }>(
                `/spaces/${space.id}/channels/${channel.id}/messages?limit=50`,
              );
              const messages = msgRes.data ?? [];
              const found = messages.some(
                (m) => (m.id ?? m.Id) === messageId,
              );
              if (found) {
                console.log("[fsm] FOUND message in space", space.id, "channel", channel.id);
                return { spaceId: space.id, channelId: channel.id };
              }
            } catch {
              continue;
            }
          }
        } catch {
          continue;
        }
      }

      if (spaces.length < pageSize) break;
      page++;
    }
  } catch (err) {
    console.error("[fsm] top-level error", err);
    return null;
  }
  console.log("[fsm] message not found", messageId);
  return null;
};
