import { ThemeColorContext } from "@/contexts/themeColorContext";
import { useContext } from "react";

export const useThemeColor = () => {
  const context = useContext(ThemeColorContext);
  if (!context) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider");
  }
  return context;
};
