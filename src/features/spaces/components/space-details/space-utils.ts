import type { Space, SpaceSession, User } from "@/lib/types/api-types";
import { cn } from "@/lib/utils";

/** Only sessions explicitly marked active count as "online" on space cards. */
export function isSpaceSessionActive(session: Pick<SpaceSession, "status">) {
  return session.status?.toLowerCase() === "active";
}

/**
 * Members pagination total may exclude the owner row while detail payloads include them.
 * Prefer the paginated total when available and reconcile with embedded members.
 */
export function resolveSpaceMemberCount(
  space: Pick<Space, "owner" | "members">,
  membersApiTotal?: number,
) {
  const embeddedCount = getSpaceMemberCount(space);

  if (typeof membersApiTotal !== "number" || membersApiTotal <= 0) {
    return embeddedCount;
  }

  const ownerId = space.owner?.id;
  const ownerIncludedInEmbedded = ownerId
    ? (space.members ?? []).some((member) => member.id === ownerId)
    : true;

  if (ownerId && !ownerIncludedInEmbedded) {
    return Math.max(membersApiTotal + 1, embeddedCount);
  }

  return Math.max(membersApiTotal, embeddedCount);
}

/** List endpoint often omits the owner from `members`; detail endpoint includes everyone. */
export function getSpaceMemberCount(space: Pick<Space, "owner" | "members">) {
  const members = space.members ?? [];
  const ownerId = space.owner?.id;

  if (!ownerId) {
    return members.length;
  }

  const ownerIncluded = members.some((member) => member.id === ownerId);
  return ownerIncluded ? members.length : members.length + 1;
}

export function getSpaceMembersForDisplay(
  space: Pick<Space, "owner" | "members">,
): User[] {
  const members = space.members ?? [];
  const owner = space.owner;

  if (!owner?.id) {
    return members;
  }

  if (members.some((member) => member.id === owner.id)) {
    return members;
  }

  return [owner, ...members];
}

export const normalizeCategory = (category?: string | number | null) => {
  const normalized = String(category ?? "").toLowerCase().replace(/\s+/g, "-");

  if (normalized === "0" || normalized.includes("creative") || normalized.includes("art")) {
    return "creative";
  }

  if (normalized === "1" || normalized.includes("tech") || normalized.includes("cyber")) {
    return "tech";
  }

  if (normalized === "2" || normalized.includes("meeting") || normalized.includes("lounge")) {
    return "meeting";
  }

  if (normalized === "3" || normalized.includes("education") || normalized.includes("class")) {
    return "education";
  }

  return "creative";
};

export const getCategoryGradientClass = (category?: string | null) => {
  const normalized = normalizeCategory(category);

  return cn(
    normalized === "creative" &&
      "bg-[linear-gradient(135deg,rgb(246,211,101)_0%,rgb(253,160,133)_100%)]",
    normalized === "tech" &&
      "bg-[linear-gradient(135deg,rgb(132,250,176)_0%,rgb(143,211,244)_100%)]",
    normalized === "meeting" &&
      "bg-[linear-gradient(135deg,rgb(255,154,156)_0%,rgb(254,207,239)_100%)]",
    normalized === "education" &&
      "bg-[linear-gradient(135deg,rgb(161,196,253)_0%,rgb(194,233,251)_100%)]",
    !["creative", "tech", "meeting", "education"].includes(normalized) &&
      "bg-[linear-gradient(135deg,rgb(148,163,184)_0%,rgb(71,85,105)_100%)]",
  );
};

export const getInitials = (name?: string | null) => {
  if (!name) return "CS";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return date;
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(parsedDate);
  } catch {
    return date;
  }
};

export const formatLongDate = (date?: string | null) => {
  if (!date) return "N/A";
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return date;
    return new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(parsedDate);
  } catch {
    return date;
  }
};

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** unitIndex).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};
