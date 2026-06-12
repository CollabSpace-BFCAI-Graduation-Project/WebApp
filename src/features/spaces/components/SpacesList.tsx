"use client";

import { useEffect, useRef, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Space } from "@/lib/types/api-types";
import { cn } from "@/lib/utils";

import { useCategory } from "../hooks/useCategory";
import { useSearch } from "../hooks/useSearch";
import { useSort } from "../hooks/useSort";
import { useStatus } from "../hooks/useStatus";
import { useTab } from "../hooks/useTab";
import { useView } from "../hooks/useView";
import { EmptySpaces } from "./EmptySpaces";
import { getSpaceSessions, getSpaceMembers } from "../services";
import { normalizeCategory, isSpaceSessionActive, resolveSpaceMemberCount } from "./space-details/space-utils";
import { useGetSpaces } from "../hooks/useGetSpaces";
import { SpaceCard } from "./SpaceCard";
import { useQueries } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export function SpacesList() {
  const { spaces, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetSpaces();

  const [search] = useSearch();
  const [category] = useCategory();
  const [tab] = useTab();
  const [sort] = useSort();
  const [status] = useStatus();
  const [view] = useView();

  // Sentinel ref for IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const memberCountQueries = useQueries({
    queries: spaces.map((space) => ({
      queryKey: ["spaces", space.id, "member-count"],
      queryFn: () => getSpaceMembers(space.id, 1, 1),
      enabled: !!space.id,
      staleTime: 1000 * 60,
    })),
  });

  const spaceMemberCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    spaces.forEach((space, index) => {
      const query = memberCountQueries[index];
      const totalRecords = query?.data?.meta?.totalRecords;
      map[space.id] = resolveSpaceMemberCount(space, totalRecords);
    });
    return map;
  }, [spaces, memberCountQueries]);

  const sessionQueries = useQueries({
    queries: spaces.map((space) => ({
      queryKey: ["spaces", space.id, "sessions"],
      queryFn: () => getSpaceSessions(space.id),
      enabled: !!space.id,
      staleTime: 1000 * 30,
    })),
  });

  const spaceOnlineStatusMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    spaces.forEach((space, index) => {
      const query = sessionQueries[index];
      const sessions = query?.data?.data ?? [];
      const hasActiveSession = sessions.some(isSpaceSessionActive);
      map[space.id] = hasActiveSession;
    });
    return map;
  }, [spaces, sessionQueries]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-4",
          view === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-58 rounded-xl" />
        ))}
      </div>
    );
  }

  const normalizedSearch = search.trim().toLowerCase();
  const visibleSpaces = spaces
    .filter((space) => {
      const normalizedSpaceCategory = normalizeCategory(space.category ?? "");
      const name = space.name ?? "";
      const description = space.description ?? "";
      const matchesSearch =
        !normalizedSearch ||
        name.toLowerCase().includes(normalizedSearch) ||
        description.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        category === "all-categories" || normalizedSpaceCategory === category;
      const matchesTab =
        tab === "all" ||
        (tab === "favorites" && space.isFavorite) ||
        (tab === "owned" && space.isOwner);
      const isOnline = !!spaceOnlineStatusMap[space.id];
      const spaceStatus = isOnline ? "online" : "offline";
      const matchesStatus = status === "any-status" || status === spaceStatus;

      return matchesSearch && matchesCategory && matchesTab && matchesStatus;
    })
    .sort((first, second) => {
      switch (sort) {
        case "oldest-first":
          return (
            new Date(first.createdAt).getTime() -
            new Date(second.createdAt).getTime()
          );
        case "name-asc":
          return (first.name ?? "").localeCompare(second.name ?? "");
        case "name-desc":
          return (second.name ?? "").localeCompare(first.name ?? "");
        case "by-category":
          return normalizeCategory(first.category ?? "").localeCompare(
            normalizeCategory(second.category ?? ""),
          );
        case "newest-first":
        default:
          return (
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime()
          );
      }
    });

  if (!visibleSpaces.length && !isFetchingNextPage) {
    return <EmptySpaces />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "grid gap-4",
          view === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
        )}
      >
        {visibleSpaces.map((space: Space) => {
          const isOnline = !!spaceOnlineStatusMap[space.id];
          return <SpaceCard space={space} key={space.id} isOnline={isOnline} memberCount={spaceMemberCountMap[space.id]} />;
        })}

        {/* Skeleton cards while fetching next page, keeps grid layout intact */}
        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`skeleton-${index}`} className="h-58 rounded-xl" />
          ))}
      </div>

      {/* Invisible sentinel — triggers next page fetch when scrolled into view */}
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

      {/* Spinner shown below grid while loading more */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        </div>
      )}
    </div>
  );
}
