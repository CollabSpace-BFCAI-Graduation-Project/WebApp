"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Crown, MoreVertical, ShieldCheck, Trash2, UserCog } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getSpaceMembers,
  removeSpaceMember,
  updateMemberBaseRole,
} from "@/features/spaces/services";
import { useAuthStore } from "@/store/auth-store";
import type { MemberDto, Space } from "@/lib/types/api-types";
import { getInitials } from "../space-details/space-utils";
import {
  assignableRoles,
  canRemoveMember,
  getBaseRole,
  isOwner,
  roleRank,
} from "../../permissions";

interface MembersManagerProps {
  space: Space;
  spaceId: string;
}

export function MembersManager({ space, spaceId }: MembersManagerProps) {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [confirmRemove, setConfirmRemove] = useState<MemberDto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["spaces", spaceId, "members", "managed"],
    queryFn: () => getSpaceMembers(spaceId, 1, 100),
  });

  // The owner may be absent from the paginated members list; include them.
  const members: MemberDto[] = (() => {
    const list = data?.data ?? [];
    if (space.owner && !list.some((m) => m.id === space.owner!.id)) {
      return [
        {
          ...space.owner,
          baseRole: "Owner",
          roles: [],
          joinedAt: space.owner.joinedAt ?? "",
        },
        ...list,
      ];
    }
    return list;
  })();

  const actor = members.find((m) => m.id === currentUserId);

  const updateRoleMutation = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: string;
    }) => updateMemberBaseRole(spaceId, userId, role),
    onSuccess: async () => {
      toast.success("Role updated.");
      await invalidateMembers(queryClient, spaceId);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Unable to update role.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeSpaceMember(spaceId, userId),
    onSuccess: async () => {
      toast.success("Member removed.");
      setConfirmRemove(null);
      await invalidateMembers(queryClient, spaceId);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Unable to remove member.");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No members to display.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Member</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Joined</th>
              <th className="w-10 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                actor={actor}
                isSelf={member.id === currentUserId}
                onRoleChange={(role) =>
                  updateRoleMutation.mutate({ userId: member.id, role })
                }
                onRemove={() => setConfirmRemove(member)}
                pendingRole={updateRoleMutation.isPending}
              />
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!confirmRemove} onOpenChange={(o) => !o && setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove{" "}
              <span className="font-medium text-foreground">
                @{confirmRemove?.username}
              </span>{" "}
              from this space? They will lose access immediately. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={removeMutation.isPending}
              onClick={() =>
                confirmRemove && removeMutation.mutate(confirmRemove.id)
              }
            >
              {removeMutation.isPending ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface MemberRowProps {
  member: MemberDto;
  actor?: MemberDto;
  isSelf: boolean;
  onRoleChange: (role: string) => void;
  onRemove: () => void;
  pendingRole: boolean;
}

function MemberRow({
  member,
  actor,
  isSelf,
  onRoleChange,
  onRemove,
  pendingRole,
}: MemberRowProps) {
  const baseRole = getBaseRole(member);
  const owner = isOwner(member);
  const canAssign = assignableRoles(actor);
  const canRemove = canRemoveMember(actor, member) && !isSelf;

  // Determine which roles this actor may set for this member.
  const allowedRoles = owner
    ? []
    : canAssign.filter((r) => roleRank({ baseRole: r }) < roleRank(actor));

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            {member.avatarImage && (
              <AvatarImage src={member.avatarImage} alt={member.username} />
            )}
            <AvatarFallback className="text-xs">
              {getInitials(member.name || member.username)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              @{member.username}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <RoleBadge baseRole={baseRole} />
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {member.joinedAt
          ? new Date(member.joinedAt).toLocaleDateString()
          : "—"}
      </td>
      <td className="px-4 py-3 text-right">
        {(allowedRoles.length > 0 || canRemove) && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="size-7">
                  <MoreVertical className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {allowedRoles.length > 0 && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Change role</DropdownMenuLabel>
                    {allowedRoles.map((role) => (
                      <DropdownMenuItem
                        key={role}
                        disabled={pendingRole}
                        onClick={() => onRoleChange(role)}
                      >
                        <UserCog className="size-3.5" />
                        Make {role}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  {canRemove && <DropdownMenuSeparator />}
                </>
              )}
              {canRemove && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onRemove}
                >
                  <Trash2 className="size-3.5" />
                  Remove from space
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </td>
    </tr>
  );
}

function RoleBadge({ baseRole }: { baseRole: string }) {
  if (baseRole === "Owner") {
    return (
      <Badge className="gap-1 bg-amber-500/15 text-amber-600">
        <Crown className="size-3" />
        Owner
      </Badge>
    );
  }
  if (baseRole === "Admin") {
    return (
      <Badge className="gap-1 bg-primary/15 text-primary">
        <ShieldCheck className="size-3" />
        Admin
      </Badge>
    );
  }
  return <Badge variant="secondary">Member</Badge>;
}

async function invalidateMembers(
  queryClient: ReturnType<typeof useQueryClient>,
  spaceId: string,
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["spaces", spaceId, "members", "managed"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["spaces", spaceId, "members"],
    }),
    queryClient.invalidateQueries({
      queryKey: ["spaces", spaceId, "details"],
    }),
  ]);
}
