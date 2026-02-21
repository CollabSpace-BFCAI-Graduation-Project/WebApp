import { Channels } from "@/features/chat/components/Channels";
import { chats } from "@/lib/dummyData";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

interface SingleChatPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function SingleChatPage({ params }: SingleChatPageProps) {
  const { chatId } = await params;
  const chat = chats.find((chat) => chat.id === parseInt(chatId));
  if (!chat) {
    redirect("/chat");
  }

  return (
    <div className="flex p-6 h-screen gap-6">
      <div className="hidden sm:flex w-1/4 flex-col gap-4 rounded-lg overflow-hidden border overflow-y-auto">
        <div className="bg-primary/50 p-4">
          <Link href={"/chat"} className="flex items-center gap-2 w-fit">
            <ArrowLeft className="size-4" />
            <h1 className="text-lg font-semibold">{chat.name}</h1>
          </Link>
        </div>
        <Channels />
      </div>
      <div className="w-full sm:w-3/4 flex-col gap-4 rounded-lg overflow-hidden border">
        <div className="bg-primary/50 p-5 flex items-center gap-2">
          <div
            className={cn(chat.background, " w-10 aspect-square rounded-xl")}
          ></div>
          <h1>{chat.name}</h1>
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
  if (!chat) {
    redirect("/chat");
  }
  return {
    title: chat.name,
  };
};
