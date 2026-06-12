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
import { useSort } from "../../hooks/useSort";
import { SortFilter } from "../../types";

const SORTS = {
  "newest-first": {
    label: "Newest First",
    icon: <Clock className="text-primary" />,
  },
  "oldest-first": {
    label: "Oldest First",
    icon: <History className="text-primary" />,
  },
  "name-asc": {
    label: "Name (A-Z)",
    icon: <ArrowDownZa className="text-primary" />,
  },
  "name-desc": {
    label: "Name (Z-A)",
    icon: <ArrowUpAZ className="text-primary" />,
  },
  "by-category": {
    label: "By Category",
    icon: <FolderOpen className="text-primary" />,
  },
} as const;


export const SortSelect = () => {
  const [sort, setSort] = useSort();

  return (
    <Select
      value={sort}
      onValueChange={(value) => {
        if (value) setSort(value as SortFilter);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {SORTS[sort].icon} {SORTS[sort].label}
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
