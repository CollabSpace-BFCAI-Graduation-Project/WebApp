import { Channels } from "@/features/chat/components/Channels";
import { chats } from "@/lib/dummyData";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface SingleChatPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function SingleChatPage({ params }: SingleChatPageProps) {
  const { chatId } = await params;
  const chat = chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex p-6 h-screen gap-6">
      <div className="hidden sm:flex w-1/4 flex-col gap-4 rounded-lg overflow-hidden border overflow-y-auto">
        <div className="bg-primary/50 p-5 flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <h1>{chat?.name}</h1>
        </div>
        <Channels />
      </div>
      <div className="w-full sm:w-3/4 flex-col gap-4 rounded-lg overflow-hidden border">
        <div className="bg-primary/50 p-5 flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <h1>{chat?.name}</h1>
        </div>
      </div>
    </div>
  );
}

export const generateMetadata = async ({
  params,
}: SingleChatPageProps): Promise<Metadata> => {
  const { chatId } = await params;
  const chat = chats.find((chat) => chat.id === parseInt(chatId));
  return {
    title: chat?.name,
  };
};
