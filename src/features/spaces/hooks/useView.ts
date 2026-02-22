import { useQueryState, parseAsStringLiteral } from "nuqs";

export const useView = () => {
  return useQueryState(
    "view",
    parseAsStringLiteral(["grid", "list"]).withDefault("grid"),
  );
};
