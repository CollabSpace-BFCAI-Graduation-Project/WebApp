import { useQueryState, parseAsStringLiteral } from "nuqs";

export const useCategory = () => {
  return useQueryState(
    "category",
    parseAsStringLiteral([
      "all-categories",
      "creative",
      "tech",
      "meeting",
      "education",
    ]).withDefault("all-categories"),
  );
};
