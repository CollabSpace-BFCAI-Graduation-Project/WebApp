import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterTab } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function FilterTabs({ className }: { className?: string }) {
  const [value, setValue] = useState<FilterTab>("all");
  const handleValueChange = (value: string) => {
    setValue(value as FilterTab);
    console.log(value);
  };
  return (
    <Tabs value={value} onValueChange={handleValueChange} className={className}>
      <TabsList className="w-full">
        <TabsTrigger
          value="all"
          className={cn(
            "transition-all duration-500 ease-in-out",
            value === "all" && "bg-primary! text-primary-foreground!",
          )}
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="favorites"
          className={cn(
            "transition-all duration-500 ease-in-out",
            value === "favorites" && "bg-primary! text-primary-foreground!",
          )}
        >
          Favorites
        </TabsTrigger>
        <TabsTrigger
          value="owned"
          className={cn(
            "transition-all duration-500 ease-in-out",
            value === "owned" && "bg-primary! text-primary-foreground!",
          )}
        >
          Owned
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
