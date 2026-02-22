import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { useView } from "../../hooks/useView";
import { SpacesLayout } from "../../types";

interface LayoutTabsProps {
  className?: string;
}

export function LayoutTabs({ className }: LayoutTabsProps) {
  const [view, setView] = useView();
  return (
    <Tabs
      value={view}
      onValueChange={(value) => setView(value as SpacesLayout)}
      className={cn(className)}
    >
      <TabsList>
        <TabsTrigger value="grid">
          <TooltippedButton
            tooltip="Grid View"
            variant="outline"
            noButton
            onClick={() => {}}
          >
            <LayoutGrid
              className={cn(
                "transition-all duration-300",
                view === "grid" && "scale-[1.1]",
              )}
            />
          </TooltippedButton>
        </TabsTrigger>
        <TabsTrigger value="list">
          <TooltippedButton
            tooltip="List View"
            variant="outline"
            noButton
            onClick={() => {}}
          >
            <List
              className={cn(
                "transition-all duration-300",
                view === "list" && "scale-[1.1]",
              )}
            />
          </TooltippedButton>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
