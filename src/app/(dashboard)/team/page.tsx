import { TeamPageClient } from "@/features/team/components/TeamPageClient";
import { Metadata } from "next";

export default function TeamPage() {
  return <TeamPageClient />;
}

export const metadata: Metadata = {
  title: "Team",
  description: "Manage your team",
};
