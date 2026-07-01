import type { MemberDto, Space } from "@/lib/types/api-types";

/**
 * Role-Based Access Control helpers.
 *
 * The backend distinguishes a member's `baseRole` ("Owner", "Admin", "Member")
 * from any extra `roles[]` assigned to them. Each role carries a set of
 * `permissions` (PermissionDefinition with a `key`). These helpers translate
 * that into simple booleans the UI can gate on.
 */

export const BASE_ROLES = ["Owner", "Admin", "Member"] as const;
export type BaseRole = (typeof BASE_ROLES)[number];

/** Rank used to compare seniority (higher = more privileged). */
const ROLE_RANK: Record<string, number> = {
  Owner: 3,
  Admin: 2,
  Member: 1,
};

/** Find the membership row for a user within a space. */
export function getCurrentMember(
  space: Pick<Space, "owner" | "members">,
  userId?: string | null,
): MemberDto | undefined {
  if (!userId) return undefined;
  const owner = space.owner;
  if (owner?.id === userId) {
    return {
      ...owner,
      baseRole: "Owner",
      roles: [],
      joinedAt: owner.joinedAt ?? "",
    };
  }
  return (space.members ?? []).find((m) => m.id === userId);
}

export function getBaseRole(member?: Pick<MemberDto, "baseRole"> | null): string {
  return (member?.baseRole ?? "Member").trim() || "Member";
}

export function isOwner(member?: Pick<MemberDto, "baseRole"> | null): boolean {
  return getBaseRole(member) === "Owner";
}

export function isAdmin(member?: Pick<MemberDto, "baseRole"> | null): boolean {
  return getBaseRole(member) === "Admin";
}

export function isAtLeastAdmin(
  member?: Pick<MemberDto, "baseRole"> | null,
): boolean {
  return ROLE_RANK[getBaseRole(member)] >= ROLE_RANK["Admin"];
}

export function isAtLeastOwner(
  member?: Pick<MemberDto, "baseRole"> | null,
): boolean {
  return ROLE_RANK[getBaseRole(member)] >= ROLE_RANK["Owner"];
}

/** Numeric seniority so we can prevent acting on users of equal/higher rank. */
export function roleRank(member?: Pick<MemberDto, "baseRole"> | null): number {
  return ROLE_RANK[getBaseRole(member)] ?? ROLE_RANK["Member"];
}

/** Whether a member holds a given permission key via any of their roles. */
export function hasPermission(
  member: Pick<MemberDto, "roles" | "baseRole"> | null | undefined,
  permissionKey: string,
): boolean {
  if (!member) return false;
  if (isOwner(member)) return true;
  if (isAdmin(member)) return true;
  return (member.roles ?? []).some((role) =>
    (role.permissions ?? []).some((p) => p.key === permissionKey),
  );
}

/** Can the actor manage other members (change roles, remove)? Owner or Admin. */
export function canManageMembers(
  member?: Pick<MemberDto, "baseRole"> | null,
): boolean {
  return isAtLeastAdmin(member);
}

/**
 * Can `actor` modify the membership of `target`?
 * Rule: actor must outrank target, and cannot touch someone of equal-or-higher rank.
 */
export function canModifyMember(
  actor: Pick<MemberDto, "baseRole"> | null | undefined,
  target: Pick<MemberDto, "baseRole"> | null | undefined,
): boolean {
  if (!actor) return false;
  if (isOwner(target)) return false; // never touch the owner
  if (!isAtLeastAdmin(actor)) return false;
  return roleRank(actor) > roleRank(target);
}

/** Can the actor remove `target` from the space? */
export function canRemoveMember(
  actor: Pick<MemberDto, "baseRole"> | null | undefined,
  target: Pick<MemberDto, "baseRole"> | null | undefined,
): boolean {
  return canModifyMember(actor, target);
}

/** Base roles that the actor is allowed to assign to someone else. */
export function assignableRoles(
  actor: Pick<MemberDto, "baseRole"> | null | undefined,
): BaseRole[] {
  if (!actor) return [];
  if (isOwner(actor)) return ["Admin", "Member"];
  if (isAdmin(actor)) return ["Member"];
  return [];
}
