import { SingleChatPageClient } from "@/features/chat/components/SingleChatPageClient";
import { chats } from "@/lib/dummyData";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface SingleChatPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function SingleChatPage({ params }: SingleChatPageProps) {
  const { chatId } = await params;
  const chat = chats.find((chat) => chat.id === Number(chatId));

  if (!chat) {
    notFound();
  }

  return <SingleChatPageClient chat={chat} />;
}

export async function generateMetadata({
  params,
}: SingleChatPageProps): Promise<Metadata> {
  const { chatId } = await params;
  const chat = chats.find((chat) => chat.id === Number(chatId));

  if (!chat) {
    return {
      title: "Chat Not Found",
    };
  }

  return {
    title: chat.name,
  };
}
