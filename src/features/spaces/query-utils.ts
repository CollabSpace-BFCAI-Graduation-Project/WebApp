import type { QueryClient } from "@tanstack/react-query";

export async function refetchUserSpaces(queryClient: QueryClient) {
  await queryClient.resetQueries({ queryKey: ["spaces", "infinite"] });
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["spaces"] }),
    queryClient.invalidateQueries({ queryKey: ["spaces", "chat-list"] }),
    queryClient.invalidateQueries({ queryKey: ["spaces", "team-list"] }),
  ]);
}
