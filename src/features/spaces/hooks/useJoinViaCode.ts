import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinSpaceWithCode } from "../services";

export function useJoinSpaceViaCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => joinSpaceWithCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });
}
