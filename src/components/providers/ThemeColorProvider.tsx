"use client";

import { ThemeColorContext } from "@/contexts/themeColorContext";
import { ThemeColor } from "@/lib/types";
import { useEffect, useState } from "react";

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
