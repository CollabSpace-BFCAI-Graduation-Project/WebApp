import { Filters } from "./_dashboard-components/spaces/filters/Filters";
import { Header } from "./_dashboard-components/spaces/Header";
import { EmptySpaces } from "./_dashboard-components/spaces/EmptySpaces";
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