import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      spacing={2}
      value={theme}
      onValueChange={(value) => value && setTheme(value)}
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
