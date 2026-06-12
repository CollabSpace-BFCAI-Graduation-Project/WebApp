import type { Metadata } from "next";

import { SpaceFilesPageClient } from "@/features/spaces/components/space-details/SpaceFilesPageClient";

interface SpaceFilesPageProps {
  params: Promise<{
    spaceId: string;
  }>;
}

export default async function SpaceFilesPage({ params }: SpaceFilesPageProps) {
  const { spaceId } = await params;

  return <SpaceFilesPageClient spaceId={spaceId} />;
}

export const metadata: Metadata = {
  title: "Space Files",
  description: "View shared files, folders, and links for a space.",
};
