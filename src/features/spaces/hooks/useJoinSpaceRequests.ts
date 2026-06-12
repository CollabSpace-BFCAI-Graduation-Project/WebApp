import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitJoinRequest, getMyJoinRequests, cancelJoinRequest } from "../services";

export function useSubmitJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, message }: { spaceId: string; message?: string }) =>
      submitJoinRequest(spaceId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-join-requests"] });
    },
  });
}

export function useGetMyJoinRequests() {
  return useQuery({
    queryKey: ["my-join-requests"],
    queryFn: () => getMyJoinRequests(1, 100),
  });
}

export function useCancelJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => cancelJoinRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-join-requests"] });
    },
  });
}
