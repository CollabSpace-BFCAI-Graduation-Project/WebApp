"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronLeft, ShieldAlert } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSpaceById } from "@/features/spaces/services";
import { useAuthStore } from "@/store/auth-store";
import { isSpaceMember } from "../../space-membership";
import { isAtLeastAdmin } from "../../permissions";
import { InviteCodeManager } from "./InviteCodeManager";
import { MembersManager } from "./MembersManager";
import { ThumbnailManager } from "./ThumbnailManager";

interface SpaceSettingsPageClientProps {
  spaceId: string;
}

export function SpaceSettingsPageClient({ spaceId }: SpaceSettingsPageClientProps) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data, isLoading, error } = useQuery({
    queryKey: ["spaces", spaceId, "details"],
    queryFn: () => getSpaceById(spaceId),
    retry: 0,
  });

  const space = data;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 rounded-xl" />
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

  // space is guaranteed to be defined here; compute membership after guards
  const owner = space.owner;
  const currentMember =
    owner?.id === currentUserId
      ? ({ baseRole: "Owner" as const } as const)
      : (space.members ?? []).find((m) => m.id === currentUserId);

  const isActor = isSpaceMember(space, currentUserId) && !!currentMember;
  const canManage = isAtLeastAdmin(currentMember);

  if (!isActor || !canManage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md rounded-xl border bg-card p-8 text-center">
          <ShieldAlert className="mx-auto size-8 text-muted-foreground" />
          <h1 className="mt-3 text-xl font-semibold">Admins only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to be an Owner or Admin of this space to manage its settings.
          </p>
          <Link
            href={`/spaces/${spaceId}`}
            className={`${buttonVariants({ variant: "outline" })} mt-4`}
          >
            Back to space
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Link
          href={`/spaces/${spaceId}`}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ChevronLeft />
          Back to {space.name}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Space settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage {space.name}&apos;s appearance, invites, and members.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <div className="rounded-xl border bg-card p-5">
            <ThumbnailManager space={space} spaceId={spaceId} />
          </div>
        </TabsContent>

        <TabsContent value="invites" className="mt-4">
          <div className="rounded-xl border bg-card p-5">
            <InviteCodeManager spaceId={spaceId} />
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <div className="rounded-xl border bg-card p-5">
            <MembersManager space={space} spaceId={spaceId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
