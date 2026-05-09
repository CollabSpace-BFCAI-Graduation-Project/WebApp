import { Metadata } from "next";
import ChatsPageClient from "@/features/chat/components/ChatsPageClient";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with your team",
};

export default function ChatsPage() {
  return <ChatsPageClient />;
}
