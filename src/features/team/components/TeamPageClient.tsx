"use client";

import { HomeIcon } from "@/components/ui/home";
import { UsersIcon } from "@/components/ui/users";
import { useSetBreadcrumb } from "@/hooks/useSetBreadcrumb";

export const TeamPageClient = () => {
  useSetBreadcrumb([
    { label: "Spaces", href: "/", icon: <HomeIcon size={18} /> },
    { label: "Team", icon: <UsersIcon size={18} /> },
  ]);
  return <div className="flex flex-col md:flex-row p-6 gap-6"></div>;
};
