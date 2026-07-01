"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, Hourglass, ArrowRight } from "lucide-react";

import { PageMotion } from "@/components/shared/PageMotion";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StorageContents } from "@/lib/types/api-types";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { useSignalR } from "@/hooks/useSignalR";

import {
  createInviteCode,
  getSpaceById,
  getSpaceStorage,
  joinSpace,
  joinSpaceWithCode,
} from "../../services";
import {
  useSubmitJoinRequest,
  useGetMyJoinRequests,
} from "../../hooks/useJoinSpaceRequests";
import { useJoinSpaceViaCode } from "../../hooks/useJoinViaCode";
import { useTab } from "../../hooks/useTab";
import { parseInviteInput } from "../../invite-input";
import { refetchUserSpaces } from "../../query-utils";
import {
  canSubmitJoinRequest,
  isJoinRequestPending,
  isPublicSpace,
  isSpaceMember,
} from "../../space-membership";
import { isAtLeastAdmin } from "../../permissions";
import { syncSpacePrivacyInCache } from "../../space-privacy-sync";
import { SpaceAboutSidebar } from "./SpaceAboutSidebar";
import { SpaceActions } from "./SpaceActions";
import { SpaceHeader } from "./SpaceHeader";
import { SpaceMembersSidebar } from "./SpaceMembersSidebar";
import { SharedFilesSection } from "./SharedFilesSection";

interface SpaceDetailsPageClientProps {
  spaceId: string;
}

const emptyStorage: StorageContents = {
  folders: [],
  files: [],
  links: [],
};

export function SpaceDetailsPageClient({
  spaceId,
}: SpaceDetailsPageClientProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const inviteCode = searchParams.get("invite");
  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["spaces", spaceId, "details", inviteCode ?? "none"],
    queryFn: async () => {
      const spaceResponse = await getSpaceById(spaceId);
      let storageResponse = emptyStorage;

      const isMember = spaceResponse ? isSpaceMember(spaceResponse, currentUserId) : false;
      if (isMember) {
        try {
          storageResponse = await getSpaceStorage(spaceId);
        } catch (storageError) {
          console.error("Failed to fetch space storage:", storageError);
        }
      }

      return {
        space: spaceResponse,
        storage: storageResponse,
      };
    },
    retry: 0,
  });

  // Auto-join when arriving via an invite link (?invite=CODE).
  // We track whether we've already attempted so the effect doesn't re-fire.
  const hasAttemptedInviteJoin = useRef(false);
  useEffect(() => {
    if (!inviteCode || hasAttemptedInviteJoin.current) return;
    hasAttemptedInviteJoin.current = true;

    joinSpaceWithCode(inviteCode)
      .then(() => refetchUserSpaces(queryClient))
      .catch(() => {
        // Errors are handled by the error + inviteCode useEffect below.
      });
  }, [inviteCode, queryClient]);
  const space = data?.space;
  const storage = data?.storage ?? emptyStorage;
  const isMember = space ? isSpaceMember(space, currentUserId) : false;
  const canRequestJoin = !!space && !isMember && canSubmitJoinRequest(space);

  // Resolve the current user's role within this space to gate management UI.
  const currentMemberRole = space
    ? (() => {
        if (space.owner?.id === currentUserId) return "Owner";
        return (
          (space.members ?? []).find((m) => m.id === currentUserId)?.baseRole ??
          (space.isOwner ? "Owner" : "Member")
        );
      })()
    : undefined;
  const canManage = isAtLeastAdmin(currentMemberRole ? { baseRole: currentMemberRole } : null);

  const { data: joinRequestsData } = useGetMyJoinRequests();

  const hasPendingRequest =
    !!space &&
    (joinRequestsData?.data ?? []).some(
      (r) => r.spaceId === space.id && isJoinRequestPending(r.status),
    );

  const effectiveCanRequestJoin = canRequestJoin && !hasPendingRequest;

  const [inviteCodeVal, setInviteCodeVal] = useState("");
  const [inviteCodeError, setInviteCodeError] = useState<string | null>(null);
  const [, setTab] = useTab();
  const { mutate: joinWithCodeMutation, isPending: isJoiningWithCode } = useJoinSpaceViaCode();

  const handleJoinViaCode = () => {
    setInviteCodeError(null);
    const parsedInvite = parseInviteInput(inviteCodeVal);

    if (!parsedInvite?.inviteCode) {
      setInviteCodeError("Enter an invite code or paste an invite link.");
      return;
    }

    joinWithCodeMutation(parsedInvite.inviteCode, {
      onSuccess: async (response) => {
        toast.success(response.message || "Joined space.");
        await Promise.all([
          setTab("all"),
          refetchUserSpaces(queryClient),
          queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "details"] }),
        ]);
        setInviteCodeVal("");
      },
      onError: (error) => {
        setInviteCodeError(
          error instanceof Error
            ? error.message
            : "Invalid or expired invite code."
        );
      },
    });
  };
  const { joinSpaceGroup, leaveSpaceGroup, on, off, connectionState } = useSignalR();
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (connectionState !== "connected") return;
    joinSpaceGroup(spaceId);
    return () => { leaveSpaceGroup(spaceId); };
  }, [spaceId, connectionState, joinSpaceGroup, leaveSpaceGroup]);

  useEffect(() => {
    if (connectionState !== "connected" || !isMember) return;
    const handler = (notification: import("@/lib/types/api-types").Notification) => {
      addNotification(notification);
      toast(notification.title, {
        description: notification.body,
      });
    };
    on("ReceiveNotification", handler);
    return () => { off("ReceiveNotification"); };
  }, [connectionState, isMember, on, off, addNotification]);
  const joinMutation = useMutation({
    mutationFn: () => joinSpace(spaceId),
    onSuccess: (session) => {
      toast.success(`3D session ready. Join code: ${session.code}`);
      queryClient.invalidateQueries({ queryKey: ["spaces", spaceId] });
    },
    onError: (joinError) => {
      toast.error(
        joinError instanceof Error
          ? joinError.message
          : "Unable to open the 3D space.",
      );
    },
  });
  const inviteMutation = useMutation({
    mutationFn: () => createInviteCode(spaceId),
    onSuccess: async (invite) => {
      const inviteUrl = `${window.location.origin}/spaces/${spaceId}?invite=${invite.code}`;

      await navigator.clipboard?.writeText(inviteUrl);
      toast.success("Invite link copied to clipboard.");
    },
    onError: (inviteError) => {
      toast.error(
        inviteError instanceof Error
          ? inviteError.message
          : "Unable to create an invite link.",
      );
    },
  });
  const { mutate: submitJoinRequestMutation, isPending: isRequestingJoin } = useSubmitJoinRequest();
  const requestJoinMutation = {
    mutate: () => submitJoinRequestMutation(
      { spaceId },
      {
        onSuccess: async () => {
          toast.success("Join request submitted. An admin will review it.");
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["spaces"] }),
            queryClient.invalidateQueries({ queryKey: ["spaces", "infinite"] }),
            queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "details"] }),
          ]);
        },
        onError: (joinError) => {
          toast.error(
            joinError instanceof Error
              ? joinError.message
              : "Unable to submit a join request for this space.",
          );
        },
      }
    ),
    isPending: isRequestingJoin,
  };



  useEffect(() => {
    if (error && !inviteCode) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load this space.",
      );
    }
  }, [error, inviteCode]);

  useEffect(() => {
    if (!space?.privacy) {
      return;
    }

    syncSpacePrivacyInCache(queryClient, spaceId, space.privacy);
  }, [queryClient, space?.privacy, spaceId]);

  useEffect(() => {
    if (inviteCode && error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to join this space with that invite link.",
      );
      router.replace(`/spaces/${spaceId}`);
    }
  }, [error, inviteCode, router, spaceId]);

  useEffect(() => {
    if (inviteCode && space && !error) {
      router.replace(`/spaces/${spaceId}`);
    }
  }, [inviteCode, space, error, router, spaceId]);

  const isJoiningViaLink = !!inviteCode && isFetching && !space;

  if (isLoading || isJoiningViaLink) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-56 rounded-xl" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-72 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md rounded-xl border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">Space unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "This space could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageMotion className="space-y-6 p-6">
      <SpaceHeader space={space} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="space-y-6">
          {isMember ? (
            <SpaceActions
              spaceId={space.id}
              isMember={isMember}
              canRequestJoin={effectiveCanRequestJoin}
              hasPendingRequest={hasPendingRequest}
              isPublicSpace={isPublicSpace(space)}
              isJoining={joinMutation.isPending}
              isRequestingJoin={requestJoinMutation.isPending}
              isInviting={inviteMutation.isPending}
              canManage={canManage}
              onJoin={() => joinMutation.mutate()}
              onRequestJoin={() => requestJoinMutation.mutate()}
              onInvite={() => inviteMutation.mutate()}
            />
          ) : (
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <UserPlus className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Join this Space</h3>
                  <p className="text-sm text-muted-foreground">
                    You are not a member of this space yet. Choose how you want to join.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-2">
                {/* Option 1: Request to Join */}
                <div className="border rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">Join via Request</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submit a join request to the space owner. You will gain access once they approve it.
                    </p>
                  </div>
                  <div>
                    {hasPendingRequest ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-1.5 text-sm text-amber-600 font-semibold h-9">
                          <Hourglass className="size-4 animate-pulse" />
                          Pending Approval
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => requestJoinMutation.mutate()}
                        disabled={requestJoinMutation.isPending}
                      >
                        <UserPlus className="size-4 mr-1.5" />
                        {requestJoinMutation.isPending ? "Requesting..." : "Request to Join"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Option 2: Join with Invite Code */}
                <div className="border rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">Join with Invite Code</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      If you have an invite code or link, enter it below to join the space immediately.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={inviteCodeVal}
                        onChange={(e) => {
                          setInviteCodeVal(e.target.value);
                          setInviteCodeError(null);
                        }}
                        placeholder="Invite code or link..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleJoinViaCode}
                        disabled={!inviteCodeVal.trim() || isJoiningWithCode}
                      >
                        {isJoiningWithCode ? (
                          <span className="size-4 border-2 border-primary-foreground border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <ArrowRight className="size-4" />
                        )}
                      </Button>
                    </div>
                    {inviteCodeError && (
                      <p className="text-xs text-destructive font-semibold">{inviteCodeError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <SharedFilesSection
            spaceId={space.id}
            storage={storage}
            canManageFiles={isMember}
          />
        </main>

        <aside className="space-y-6">
          <SpaceAboutSidebar space={space} storage={storage} />
          <SpaceMembersSidebar space={space} />
        </aside>
      </div>
    </PageMotion>
  );
}
