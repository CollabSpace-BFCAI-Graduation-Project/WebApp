import { useQueryState } from "nuqs";

export const useSearch = () => {
  return useQueryState("search", { defaultValue: "" });
};
