"use client";
import { Header } from "./header/Header";
import { Filters } from "./filters/Filters";
import { EmptySpaces } from "./EmptySpaces";
import { useSetBreadcrumb } from "@/hooks/useSetBreadcrumb";
import { HomeIcon } from "@/components/ui/home";

export const SpacesPageClient = () => {
  useSetBreadcrumb([
    { label: "Spaces", href: "/", icon: <HomeIcon size={18} /> },
  ]);
  return (
    <div className="space-y-6 p-6">
      <Header />
      <Filters />
      <EmptySpaces />
    </div>
  );
};
