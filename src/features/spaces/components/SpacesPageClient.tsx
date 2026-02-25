"use client";
import { Header } from "./header/Header";
import { Filters } from "./filters/Filters";
import { EmptySpaces } from "./EmptySpaces";
import { useSetBreadcrumb } from "@/hooks/useSetBreadcrumb";
import { HouseIcon } from "lucide-react";

export const SpacesPageClient = () => {
  useSetBreadcrumb([
    { label: "Spaces", href: "/", icon: <HouseIcon className="size-4" /> },
  ]);
  return (
    <div className="space-y-6 p-6">
      <Header />
      <Filters />
      <EmptySpaces />
    </div>
  );
};
