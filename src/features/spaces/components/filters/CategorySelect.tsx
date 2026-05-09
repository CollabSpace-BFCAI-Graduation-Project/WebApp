"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeXml, Coffee, GraduationCap, Layers, Palette } from "lucide-react";
import { useCategory } from "../../hooks/useCategory";
import { CategoryFilter } from "../../types";

const CATEGORIES = {
  "all-categories": {
    label: "All Categories",
    icon: <Layers className="text-primary" />,
  },
  creative: {
    label: "Creative",
    icon: <Palette className="text-primary" />,
  },
  tech: {
    label: "Tech",
    icon: <CodeXml className="text-primary" />,
  },
  education: {
    label: "Education",
    icon: <GraduationCap className="text-primary" />,
  },
  meeting: {
    label: "Meeting",
    icon: <Coffee className="text-primary" />,
  },
} as const;


export const CategorySelect = () => {
  const [category, setCategory] = useCategory();

  return (
    <Select
      value={category}
      onValueChange={(value: CategoryFilter) => {
        setCategory(value);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {CATEGORIES[category].icon} {CATEGORIES[category].label}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {Object.entries(CATEGORIES).map(([key, { label, icon }]) => (
            <SelectItem key={key} value={key}>
              {icon}
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
