import type { Metadata } from "next";

import { SpaceDetailsPageClient } from "@/features/spaces/components/space-details/SpaceDetailsPageClient";

interface SpaceDetailsPageProps {
  params: Promise<{
    spaceId: string;
  }>;
}

export default async function SpaceDetailsPage({
  params,
}: SpaceDetailsPageProps) {
  const { spaceId } = await params;

  return <SpaceDetailsPageClient spaceId={spaceId} />;
}

export const metadata: Metadata = {
  title: "Space Details",
  description: "View space details, members, and shared files.",
};
