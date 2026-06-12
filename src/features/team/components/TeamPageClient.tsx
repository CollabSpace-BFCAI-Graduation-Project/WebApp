"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, Search, UserRoundCheck } from "lucide-react";
import { useQueryState } from "nuqs";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageMotion } from "@/components/shared/PageMotion";
import { UsersIcon } from "@/components/ui/users";
import { getInitials } from "@/features/spaces/components/space-details/space-utils";
import { getPublicProfiles, getSpaces, getUserProfileById } from "@/features/spaces/services";
import type { Profile } from "@/lib/types/api-types";
import { cn } from "@/lib/utils";
import { listItemVariants, staggerContainer, staggerItem } from "@/lib/animations";

type TeamMember = Profile & { spaces: string[]; ownedSpaces: string[]; joinedAt?: string };

const PROFILES_PAGE_SIZE = 50;
const SPACES_PAGE_SIZE = 50;

export const TeamPageClient = () => {
  const [searchQuery, setSearchQuery] = useQueryState("search", { defaultValue: "" });
  const [selectedMemberId, setSelectedMemberId] = useQueryState("member");
  const [profilesPage, setProfilesPage] = useState(1);
  const [spacesPage, setSpacesPage] = useState(1);

  const {
    data: profilesResult,
    error: profilesError,
    isLoading: profilesLoading,
  } = useQuery({
    queryKey: ["profiles", "team", profilesPage],
    queryFn: () => getPublicProfiles(undefined, profilesPage, PROFILES_PAGE_SIZE),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: spacesResult,
    error: spacesError,
    isLoading: spacesLoading,
  } = useQuery({
    queryKey: ["spaces", "team-list", spacesPage],
    queryFn: () => getSpaces(1, SPACES_PAGE_SIZE),
  });

  const isLoading = profilesLoading || spacesLoading;

  const profilesHasMore = profilesResult?.meta
    ? profilesResult.meta.pageNumber < profilesResult.meta.totalPages
    : false;

  const spacesHasMore = spacesResult?.meta
    ? spacesResult.meta.pageNumber < spacesResult.meta.totalPages
    : false;

  const profilesMap = useMemo(() => {
    const map = new Map<string, Profile>();
    (profilesResult?.data ?? []).forEach((profile) => map.set(profile.id, profile));
    return map;
  }, [profilesResult?.data]);

  const allMemberIds = useMemo(() => {
    const ids = new Set<string>();
    (spacesResult?.data ?? []).forEach((space) => {
      if (space.owner?.id) ids.add(space.owner.id);
      (space.members ?? []).forEach((m) => ids.add(m.id));
    });
    return ids;
  }, [spacesResult?.data]);

  const missingProfileIds = useMemo(
    () => Array.from(allMemberIds).filter((id) => !profilesMap.has(id)),
    [allMemberIds, profilesMap],
  );

  const individualProfileQueries = useQueries({
    queries: missingProfileIds.map((id) => ({
      queryKey: ["profile-by-id", id],
      queryFn: () => getUserProfileById(id),
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  const augmentedProfilesMap = useMemo(() => {
    if (missingProfileIds.length === 0) return profilesMap;
    const map = new Map(profilesMap);
    individualProfileQueries.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });
    return map;
  }, [profilesMap, individualProfileQueries, missingProfileIds.length]);

  const allMembers = useMemo(() => {
    const memberById = new Map<string, TeamMember>();
    const spacesList = spacesResult?.data ?? [];

    const upsertMember = (source: { id: string; name: string; username: string; email?: string | null; joinedAt?: string | null }, isOwner: boolean, spaceName: string) => {
      const existing = memberById.get(source.id);
      if (existing) {
        if (isOwner) {
          if (!existing.ownedSpaces.includes(spaceName)) {
            existing.ownedSpaces.push(spaceName);
          }
        } else {
          if (!existing.spaces.includes(spaceName)) {
            existing.spaces.push(spaceName);
          }
        }
        return;
      }

      const profile = augmentedProfilesMap.get(source.id);
      if (!profile || profile.privacy === "private") return;

      memberById.set(source.id, {
        id: source.id,
        username: source.username,
        email: profile.email,
        name: source.name,
        bio: profile.bio ?? null,
        avatarColor: profile.avatarColor ?? null,
        avatarImage: profile.avatarImage ?? null,
        privacy: profile.privacy,
        showEmail: profile.showEmail,
        joinedAt: source.joinedAt ?? undefined,
        spaces: isOwner ? [] : [spaceName],
        ownedSpaces: isOwner ? [spaceName] : [],
      });
    };

    spacesList.forEach((space) => {
      const spaceName = space.name ?? "Untitled space";

      const ownerId = space.owner?.id;

      if (ownerId) {
        upsertMember(space.owner, true, spaceName);
      }

      (space.members ?? []).forEach((member) => {
        const isOwner = member.id === ownerId || member.baseRole?.toLowerCase() === "owner";
        upsertMember(member, isOwner, spaceName);
      });
    });

    return Array.from(memberById.values()).sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }, [spacesResult?.data, augmentedProfilesMap]);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (!normalizedSearch) {
      return allMembers;
    }

    return allMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(normalizedSearch) ||
        member.username.toLowerCase().includes(normalizedSearch),
    );
  }, [allMembers, searchQuery]);

  const selectedMember = useMemo(() => {
    return (
      filteredMembers.find((member) => member.id === selectedMemberId) ??
      filteredMembers[0] ??
      null
    );
  }, [filteredMembers, selectedMemberId]);

  useEffect(() => {
    const error = profilesError || spacesError;
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load team members.",
      );
    }
  }, [profilesError, spacesError]);

  return (
    <PageMotion className="space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="flex items-center gap-2 text-3xl font-extrabold">
          <UsersIcon className="size-7 text-primary" />
          Team Directory
        </h1>
        <p className="text-muted-foreground">
          Find and review people you collaborate with across your spaces.
        </p>
      </header>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by name or @username..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(260px,380px)_1fr]">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      ) : filteredMembers.length ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(260px,380px)_1fr]">
          <motion.div
            className="max-h-[calc(100dvh-14rem)] space-y-3 overflow-y-auto pr-1"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredMembers.map((member, index) => (
              <motion.button
                type="button"
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary/50 hover:bg-accent",
                  selectedMember?.id === member.id &&
                    "border-primary/60 bg-accent",
                )}
                variants={listItemVariants}
                custom={index}
                initial={listItemVariants.initial as any}
                animate={listItemVariants.animate as any}
                exit={listItemVariants.exit as any}
                transition={listItemVariants.transition as any}
                whileHover={{ scale: 1.01 } as any}
                whileTap={{ scale: 0.99 } as any}
              >
                <Avatar>
                  {member.avatarImage && <AvatarImage src={member.avatarImage} alt={member.name} />}
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">{member.name}</h2>
                  <p className="truncate text-sm text-muted-foreground">
                    @{member.username}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="truncate text-xs text-muted-foreground">
                      {member.ownedSpaces.length > 0
                        ? `${member.ownedSpaces.length} ${member.ownedSpaces.length === 1 ? "space" : "spaces"}`
                        : `${member.spaces.length} ${member.spaces.length === 1 ? "space" : "spaces"}`}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
          <div className="space-y-6">
            {profilesHasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProfilesPage((p) => p + 1)}
                  disabled={profilesLoading}
                >
                  Load more profiles
                </Button>
              </div>
            )}

            {selectedMember && (
            <article
              key={selectedMember.id}
              className="h-fit rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <Avatar className="size-20">
                  {selectedMember.avatarImage && <AvatarImage src={selectedMember.avatarImage} alt={selectedMember.name} />}
                  <AvatarFallback className="text-xl">
                    {getInitials(selectedMember.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-2xl font-semibold">
                      {selectedMember.name}
                    </h2>
                  </div>
                  <p className="text-muted-foreground">
                    @{selectedMember.username}
                  </p>
                  {selectedMember.email && selectedMember.showEmail && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedMember.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <UserRoundCheck className="size-4 text-primary" />
                    Shared Spaces
                  </div>
                  <p className="mt-2 text-2xl font-semibold">
                    {selectedMember.spaces.length}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CalendarDays className="size-4 text-primary" />
                    Joined
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedMember.joinedAt
                      ? new Date(selectedMember.joinedAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold">Spaces</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Map([
                      ...selectedMember.ownedSpaces.map(name => [name, 'Owner'] as const),
                      ...selectedMember.spaces.map(name => [name, 'Member'] as const),
                    ]),
                  )
                    .filter(([name]) => name)
                    .sort(([, roleA]) => (roleA === 'Owner' ? -1 : 1))
                    .map(([name, role], index) => (
                      <Badge key={`${name}-${index}`} variant="outline" className="gap-1.5">
                        {name}
                        <span className="rounded-sm bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {role}
                        </span>
                      </Badge>
                    ))}
                </div>
              </div>
            </article>
          )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">No teammates found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or join a space with more members.
          </p>
        </div>
      )}
    </PageMotion>
  );
};
