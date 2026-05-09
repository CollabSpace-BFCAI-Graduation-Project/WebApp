import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FilterTab } from "../../types";
import { useTab } from "../../hooks/useTab";

export function FilterTabs({ className }: { className?: string }) {
  const [tab, setTab] = useTab();

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as FilterTab)}
      className={className}
    >
      <TabsList className="w-full">
        <TabsTrigger
          value="all"
          className={cn(
            "transition-all duration-500 ease-in-out",
            tab === "all" && "bg-primary! text-primary-foreground!",
          )}
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="favorites"
          className={cn(
            "transition-all duration-500 ease-in-out",
            tab === "favorites" && "bg-primary! text-primary-foreground!",
          )}
        >
          Favorites
        </TabsTrigger>
        <TabsTrigger
          value="owned"
          className={cn(
            "transition-all duration-500 ease-in-out",
            tab === "owned" && "bg-primary! text-primary-foreground!",
          )}
        >
          Owned
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
