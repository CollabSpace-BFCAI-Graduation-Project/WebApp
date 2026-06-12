import { useEffect, useMemo } from "react";
import { useInfiniteQuery, useQueries, useQueryClient } from "@tanstack/react-query";

import { getSpaceById, getSpaces } from "../services";
import { isPrivateSpace } from "../space-membership";
import {
  applyPrivacyOverride,
  syncSpacePrivacyInCache,
} from "../space-privacy-sync";

const PAGE_SIZE = 12;

export const useGetSpaces = () => {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: ["spaces", "infinite"],
    queryFn: ({ pageParam }) => getSpaces(pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;
      const { pageNumber, totalPages } = lastPage.meta;
      return pageNumber < totalPages ? pageNumber + 1 : undefined;
    },
  });

  const spaces = useMemo(
    () =>
      (query.data?.pages.flatMap((page) => page?.data ?? []) ?? []).map(
        applyPrivacyOverride,
      ),
    [query.data?.pages],
  );

  const ownedMislabeledSpaceIds = useMemo(
    () =>
      spaces
        .filter((space) => space.isOwner && isPrivateSpace(space))
        .map((space) => space.id),
    [spaces],
  );

  const privacyReconciliation = useQueries({
    queries: ownedMislabeledSpaceIds.map((spaceId) => ({
      queryKey: ["spaces", spaceId, "privacy-reconcile"],
      queryFn: () => getSpaceById(spaceId),
      staleTime: 60_000,
    })),
  });

  const reconciledSpaces = useMemo(() => {
    const corrections = new Map<string, string>();

    privacyReconciliation.forEach((result, index) => {
      if (result.data?.privacy) {
        corrections.set(ownedMislabeledSpaceIds[index], result.data.privacy);
      }
    });

    return spaces.map((space) => {
      const correctedPrivacy = corrections.get(space.id);
      if (!correctedPrivacy || correctedPrivacy === space.privacy) {
        return space;
      }

      return { ...space, privacy: correctedPrivacy };
    });
  }, [ownedMislabeledSpaceIds, privacyReconciliation, spaces]);

  useEffect(() => {
    privacyReconciliation.forEach((result, index) => {
      const spaceId = ownedMislabeledSpaceIds[index];
      const detailPrivacy = result.data?.privacy;
      const listSpace = spaces.find((space) => space.id === spaceId);

      if (detailPrivacy && listSpace && detailPrivacy !== listSpace.privacy) {
        syncSpacePrivacyInCache(queryClient, spaceId, detailPrivacy);
      }
    });
  }, [ownedMislabeledSpaceIds, privacyReconciliation, queryClient, spaces]);

  return {
    ...query,
    spaces: reconciledSpaces,
  };
};
