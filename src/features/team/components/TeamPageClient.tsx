"use client";

import { useSetBreadcrumb } from "@/hooks/useSetBreadcrumb";
import { HouseIcon, Users } from "lucide-react";

export const TeamPageClient = () => {
  useSetBreadcrumb([
    { label: "Spaces", href: "/", icon: <HouseIcon className="size-4" /> },
    { label: "Team", icon: <Users className="size-4" /> },
  ]);
  return <div className="flex flex-col md:flex-row p-6 gap-6"></div>;
};
