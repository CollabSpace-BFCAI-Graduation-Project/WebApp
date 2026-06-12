import { SingleChatPageClient } from "@/features/chat/components/SingleChatPageClient";
import type { Metadata } from "next";

interface SingleChatPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function SingleChatPage({ params }: SingleChatPageProps) {
  const { chatId } = await params;

  return <SingleChatPageClient spaceId={chatId} />;
}

export async function generateMetadata({
  params,
}: SingleChatPageProps): Promise<Metadata> {
  const { chatId } = await params;

  return {
    title: `Chat ${chatId}`,
  };
}
