"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeColor } from "@/lib/types/types";

interface ThemeColorContextType {
  themeColor: ThemeColor;
  setThemeColor: (themeColor: ThemeColor) => void;
}

interface ThemeProviderProps extends React.ComponentProps<
  typeof NextThemesProvider
> {
  initialThemeColor: ThemeColor;
}

const ThemeColorContext = createContext<ThemeColorContextType | null>(null);

export function ThemeProvider({
  initialThemeColor,
  children,
  ...props
}: ThemeProviderProps) {
  const [themeColor, setThemeColor] = useState<ThemeColor>(initialThemeColor);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeColor);

    document.cookie = `themeColor=${themeColor}; path=/; max-age=31536000; sameSite=lax`;
  }, [themeColor]);
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem
      defaultTheme="dark"
      disableTransitionOnChange
      {...props}
    >
      <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
        {children}
      </ThemeColorContext.Provider>
    </NextThemesProvider>
  );
}

export const useThemeColor = () => {
  const themeColorContext = useContext(ThemeColorContext);
  const themeContext = useTheme();
  if (!themeColorContext) {
    throw new Error("useThemeColor must be used within a ThemeProvider");
  }
  return { ...themeContext, ...themeColorContext };
};
