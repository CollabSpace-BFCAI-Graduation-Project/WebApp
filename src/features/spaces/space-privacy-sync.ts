import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import type { PagedResponse, Space } from "@/lib/types/api-types";

const PRIVACY_OVERRIDES_KEY = "collabspace-space-privacy-overrides";

type PrivacyOverrides = Record<string, string>;

function readPrivacyOverrides(): PrivacyOverrides {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(
      window.sessionStorage.getItem(PRIVACY_OVERRIDES_KEY) ?? "{}",
    ) as PrivacyOverrides;
  } catch {
    return {};
  }
}

export function getPrivacyOverride(spaceId: string): string | undefined {
  return readPrivacyOverrides()[spaceId];
}

export function setPrivacyOverride(spaceId: string, privacy: string) {
  if (typeof window === "undefined") {
    return;
  }

  const overrides = readPrivacyOverrides();
  overrides[spaceId] = privacy;
  window.sessionStorage.setItem(PRIVACY_OVERRIDES_KEY, JSON.stringify(overrides));
}

export function applyPrivacyOverride<T extends { id: string; privacy: string }>(
  space: T,
): T {
  const override = getPrivacyOverride(space.id);
  if (!override || override === space.privacy) {
    return space;
  }

  return { ...space, privacy: override };
}

/** Keep list/public query caches aligned with authoritative detail privacy. */
export function syncSpacePrivacyInCache(
  queryClient: QueryClient,
  spaceId: string,
  privacy: string,
) {
  setPrivacyOverride(spaceId, privacy);

  queryClient.setQueryData<InfiniteData<PagedResponse<Space>>>(
    ["spaces", "infinite"],
    (current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          data: (page.data ?? []).map((space) =>
            space.id === spaceId ? { ...space, privacy } : space,
          ),
        })),
      };
    },
  );

  queryClient.setQueriesData<PagedResponse<Space>>(
    { queryKey: ["spaces", "public"] },
    (current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        data: (current.data ?? []).map((space) =>
          space.id === spaceId ? { ...space, privacy } : space,
        ),
      };
    },
  );
}
