import { useQueryState, parseAsStringLiteral } from "nuqs";

export const useStatus = () => {
  return useQueryState(
    "status",
    parseAsStringLiteral(["any-status", "online", "offline"]).withDefault(
      "any-status",
    ),
  );
};
