import type { Space } from "@/lib/types/api-types";

export type SpacePrivacySource = {
  privacy?: string | null;
  spacePrivacy?: string | null;
};

/** API uses `privacy` on list/detail and `spacePrivacy` on create responses. */
export function getSpacePrivacy(space: SpacePrivacySource): string {
  const rawSpace = space as SpacePrivacySource & Record<string, unknown>;
  const raw =
    space.privacy ??
    space.spacePrivacy ??
    rawSpace.Privacy ??
    rawSpace.SpacePrivacy ??
    "";

  return String(raw).trim();
}

export function isSpaceMember(space: Space, userId?: string | null) {
  if (!userId) {
    return false;
  }

  return (
    space.isOwner ||
    space.owner?.id === userId ||
    (space.members ?? []).some((member) => member.id === userId)
  );
}

export function isPublicSpace(space: SpacePrivacySource) {
  return getSpacePrivacy(space).toLowerCase() === "public";
}

export function isPrivateSpace(space: SpacePrivacySource) {
  return getSpacePrivacy(space).toLowerCase() === "private";
}

/** API: join-requests POST is only for public spaces. */
export function canSubmitJoinRequest(space: SpacePrivacySource) {
  return isPublicSpace(space);
}

export function isJoinRequestApproved(status: string) {
  return status.toLowerCase() === "approved";
}

export function isJoinRequestPending(status: string) {
  return status.toLowerCase() === "pending";
}
