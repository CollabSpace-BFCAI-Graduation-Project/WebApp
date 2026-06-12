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
import { useStatus } from "../../hooks/useStatus";
import { StatusFilter } from "../../types";

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

export const StatusSelect = () => {
  const [status, setStatus] = useStatus();

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        if (value) setStatus(value as StatusFilter);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {STATUSES[status].icon} {STATUSES[status].label}
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
