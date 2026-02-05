"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export const SearchInput = () => {
  const [value, setValue] = useState("");

  const handleValueChange = (value: string) => {
    setValue(value);
    console.log(value);
  };

  return (
    <div className="relative w-full lg:min-w-[200px]">
      <Search className="absolute left-2 top-2.5 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search spaces..."
        className="pl-8"
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
      />
    </div>
  );
};
