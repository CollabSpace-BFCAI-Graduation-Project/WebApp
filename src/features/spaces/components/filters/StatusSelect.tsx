"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, GlobeX, Wifi } from "lucide-react";
import { useState } from "react";

const STATUSES = {
  "any-status": {
    label: "Any Status",
    icon: <Activity className="text-primary" />,
  },
  online: {
    label: "Online",
    icon: <Wifi className="text-primary" />,
  },
  offline: {
    label: "Offline",
    icon: <GlobeX className="text-primary" />,
  },
} as const;

type StatusKey = keyof typeof STATUSES;

export const StatusSelect = () => {
  const [value, setValue] = useState<StatusKey>("any-status");

  const handleValueChange = (value: string) => {
    setValue(value as StatusKey);
    console.log(value);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          {STATUSES[value].icon} {STATUSES[value].label}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {Object.entries(STATUSES).map(([key, { label, icon }]) => (
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
