import { useQueryState } from "nuqs";

export const useActiveChannel = (defaultValue: string) => {
  return useQueryState("channel", {
    defaultValue,
    clearOnDefault: false,
  });
};
