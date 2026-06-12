import { useQueryState, parseAsString } from "nuqs";

export const useSearch = () => {
  return useQueryState("search", parseAsString.withDefault(""));
};
