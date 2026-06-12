import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useThemeColor } from "@/context/Theme";

export function ThemeToggle() {
  const { theme, setTheme } = useThemeColor();
  return (
    <ToggleGroup
      size="sm"
      variant="outline"
      spacing={2}
      value={theme ? [theme] : []}
      onValueChange={(value) => value && setTheme(value[0])}
    >
      <ToggleGroupItem value="system" aria-label="Toggle system">
        System
      </ToggleGroupItem>
      <ToggleGroupItem value="light" aria-label="Toggle light">
        Light
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Toggle dark">
        Dark
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
