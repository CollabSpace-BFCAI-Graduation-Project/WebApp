import { EmptySpaces } from "@/features/spaces/components/EmptySpaces";
import { Filters } from "@/features/spaces/components/filters/Filters";
import { Header } from "@/features/spaces/components/header/Header";
import { Metadata } from "next";

export default function HomePage() {
  return (
    <div className="space-y-6 p-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <Header />
      <Filters />
      <EmptySpaces />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Spaces",
  description: "Manage your spaces",
};