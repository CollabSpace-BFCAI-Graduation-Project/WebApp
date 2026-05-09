import { chats } from "@/lib/dummyData";
import { ChatCard } from "./ChatCard";

export const ChatsGrid = () => {
  return (
    <div className="overflow-y-auto max-h-[388px] m-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pr-4 p-0.5">
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
};
