import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useThemeColor } from "@/contexts/Theme";
import { ThemeColor } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ThemeColorToggle() {
  const { themeColor, setThemeColor,resolvedTheme } = useThemeColor();

  const themeColors = {
    default: { dark: "oklch(0.922 0 0)", light: "oklch(0.205 0 0)" },
    claude: { dark: "#d97757", light: "#c96442" },
    ocean: { dark: "#34d399", light: "#22c55e" },
    amethyst: { dark: "#a995c9", light: "#8a79ab" },
    clymorphism: { dark: "#818cf8", light: "#6366f1" },
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
