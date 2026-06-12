import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useThemeColor } from "@/context/Theme";
import { ThemeColor } from "@/lib/types/types";
import { cn } from "@/lib/utils";

export function ThemeColorToggle() {
  const { themeColor, setThemeColor, resolvedTheme } = useThemeColor();
  const currentTheme = resolvedTheme ?? "light";

  const themeColors = {
    orange: {
      dark: "oklch(0.47 0.157 37.304)",
      light: "oklch(0.553 0.195 38.402)",
    },
    lime: {
      dark: "oklch(0.768 0.233 130.85)",
      light: "oklch(0.841 0.238 128.85)",
    },
    indigo: {
      dark: "oklch(0.398 0.195 277.366)",
      light: "oklch(0.457 0.24 277.023)",
    },
    yellow: {
      dark: "oklch(0.795 0.184 86.047)",
      light: "oklch(0.852 0.199 91.936)",
    },
    purple: {
      dark: "oklch(0.438 0.218 303.724)",
      light: "oklch(0.496 0.265 301.924)",
    },
  };

  return (
    <ToggleGroup
      size="sm"
      variant="outline"
      spacing={2}
      value={[themeColor]}
      onValueChange={(value) => value && setThemeColor(value[0] as ThemeColor)}
    >
      {Object.entries(themeColors).map(([key, color]) => (
        <ToggleGroupItem
          key={key}
          value={key}
          aria-label={`Toggle ${key}`}
          className={cn(
            "rounded-full overflow-hidden h-5 w-5 p-0 cursor-pointer transition-all",
            themeColor === key ? "rounded-sm" : "hover:scale-110",
          )}
        >
          <span
            className="w-full h-full"
            style={{
              backgroundColor: color[currentTheme === "dark" ? "dark" : "light"],
            }}
          />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
