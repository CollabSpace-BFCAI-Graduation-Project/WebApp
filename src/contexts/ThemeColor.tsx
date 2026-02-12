"use client";

import { ThemeColor } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeColorContext = createContext<{
  themeColor: ThemeColor;
  setThemeColor: (themeColor: ThemeColor) => void;
}>({
  themeColor: "default",
  setThemeColor: () => {},
});

export const ThemeColorProvider = ({
  children,
  initialThemeColor,
}: {
  children: React.ReactNode;
  initialThemeColor: ThemeColor;
}) => {
  const [themeColor, setThemeColor] = useState<ThemeColor>(initialThemeColor);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeColor);

    document.cookie = `themeColor=${themeColor}; path=/; max-age=31536000; sameSite=lax`;
  }, [themeColor]);

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
};

export const useThemeColor = () => {
  const context = useContext(ThemeColorContext);
  if (!context) {
    throw new Error("useThemeColor must be used within a ThemeColorProvider");
  }
  return context;
};
