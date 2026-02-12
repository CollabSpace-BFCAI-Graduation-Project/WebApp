"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownZa,
  ArrowUpAZ,
  Clock,
  FolderOpen,
  History,
} from "lucide-react";
import { useState } from "react";

const SORTS = {
  "newest-first": {
    label: "Newest First",
    icon: <Clock className="text-primary" />,
  },
  "oldest-first": {
    label: "Oldest First",
    icon: <History className="text-primary" />,
  },
  "name-a-z": {
    label: "Name (A-Z)",
    icon: <ArrowDownZa className="text-primary" />,
  },
  "name-z-a": {
    label: "Name (Z-A)",
    icon: <ArrowUpAZ className="text-primary" />,
  },
  "by-category": {
    label: "By Category",
    icon: <FolderOpen className="text-primary" />,
  },
} as const;

type SortKey = keyof typeof SORTS;

export const SortSelect = () => {
  const [value, setValue] = useState<SortKey>("newest-first");

  const handleValueChange = (value: string) => {
    setValue(value as SortKey);
    console.log(value);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {SORTS[value].icon} {SORTS[value].label}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {Object.entries(SORTS).map(([key, { label, icon }]) => (
            <SelectItem key={key} value={key}>
              {icon} {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
