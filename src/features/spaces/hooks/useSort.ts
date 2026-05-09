import { useQueryState, parseAsStringLiteral } from "nuqs";

export const useSort = () => {
  return useQueryState(
    "sort",
    parseAsStringLiteral([
      "newest-first",
      "oldest-first",
      "name-asc",
      "name-desc",
      "by-category",
    ]).withDefault("newest-first"),
  );
};
