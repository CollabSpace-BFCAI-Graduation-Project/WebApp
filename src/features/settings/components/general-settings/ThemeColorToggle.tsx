import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useThemeColor } from "@/context/Theme";
import { ThemeColor } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ThemeColorToggle() {
  const { themeColor, setThemeColor, resolvedTheme } = useThemeColor();

  const themeColors = {
    slack: {
      dark: "oklch(0.58 0.14 327.21)",
      light: "oklch(0.37 0.14 323.4)",
    },
    caffeine: {
      dark: "oklch(0.92 0.05 67.14)",
      light: "oklch(0.43 0.04 42.00)",
    },
    "ghibli-studio": {
      dark: "oklch(0.64 0.05 114.58)",
      light: "oklch(0.71 0.10 111.96)",
    },
    valorant: {
      dark: "oklch(0.67 0.22 21.22)",
      light: "oklch(0.67 0.22 21.22)",
    },
    perplexity: {
      dark: "oklch(0.72 0.12 210.36)",
      light: "oklch(0.72 0.12 210.36)",
    },
  };

  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      spacing={2}
      value={themeColor}
      onValueChange={(value) => value && setThemeColor(value as ThemeColor)}
    >
      {Object.entries(themeColors).map(([key, colors]) => (
        <ToggleGroupItem
          key={key}
          value={key}
          aria-label={`Toggle ${key}`}
          className={cn(
            "rounded-full overflow-hidden h-5 w-5 p-0 cursor-pointer transition-all",
            themeColor === key ? "scale-[1.25]" : "hover:scale-110",
          )}
        >
          <span
            className="w-full h-full"
            style={{
              backgroundColor:
                colors[resolvedTheme === "dark" ? "dark" : "light"],
            }}
          ></span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
