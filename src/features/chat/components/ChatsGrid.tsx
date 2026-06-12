import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import type { Space } from "@/lib/types/api-types";

import { ChatCard } from "./ChatCard";
import { staggerContainer } from "@/lib/animations";

interface ChatsGridProps {
  spaces: Space[];
  isLoading: boolean;
}

export const ChatsGrid = ({ spaces, isLoading }: ChatsGridProps) => {
  if (isLoading) {
    return (
      <div className="m-4 grid max-h-[388px] grid-cols-1 gap-4 overflow-y-auto p-0.5 pr-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!spaces.length) {
    return (
      <div className="m-4 rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">No space chats yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create or join a space to start a text chat.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="m-4 grid max-h-[388px] grid-cols-1 gap-4 overflow-y-auto p-0.5 pr-4 sm:grid-cols-2"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {spaces.map((space, index) => (
        <ChatCard key={space.id} space={space} />
      ))}
    </motion.div>
  );
};
