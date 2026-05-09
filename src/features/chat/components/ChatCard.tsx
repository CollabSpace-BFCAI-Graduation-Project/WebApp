import { cn } from "@/lib/utils";
import { Chat } from "../types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ChatCardProps {
  chat: Chat;
}

export const ChatCard = ({ chat }: ChatCardProps) => {
  return (
    <Link
      href={`chat/${chat.id}`}
      className="border p-5 rounded-xl flex items-center justify-between cursor-pointer bg-secondary hover:bg-secondary/80 transition duration-300 group hover:-translate-0.5"
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(chat.background, " w-10 aspect-square rounded-xl")}
        ></div>
        <div className="flex flex-col">
          <h2 className="font-semibold group-hover:text-primary transition duration-300">
            {chat.name}
          </h2>
          <p className="text-muted-foreground text-sm">{chat.category}</p>
        </div>
      </div>
      <ArrowRight className="opacity-0 -translate-x-3 group-hover:opacity-100 transition duration-300 group-hover:translate-0 size-5" />
    </Link>
  );
};
