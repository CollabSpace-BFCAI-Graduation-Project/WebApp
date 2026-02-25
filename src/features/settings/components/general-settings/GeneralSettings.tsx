import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeColorToggle } from "./ThemeColorToggle";

export function GeneralSettings() {
  return (
    <Card className="w-full h-full overflow-y-auto pt-4">
      <CardHeader className="space-y-2 sr-only">
        <CardTitle className="text-lg font-bold">General</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="border border-muted-foreground rounded-xl p-4 flex flex-col gap-4">
          <h3 className="font-semibold">Theme</h3>
          <ThemeToggle />
          <p className="text-sm text-muted-foreground">
            Changes apply immediately across the app
          </p>
        </div>
        <div className="border border-muted-foreground rounded-xl p-4 flex flex-col gap-4">
          <h3 className="font-semibold">Theme Color</h3>
          <ThemeColorToggle />
          <p className="text-sm text-primary">
            Changes apply immediately across the app
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
