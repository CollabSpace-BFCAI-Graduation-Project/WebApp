import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavorite } from "../services";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces", "infinite"] });
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });
};
