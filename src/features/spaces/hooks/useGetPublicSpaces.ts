import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicSpaces } from "../services";
import { useAuthStore } from "@/store/auth-store";
import type { Space } from "@/lib/types/api-types";
import { isSpaceMember } from "../space-membership";

export function useGetPublicSpaces(q?: string) {
  const { user } = useAuthStore();

  return useInfiniteQuery({
    queryKey: ["spaces", "public", q],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getPublicSpaces(pageParam, 12, q);
      // Filter out spaces where the current user is already a member or owner
      if (user) {
        response.data = response.data.filter(
          (space: Space) => !isSpaceMember(space, user.id)
        );
      }
      return response;
    },
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (!meta) return undefined;
      return meta.pageNumber < meta.totalPages
        ? meta.pageNumber + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}
