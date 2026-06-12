import type { DirectInvite, Notification } from "@/lib/types/api-types";
function normalizeText(value?: string | null) {
  return (value ?? "").toLowerCase();
}

/** Notifications the current user can accept or decline (pending direct invite to them). */
export function isActionableDirectInviteNotification(notification: Notification) {
  const title = normalizeText(notification.title);
  const body = normalizeText(notification.body);

  if (
    title.includes("accepted") ||
    title.includes("declined") ||
    title.includes("new member") ||
    title.includes("joined") ||
    body.includes("accepted your") ||
    body.includes("declined your") ||
    body.includes("joined space")
  ) {
    return false;
  }

  return isDirectInviteNotification(notification);
}

export function isDirectInviteNotification(notification: Notification) {
  const type = normalizeText(notification.type);
  const title = normalizeText(notification.title);
  const body = normalizeText(notification.body);
  const relatedEntityType = normalizeText(notification.relatedEntityType);

  if (
    relatedEntityType.includes("directinvite") ||
    relatedEntityType.includes("direct_invite")
  ) {
    return true;
  }

  if (
    relatedEntityType.includes("joinrequest") ||
    type.includes("joinrequest") ||
    type.includes("join_request")
  ) {
    return false;
  }

  return (
    type.includes("directinvite") ||
    type.includes("direct_invite") ||
    type.includes("spaceinvite") ||
    type.includes("space_invite") ||
    (type.includes("invite") && !type.includes("join")) ||
    title.includes("invitation") ||
    title.includes("invited you") ||
    body.includes("invited you to") ||
    (relatedEntityType.includes("invite") && !relatedEntityType.includes("join"))
  );
}

/** Notifications about join requests that the current user (as space admin) can accept or decline. */
export function isActionableJoinRequestNotification(notification: Notification) {
  const title = normalizeText(notification.title);
  const body = normalizeText(notification.body);
  const type = normalizeText(notification.type);

  if (
    title.includes("accepted") ||
    title.includes("approved") ||
    title.includes("rejected") ||
    title.includes("declined") ||
    body.includes("accepted") ||
    body.includes("approved") ||
    body.includes("rejected") ||
    body.includes("declined") ||
    body.includes("has been")
  ) {
    return false;
  }

  return (
    type.includes("joinrequest") ||
    type.includes("join_request")
  );
}

export function resolveDirectInviteId(
  notification: Notification,
  directInvites: DirectInvite[],
): string | null {
  const pendingInvites = directInvites.filter(
    (invite) => invite.status.toLowerCase() === "pending",
  );

  if (!pendingInvites.length) {
    return null;
  }

  if (notification.relatedEntityId) {
    const byInviteId = pendingInvites.find(
      (invite) => invite.id === notification.relatedEntityId,
    );

    if (byInviteId) {
      return byInviteId.id;
    }

    const bySpaceId = pendingInvites.find(
      (invite) => invite.spaceId === notification.relatedEntityId,
    );

    if (bySpaceId) {
      return bySpaceId.id;
    }
  }

  if (!isActionableDirectInviteNotification(notification)) {
    return null;
  }

  const body = normalizeText(notification.body);
  const bySpaceName = pendingInvites.find((invite) =>
    body.includes(normalizeText(invite.spaceName)),
  );

  if (bySpaceName) {
    return bySpaceName.id;
  }

  return null;
}

export function getPendingInvitesWithoutNotification(
  notifications: Notification[],
  directInvites: DirectInvite[],
) {
  const pendingInvites = directInvites.filter(
    (invite) => invite.status.toLowerCase() === "pending",
  );

  return pendingInvites.filter(
    (invite) =>
      !notifications.some(
        (notification) =>
          resolveDirectInviteId(notification, directInvites) === invite.id,
      ),
  );
}

