import { useQueryState, parseAsStringLiteral } from "nuqs";

export const useTab = () => {
  return useQueryState(
    "tab",
    parseAsStringLiteral(["all", "favorites", "owned"]).withDefault("all"),
  );
};
