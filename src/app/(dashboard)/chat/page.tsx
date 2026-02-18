import { ChatsGrid } from "@/features/chat/components/ChatsGrid";
import { ChatsHeader } from "@/features/chat/components/ChatsHeader";
import { Metadata } from "next";

export default function ChatsPage() {
  return (
    <div className="space-y-10 pt-15 w-full max-w-4xl mx-auto">
      <ChatsHeader />
      <ChatsGrid />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with your team",
};
