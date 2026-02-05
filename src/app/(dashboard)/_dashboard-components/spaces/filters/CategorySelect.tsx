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
import { useState } from "react";

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

type CategoryKey = keyof typeof CATEGORIES;

export const CategorySelect = () => {
  const [value, setValue] = useState<CategoryKey>("all-categories");

  const handleValueChange = (value: string) => {
    setValue(value as CategoryKey);
    console.log(value);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {CATEGORIES[value].icon} {CATEGORIES[value].label}
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
