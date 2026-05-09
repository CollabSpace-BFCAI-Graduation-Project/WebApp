import { SpacesPageClient } from "@/features/spaces/components/SpacesPageClient";
import { Metadata } from "next";

export default function SpacesPage() {
  return <SpacesPageClient />;
}

export const metadata: Metadata = {
  title: "Spaces",
  description: "Manage your spaces",
};
