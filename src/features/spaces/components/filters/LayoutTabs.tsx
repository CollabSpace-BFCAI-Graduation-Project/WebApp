import { TooltippedButton } from "@/components/shared/tooltippedButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpacesLayout } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface LayoutTabsProps {
  layout: SpacesLayout;
  setLayout: Dispatch<SetStateAction<SpacesLayout>>;
  className?: string;
}

export function LayoutTabs({ layout, setLayout, className }: LayoutTabsProps) {
  const handleValueChange = (value: string) => {
    setLayout(value as SpacesLayout);
    console.log(value);
  };
  return (
    <Tabs
      value={layout}
      onValueChange={handleValueChange}
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
                layout === "grid" && "scale-[1.1]",
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
                layout === "list" && "scale-[1.1]",
              )}
            />
          </TooltippedButton>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
