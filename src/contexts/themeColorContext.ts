import { createContext } from "react";
import { ThemeColor } from "@/lib/types";

export const ThemeColorContext = createContext<{
  themeColor: ThemeColor;
  setThemeColor: (themeColor: ThemeColor) => void;
}>({
  themeColor: "default",
  setThemeColor: () => {},
});
