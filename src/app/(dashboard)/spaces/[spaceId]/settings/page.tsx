import { SpaceSettingsPageClient } from "@/features/spaces/components/space-settings/SpaceSettingsPageClient";
import type { Metadata } from "next";

interface SpaceSettingsPageProps {
  params: Promise<{
    spaceId: string;
  }>;
}

export default async function SpaceSettingsPage({
  params,
}: SpaceSettingsPageProps) {
  const { spaceId } = await params;

  return <SpaceSettingsPageClient spaceId={spaceId} />;
}

export async function generateMetadata({
  params,
}: SpaceSettingsPageProps): Promise<Metadata> {
  const { spaceId } = await params;
  return { title: `Space settings · ${spaceId}` };
}
