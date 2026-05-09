import { MessageSquareIcon } from "@/components/ui/message-square";

export const ChatsHeader = () => {
  return (
    <div className="flex justify-center items-center flex-col  gap-5">
      <div className="rounded-full bg-primary p-5 flex justify-center items-center">
        <MessageSquareIcon size={28} className="text-primary-foreground" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-center">Jump into Chat</h1>
        <p className="text-muted-foreground text-center">
          Choose a space to start chatting.
        </p>
      </div>
    </div>
  );
};
