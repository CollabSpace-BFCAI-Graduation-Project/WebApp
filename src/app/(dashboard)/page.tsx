import { Filters } from "@/features/spaces/components/filters/Filters";
import { Header } from "@/features/spaces/components/header/Header";
import { SpacesList } from "@/features/spaces/components/SpacesList";
import { PageMotion } from "@/components/shared/PageMotion";
import { Metadata } from "next";

export default function SpacesPage() {
  return <PageMotion className="space-y-6 p-6">
      <Header />
      <Filters />
      <SpacesList />
    </PageMotion>
}

export const metadata: Metadata = {
  title: "Spaces",
  description: "Manage your spaces",
};
